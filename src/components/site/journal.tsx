import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts } from "@/lib/posts";
import { SectionHeading } from "@/components/ui/section-heading";
import { displayPostDate, readingMinutes } from "@/lib/blog-utils";
export async function Journal() {
  const posts = (await getPosts()).slice(0, 3);
  return (
    <section
      id="journal"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-32"
    >
      <SectionHeading
        index="08"
        eyebrow="Field notes"
        title={
          <>
            Ideas beyond{" "}
            <span className="text-gradient">the finished work.</span>
          </>
        }
        intro="Research notes, experiments and lessons from the workbench."
      />
      {posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass blog-card group flex min-w-0 flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-ion/40"
            >
              <p className="hud-label text-ion">
                {post.tags[0] || "Field note"}
              </p>
              <h3 className="mt-4 font-display text-lg leading-snug text-white">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-dim">
                {post.excerpt}
              </p>
              <div className="mt-auto flex justify-between gap-3 pt-6 text-xs text-dim">
                <span>
                  {displayPostDate(post.publishedDate)} ·{" "}
                  {readingMinutes(post.body)} min
                </span>
                <ArrowUpRight className="size-4 text-ion" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-start justify-between gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="font-display text-lg text-white">
              A new channel is opening.
            </h3>
            <p className="mt-2 text-sm leading-6 text-dim">
              My journal is where I&apos;ll share what I&apos;m learning along
              the way.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-ion/30 px-5 text-sm text-ion"
          >
            Explore the journal
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
      {posts.length > 0 && (
        <Link
          href="/blog"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-ion"
        >
          All journal entries
          <ArrowUpRight className="size-4" />
        </Link>
      )}
    </section>
  );
}
