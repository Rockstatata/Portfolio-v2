import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(
  new URL("../google-contact.gs", import.meta.url),
  "utf8",
);
function relay() {
  const rows = [];
  const emails = [];
  const state = {
    mailFails: false,
    sheetFails: false,
    lockBusy: false,
    releases: 0,
  };
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push(Array.from(row)),
    setFrozenRows() {},
    setColumnWidth() {},
    getRange(row, column, height = 1, width = 1) {
      return {
        setFontWeight() {},
        getValues: () =>
          rows
            .slice(row - 1, row - 1 + height)
            .map((r) => r.slice(column - 1, column - 1 + width)),
        getValue: () => rows[row - 1][column - 1],
        setValue: (value) => {
          rows[row - 1][column - 1] = value;
        },
        setValues: (values) =>
          values.forEach((r, i) =>
            r.forEach((value, j) => {
              rows[row - 1 + i][column - 1 + j] = value;
            }),
          ),
        createTextFinder(value) {
          return {
            matchEntireCell() {
              return this;
            },
            findNext() {
              const index = rows.findIndex(
                (r, i) =>
                  i >= row - 1 &&
                  i < row - 1 + height &&
                  r[column - 1] === value,
              );
              return index < 0 ? null : { getRow: () => index + 1 };
            },
          };
        },
      };
    },
  };
  const context = {
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) =>
          ({
            CONTACT_SECRET: "test-secret",
            CONTACT_SHEET_ID: "test-sheet",
            CONTACT_EMAIL: "owner@example.com",
          })[key],
      }),
    },
    SpreadsheetApp: {
      flush() {},
      openById() {
        if (state.sheetFails) throw Error("sheet unavailable");
        return {
          getSheetByName: () => (rows.length ? sheet : null),
          insertSheet: () => sheet,
        };
      },
    },
    MailApp: {
      sendEmail(email) {
        if (state.mailFails) throw Error("quota");
        emails.push(email);
      },
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => !state.lockBusy,
        releaseLock: () => state.releases++,
      }),
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }),
    },
  };
  runInNewContext(source, context);
  const payload = {
    id: "portfolio-message-42",
    name: "Visitor Test",
    email: "visitor@example.com",
    body: "Please tell me about your research.",
    secret: "test-secret",
  };
  return {
    rows,
    emails,
    state,
    post: (changes = {}) =>
      context.doPost({
        postData: { contents: JSON.stringify({ ...payload, ...changes }) },
      }),
    raw: (body) => context.doPost({ postData: { contents: body } }),
  };
}

test("rejects unauthorized and invalid requests before using Google services", () => {
  const r = relay();
  assert.equal(r.post({ secret: "wrong" }).error, "unauthorized");
  assert.equal(r.post({ email: "not-an-email" }).error, "invalid_payload");
  assert.equal(r.raw("not JSON").error, "invalid_payload");
  assert.equal(r.raw("null").error, "invalid_payload");
  assert.equal(r.rows.length, 0);
  assert.equal(r.emails.length, 0);
});

test("saves a row, sends an email with Reply-To, and deduplicates retries", () => {
  const r = relay();
  assert.deepEqual(r.post(), { ok: true, sheetSaved: true, emailSent: true });
  assert.deepEqual(r.post(), { ok: true, sheetSaved: true, emailSent: true });
  assert.equal(r.rows.length, 2);
  assert.equal(r.rows[1][5], "SENT");
  assert.equal(r.emails.length, 1);
  assert.equal(r.emails[0].to, "owner@example.com");
  assert.equal(r.emails[0].replyTo, "visitor@example.com");
  assert.equal(r.state.releases, 2);
});

test("email failure preserves the Sheet row and retries only the missing email", () => {
  const r = relay();
  r.state.mailFails = true;
  assert.deepEqual(r.post(), {
    ok: false,
    error: "email_failed",
    sheetSaved: true,
    emailSent: false,
  });
  assert.equal(r.rows[1][5], "EMAIL_FAILED");
  r.state.mailFails = false;
  assert.equal(r.post().ok, true);
  assert.equal(r.rows.length, 2);
  assert.equal(r.emails.length, 1);
  assert.equal(r.rows[1][5], "SENT");
});

test("escapes spreadsheet formulas and strips email subject line breaks", () => {
  const r = relay();
  assert.equal(
    r.post({
      name: "=Name\r\nTest",
      body: '  =IMPORTXML("https://example.com")',
    }).ok,
    true,
  );
  assert.equal(r.rows[1][2], "'=Name\r\nTest");
  assert.equal(r.rows[1][4][0], "'");
  assert.doesNotMatch(r.emails[0].subject, /[\r\n]/);
});

test("lock contention and Sheet failures never claim email delivery", () => {
  const r = relay();
  r.state.lockBusy = true;
  assert.equal(r.post().error, "busy");
  r.state.lockBusy = false;
  r.state.sheetFails = true;
  assert.deepEqual(r.post(), {
    ok: false,
    error: "relay_failed",
    sheetSaved: false,
    emailSent: false,
  });
  assert.equal(r.emails.length, 0);
  assert.equal(r.state.releases, 1);
});
