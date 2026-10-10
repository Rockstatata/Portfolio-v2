import "server-only";
import { createDatabase, type Database } from "./client";
import * as schema from "./schema";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

// Kept on globalThis so dev hot-reloads reuse one connection (PGlite allows a single opener).
const globalForDb = globalThis as unknown as { portfolioDb?: Database };

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local to enable the admin dashboard.",
    );
  }
  globalForDb.portfolioDb ??= createDatabase(process.env.DATABASE_URL);
  return globalForDb.portfolioDb;
}

export { schema };
