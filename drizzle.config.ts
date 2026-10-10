import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL ?? "";
const pglite = url.startsWith("pglite:");

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  ...(pglite ? { driver: "pglite" as const } : {}),
  dbCredentials: { url: pglite ? url.slice("pglite:".length) : url },
});
