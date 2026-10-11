// Paste the generated private copy into your own Google Apps Script project.
// The setup helper fills this configuration without committing credentials.
const INITIAL_CONTACT_CONFIGURATION = {
  sheetId: "",
  secret: "",
  email: "sarwad015@gmail.com",
};
const CONTACT_HEADERS = [
  "Message ID",
  "Received at",
  "Name",
  "Email",
  "Message",
  "Email status",
  "Email sent at",
];

function setupPortfolioContact() {
  const config = INITIAL_CONTACT_CONFIGURATION;
  if (!config.sheetId || config.secret.length < 32)
    throw new Error(
      "Generate your private script with the portfolio setup helper first.",
    );
  PropertiesService.getScriptProperties().setProperties({
    CONTACT_SHEET_ID: config.sheetId,
    CONTACT_SECRET: config.secret,
    CONTACT_EMAIL: config.email,
  });
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  contactSheet_(spreadsheet);
  MailApp.getRemainingDailyQuota();
  Logger.log(
    "Setup ready. Deploy as a web app, executing as yourself, accessible to Anyone. The shared secret protects submissions.",
  );
}

function doGet() {
  return contactJson_({ ok: true, service: "portfolio-contact-relay" });
}

function doPost(event) {
  let data;
  try {
    data = JSON.parse(event.postData.contents);
  } catch (_) {
    return contactJson_({ ok: false, error: "invalid_payload" });
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    return contactJson_({ ok: false, error: "invalid_payload" });
  const properties = PropertiesService.getScriptProperties();
  const secret = properties.getProperty("CONTACT_SECRET");
  if (!secret || typeof data.secret !== "string" || data.secret !== secret)
    return contactJson_({ ok: false, error: "unauthorized" });
  if (
    typeof data.id !== "string" ||
    !/^[a-zA-Z0-9-]{1,100}$/.test(data.id) ||
    typeof data.name !== "string" ||
    data.name.trim().length < 2 ||
    data.name.length > 120 ||
    typeof data.email !== "string" ||
    data.email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    typeof data.body !== "string" ||
    data.body.trim().length < 10 ||
    data.body.length > 5000
  )
    return contactJson_({ ok: false, error: "invalid_payload" });
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return contactJson_({ ok: false, error: "busy" });
  let sheetSaved = false;
  try {
    const sheet = contactSheet_(
      SpreadsheetApp.openById(properties.getProperty("CONTACT_SHEET_ID")),
    );
    const last = sheet.getLastRow();
    const match =
      last > 1
        ? sheet
            .getRange(2, 1, last - 1, 1)
            .createTextFinder(data.id)
            .matchEntireCell(true)
            .findNext()
        : null;
    let row = match ? match.getRow() : 0;
    if (!row) {
      sheet.appendRow([
        data.id,
        new Date().toISOString(),
        contactText_(data.name),
        contactText_(data.email),
        contactText_(data.body),
        "PENDING",
        "",
      ]);
      row = sheet.getLastRow();
      SpreadsheetApp.flush();
    }
    sheetSaved = true;
    if (sheet.getRange(row, 6).getValue() === "SENT")
      return contactJson_({ ok: true, sheetSaved: true, emailSent: true });
    try {
      MailApp.sendEmail({
        to: properties.getProperty("CONTACT_EMAIL"),
        subject: "Portfolio contact: " + data.name.replace(/[\r\n]+/g, " "),
        body:
          "Name: " +
          data.name +
          "\nEmail: " +
          data.email +
          "\nMessage ID: " +
          data.id +
          "\n\n" +
          data.body +
          "\n\nView all messages: https://portfolio-v2-sarwad.vercel.app/admin/messages",
        replyTo: data.email,
        name: "Portfolio Contact",
      });
    } catch (_) {
      sheet.getRange(row, 6).setValue("EMAIL_FAILED");
      SpreadsheetApp.flush();
      return contactJson_({
        ok: false,
        error: "email_failed",
        sheetSaved: true,
        emailSent: false,
      });
    }
    sheet
      .getRange(row, 6, 1, 2)
      .setValues([["SENT", new Date().toISOString()]]);
    SpreadsheetApp.flush();
    return contactJson_({ ok: true, sheetSaved: true, emailSent: true });
  } catch (_) {
    return contactJson_({
      ok: false,
      error: "relay_failed",
      sheetSaved: sheetSaved,
      emailSent: false,
    });
  } finally {
    lock.releaseLock();
  }
}

function contactSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName("Messages");
  if (!sheet) sheet = spreadsheet.insertSheet("Messages");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONTACT_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONTACT_HEADERS.length).setFontWeight("bold");
    sheet.setColumnWidth(5, 500);
  } else {
    const headers = sheet
      .getRange(1, 1, 1, CONTACT_HEADERS.length)
      .getValues()[0];
    if (headers.join("|") !== CONTACT_HEADERS.join("|"))
      throw new Error(
        "Messages tab contains different data. Rename that tab before setting up the contact relay.",
      );
  }
  return sheet;
}

// Prevent visitor input from being interpreted as a spreadsheet formula.
function contactText_(value) {
  return /^\s*[=+\-@]/.test(value) ? "'" + value : value;
}
function contactJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
