import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, hasDatabase, schema } from "@/lib/db";
import { CONTENT_TAG } from "@/lib/content";
import type { Post } from "@/lib/db/schema";

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  if (!hasDatabase) return [];
  return db()
    .select()
    .from(schema.posts)
    .where(
      and(eq(schema.posts.visible, true), eq(schema.posts.status, "published")),
    )
    .orderBy(
      desc(schema.posts.featured),
      desc(schema.posts.publishedDate),
      asc(schema.posts.sortOrder),
      desc(schema.posts.id),
    );
}
export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug) ?? null;
}
