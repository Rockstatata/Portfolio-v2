import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parse } from "dotenv";

const envFile = ".env.local";
let source = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
const env = parse(source);
let sheet = process.argv[2];
if (!sheet) {
  const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  sheet = await reader.question(
    "Create a sheet at https://sheets.new, then paste its URL here: ",
  );
  reader.close();
}
const sheetId =
  sheet.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? sheet;
if (!/^[a-zA-Z0-9_-]{20,}$/.test(sheetId))
  throw new Error("Paste a Google Sheets URL or its spreadsheet ID.");
const secret =
  env.CONTACT_WEBHOOK_SECRET?.length >= 32
    ? env.CONTACT_WEBHOOK_SECRET
    : randomBytes(32).toString("base64url");
const values = { CONTACT_SHEET_ID: sheetId, CONTACT_WEBHOOK_SECRET: secret };
for (const [key, value] of Object.entries(values)) {
  source =
    source.replace(new RegExp(`^${key}=.*(?:\\r?\\n|$)`, "gm"), "").trimEnd() +
    `\n${key}=${value}\n`;
}
writeFileSync(envFile, source);
mkdirSync(".data/contact-setup", { recursive: true });
const template = readFileSync("scripts/google-contact.gs", "utf8");
const config = { sheetId, secret, email: "sarwad015@gmail.com" };
const script = template.replace(
  /const INITIAL_CONTACT_CONFIGURATION = [\s\S]*?;/,
  `const INITIAL_CONTACT_CONFIGURATION = ${JSON.stringify(config)};`,
);
writeFileSync(".data/contact-setup/Code.gs", script);
writeFileSync(
  ".data/contact-setup/vercel.env",
  `CONTACT_WEBHOOK_URL=${env.CONTACT_WEBHOOK_URL ?? "PASTE_YOUR_DEPLOYED_EXEC_URL"}\nCONTACT_WEBHOOK_SECRET=${secret}\n`,
);
console.log("Private Google script prepared: .data/contact-setup/Code.gs");
console.log(
  "Vercel environment values prepared: .data/contact-setup/vercel.env",
);
console.log(
  "These files contain your shared secret and are excluded from Git. Follow docs/contact-setup.md.",
);
