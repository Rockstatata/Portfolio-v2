import { defineConfig } from "@playwright/test";

process.env.E2E_DATABASE_URL = `pglite:./.data/e2e-${Date.now()}`;
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3006",
    browserName: "chromium",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run test:server",
    url: "http://localhost:3006",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: process.env.E2E_DATABASE_URL,
      ADMIN_PASSWORD: "portfolio-e2e-only",
      ADMIN_SESSION_SECRET: "portfolio-e2e-only-secret-at-least-32-characters",
      NEXT_DIST_DIR: `.next-e2e/run-${Date.now()}`,
      CONTACT_WEBHOOK_URL: "http://127.0.0.1:3010",
      CONTACT_WEBHOOK_SECRET: "portfolio-contact-e2e-only",
    },
  },
});
