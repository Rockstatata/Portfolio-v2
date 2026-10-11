import { execFileSync } from "node:child_process";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../src/lib/db/schema";
import * as seed from "../src/content/seed";

export default async function setup() {
  const url = process.env.E2E_DATABASE_URL;
  if (!url?.startsWith("pglite:./.data/e2e-"))
    throw new Error("Tests require an isolated local database");
  const ddl = execFileSync(
    process.execPath,
    [
      "node_modules/drizzle-kit/bin.cjs",
      "export",
      "--dialect=postgresql",
      "--schema=./src/lib/db/schema.ts",
    ],
    { encoding: "utf8" },
  );
  const client = new PGlite(url.slice("pglite:".length));
  await client.exec(ddl);
  const db = drizzle(client, { schema });
  await db.insert(schema.profile).values({ id: 1, ...seed.seedProfile });
  await db
    .insert(schema.experiences)
    .values(
      seed.seedExperiences.map((row, sortOrder) => ({ ...row, sortOrder })),
    );
  await db
    .insert(schema.education)
    .values(
      seed.seedEducation.map((row, sortOrder) => ({ ...row, sortOrder })),
    );
  await db
    .insert(schema.projects)
    .values(seed.seedProjects.map((row, sortOrder) => ({ ...row, sortOrder })));
  await db
    .insert(schema.skills)
    .values(seed.seedSkills.map((row, sortOrder) => ({ ...row, sortOrder })));
  // Close PGlite before Next opens the same test database.
  await client.close();
}

setup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
