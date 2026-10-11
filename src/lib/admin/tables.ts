import "server-only";
import { schema } from "@/lib/db";
import type { CollectionKey } from "./collections";

export const tables = {
  posts: schema.posts,
  projects: schema.projects,
  publications: schema.publications,
  experiences: schema.experiences,
  education: schema.education,
  achievements: schema.achievements,
  skills: schema.skills,
  focusAreas: schema.focusAreas,
} satisfies Record<CollectionKey, unknown>;
