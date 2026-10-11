import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { readingMinutes } from "@/lib/blog-utils";
import { PostCatalog } from "@/components/blog/post-catalog";
export const metadata: Metadata = {
  title: "Journal & notes",
  description:
    "Research notes, build logs and ideas from Sarwad Hasan Siddiqui's workbench.",
};
export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <section
      id="top"
      className="relative mx-auto max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-36"
    >
      <div className="mb-10 max-w-3xl">
        <p className="hud-label mb-5 text-ion">
          Transmissions from the workbench
        </p>
        <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-6xl">
          A journal of <span className="text-gradient">work in motion.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-dim">
          Experiments, lessons from building, and ideas I want to spend more
          time with.
        </p>
      </div>
      <PostCatalog
        posts={posts.map(
          ({
            id,
            slug,
            title,
            excerpt,
            coverUrl,
            tags,
            publishedDate,
            featured,
            body,
          }) => ({
            id,
            slug,
            title,
            excerpt,
            coverUrl,
            tags,
            publishedDate,
            featured,
            minutes: readingMinutes(body),
          }),
        )}
      />
    </section>
  );
}
