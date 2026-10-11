import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { createDatabase } from "../src/lib/db/client";

config({ path: ".env.local", quiet: true });
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const db = createDatabase(process.env.DATABASE_URL);
  const statements = readFileSync(
    new URL("./sql/002-contact-delivery.sql", import.meta.url),
    "utf8",
  )
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  for (const statement of statements) await db.execute(sql.raw(statement));
  console.log("Contact delivery columns ready; existing messages preserved.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
