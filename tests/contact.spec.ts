import { createServer, type Server } from "node:http";
import { expect, test } from "@playwright/test";

let server: Server;
let deliveries: Record<string, unknown>[] = [];
let failing = false;

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    deliveries.push(JSON.parse(body));
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify(
        failing
          ? {
              ok: false,
              error: "email_failed",
              sheetSaved: true,
              emailSent: false,
            }
          : { ok: true, sheetSaved: true, emailSent: true },
      ),
    );
  });
  await new Promise<void>((resolve) =>
    server.listen(3010, "127.0.0.1", resolve),
  );
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
test.beforeEach(() => {
  deliveries = [];
  failing = false;
});

test("contact sends to the Google relay and remains saved in the dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Call sign").fill("Contact Delivery Test");
  await page.getByLabel("Return frequency").fill("contact-test@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("A real form submission to the isolated Google relay test.");
  await page.getByRole("button", { name: "Transmit message" }).click();
  await expect(
    page.getByRole("heading", { name: "Transmission received" }),
  ).toBeVisible();
  await expect.poll(() => deliveries.length).toBe(1);
  expect(deliveries[0]).toMatchObject({
    name: "Contact Delivery Test",
    email: "contact-test@example.com",
    secret: "portfolio-contact-e2e-only",
  });
  await page.goto("/admin/login");
  await page.getByLabel(/passphrase/i).fill("portfolio-e2e-only");
  await page.getByRole("button", { name: /enter/i }).click();
  await page.waitForURL("/admin");
  await page.goto("/admin/messages");
  await expect(
    page.getByText("Contact Delivery Test", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Delivered to Google Sheet and email", { exact: true }),
  ).toBeVisible();
});

test("failed email stays saved and can be retried without a second submission", async ({
  page,
}) => {
  failing = true;
  await page.goto("/");
  await page.getByLabel("Call sign").fill("Contact Retry Test");
  await page.getByLabel("Return frequency").fill("retry-test@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Keep this message safe when the email relay is unavailable.");
  await page.getByRole("button", { name: "Transmit message" }).click();
  await expect(
    page.getByRole("heading", { name: "Transmission received" }),
  ).toBeVisible();
  await expect.poll(() => deliveries.length).toBe(1);
  await page.goto("/admin/login");
  await page.getByLabel(/passphrase/i).fill("portfolio-e2e-only");
  await page.getByRole("button", { name: /enter/i }).click();
  await page.waitForURL("/admin");
  await page.goto("/admin/messages");
  const row = page
    .getByRole("listitem")
    .filter({ hasText: "Contact Retry Test" });
  await expect(
    row.getByText("Delivery needs attention", { exact: true }),
  ).toBeVisible();
  failing = false;
  await row.getByRole("button", { name: "Retry delivery" }).click();
  await expect(
    row.getByText("Delivered to Google Sheet and email", { exact: true }),
  ).toBeVisible();
  expect(deliveries).toHaveLength(2);
  expect(deliveries[1].id).toBe(deliveries[0].id);
  await expect(
    page.getByText("Contact Retry Test", { exact: true }),
  ).toHaveCount(1);
});
