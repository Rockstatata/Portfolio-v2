/**
 * Copies src/content/seed.ts into the database.
 *
 *   npm run db:seed           only fills empty tables (safe to re-run)
 *   npm run db:seed -- --reset wipes content tables first (messages are kept)
 */
import { config } from "dotenv";
import { count } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { createDatabase } from "../src/lib/db/client";
import * as seed from "../src/content/seed";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL missing in .env.local");
  process.exit(1);
}

const db = createDatabase(process.env.DATABASE_URL);
const reset = process.argv.includes("--reset");

const ordered = <T extends object>(rows: T[]) =>
  rows.map((row, i) => ({ ...row, sortOrder: i }));

const lists = [
  ["projects", schema.projects, ordered(seed.seedProjects)],
  ["publications", schema.publications, ordered(seed.seedPublications)],
  ["experiences", schema.experiences, ordered(seed.seedExperiences)],
  ["education", schema.education, ordered(seed.seedEducation)],
  ["achievements", schema.achievements, ordered(seed.seedAchievements)],
  ["skills", schema.skills, ordered(seed.seedSkills)],
  ["focus areas", schema.focusAreas, ordered(seed.seedFocusAreas)],
] as const;

async function main() {
  for (const [name, table, rows] of lists) {
    if (reset) await db.delete(table);
    const [{ n }] = await db.select({ n: count() }).from(table);
    if (n > 0) {
      console.log(`· ${name}: ${n} rows exist, skipped`);
      continue;
    }
    await db.insert(table).values(rows as never);
    console.log(`✓ ${name}: inserted ${rows.length}`);
  }

  if (reset) await db.delete(schema.profile);
  await db
    .insert(schema.profile)
    .values({ id: 1, ...seed.seedProfile })
    .onConflictDoNothing();
  console.log("✓ profile");
}

main()
  // PGlite keeps the process alive, so exit explicitly once done.
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
