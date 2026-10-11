import { readFileSync } from "node:fs";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { createDatabase } from "../src/lib/db/client";

config({ path: ".env.local", quiet: true });
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const db = createDatabase(process.env.DATABASE_URL);
  await db.execute(
    sql.raw(
      readFileSync(new URL("./sql/001-posts.sql", import.meta.url), "utf8"),
    ),
  );
  console.log("Blog table ready; existing portfolio content preserved.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
