import { createRequire } from "node:module";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzleNeon<typeof schema>>;

/**
 * `postgres://…` connects to Neon over HTTP (production).
 * `pglite:./.data/db` runs an embedded Postgres in-process, handy for local
 * development without an account. Both expose the same Drizzle query API.
 */
export function createDatabase(url: string): Database {
  if (url.startsWith("pglite:")) {
    // Loaded lazily so the WASM build never ships with the Neon path.
    const { PGlite } = createRequire(import.meta.url)(
      "@electric-sql/pglite",
    ) as typeof import("@electric-sql/pglite");
    const client = new PGlite(url.slice("pglite:".length) || undefined);
    return drizzlePglite(client, { schema }) as unknown as Database;
  }
  return drizzleNeon(neon(url), { schema });
}
