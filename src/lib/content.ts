import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, hasDatabase, schema } from "@/lib/db";
import type {
  Achievement,
  Education,
  Experience,
  FocusArea,
  Profile,
  Project,
  Publication,
  Skill,
} from "@/lib/db/schema";
import * as seed from "@/content/seed";

export const CONTENT_TAG = "content";

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  publications: Publication[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
  skills: Skill[];
  focusAreas: FocusArea[];
};

const epoch = new Date(0);

function withMeta<T extends object>(rows: T[]) {
  return rows.map((row, i) => ({
    visible: true,
    ...row,
    id: i + 1,
    sortOrder: i,
    createdAt: epoch,
  }));
}

function seedContent(): SiteContent {
  return {
    profile: { id: 1, updatedAt: epoch, ...seed.seedProfile },
    projects: withMeta(seed.seedProjects),
    publications: withMeta(seed.seedPublications),
    experiences: withMeta(seed.seedExperiences),
    education: withMeta(seed.seedEducation),
    achievements: withMeta(seed.seedAchievements),
    skills: withMeta(seed.seedSkills),
    focusAreas: withMeta(seed.seedFocusAreas),
  };
}

async function dbContent(): Promise<SiteContent> {
  const d = db();
  const {
    projects: p,
    publications: pub,
    experiences: x,
    education: e,
    achievements: a,
    skills: s,
    focusAreas: f,
  } = schema;
  const [
    profileRow,
    projects,
    publications,
    experiences,
    education,
    achievements,
    skills,
    focusAreas,
  ] = await Promise.all([
    d.select().from(schema.profile).where(eq(schema.profile.id, 1)),
    d
      .select()
      .from(p)
      .where(eq(p.visible, true))
      .orderBy(asc(p.sortOrder), asc(p.id)),
    d
      .select()
      .from(pub)
      .where(eq(pub.visible, true))
      .orderBy(asc(pub.sortOrder), asc(pub.id)),
    d
      .select()
      .from(x)
      .where(eq(x.visible, true))
      .orderBy(asc(x.sortOrder), asc(x.id)),
    d
      .select()
      .from(e)
      .where(eq(e.visible, true))
      .orderBy(asc(e.sortOrder), asc(e.id)),
    d
      .select()
      .from(a)
      .where(eq(a.visible, true))
      .orderBy(asc(a.sortOrder), asc(a.id)),
    d
      .select()
      .from(s)
      .where(eq(s.visible, true))
      .orderBy(asc(s.sortOrder), asc(s.id)),
    d
      .select()
      .from(f)
      .where(eq(f.visible, true))
      .orderBy(asc(f.sortOrder), asc(f.id)),
  ]);

  return {
    profile: profileRow[0] ?? { id: 1, updatedAt: epoch, ...seed.seedProfile },
    projects,
    publications,
    experiences,
    education,
    achievements,
    skills,
    focusAreas,
  };
}

/** Everything the public site renders, cached until an admin edit calls updateTag(CONTENT_TAG). */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  return hasDatabase ? dbContent() : seedContent();
}

export async function getProject(slug: string) {
  const { projects } = await getContent();
  return projects.find((p) => p.slug === slug) ?? null;
}
