"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { Post } from "@/lib/db/schema";
import { displayPostDate } from "@/lib/blog-utils";
import { PostCover } from "./post-cover";

export type PostSummary = Pick<
  Post,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "coverUrl"
  | "tags"
  | "publishedDate"
  | "featured"
> & { minutes: number };

export function PostCatalog({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const tags = useMemo(
    () => ["All", ...new Set(posts.flatMap((p) => p.tags))],
    [posts],
  );
  const filtered = posts.filter(
    (p) =>
      (topic === "All" || p.tags.includes(topic)) &&
      `${p.title} ${p.excerpt} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="glass flex min-w-0 items-center gap-3 rounded-2xl px-4">
          <Search className="size-4 shrink-0 text-ion" />
          <span className="sr-only">Search journal</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search thoughts, topics, experiments…"
            className="min-h-12 w-full min-w-0 bg-transparent text-base text-ink outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filter by topic">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={tag === topic}
              onClick={() => setTopic(tag)}
              className={`min-h-11 rounded-full border px-4 text-xs transition ${tag === topic ? "border-ion/40 bg-ion/10 text-ion" : "border-line text-dim"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="mb-5 font-mono text-xs text-dim">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        {topic !== "All" ? ` in ${topic}` : " in the journal"}
      </p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="blog-card glass group flex min-w-0 flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:border-ion/40"
          >
            {post.coverUrl ? (
              <div className="aspect-[16/9] overflow-hidden bg-hull">
                <PostCover
                  src={post.coverUrl}
                  alt=""
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="blog-cover relative grid h-32 place-items-center overflow-hidden border-b border-line">
                <span className="font-mono text-xs tracking-[0.25em] text-ion/70">
                  FIELD NOTE / {String(post.id).padStart(3, "0")}
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-nebula/10 px-2.5 py-1 text-[0.65rem] text-plasma"
                  >
                    {tag}
                  </span>
                ))}
                {post.featured && (
                  <span className="text-[0.65rem] text-flare">Featured</span>
                )}
              </div>
              <h2 className="font-display text-lg leading-snug text-white">
                {post.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-dim">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6 font-mono text-[0.65rem] text-dim">
                <span>
                  {displayPostDate(post.publishedDate)} · {post.minutes} min
                  read
                </span>
                <ArrowUpRight className="size-4 text-ion transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="glass rounded-3xl px-6 py-16 text-center">
          <p className="font-display text-xl text-white">
            {posts.length
              ? "No signals found."
              : "The next signal is taking shape."}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-dim">
            {posts.length
              ? "Try a different search or topic."
              : "Research notes, build logs and ideas from the workbench will appear here as I publish them."}
          </p>
          {posts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("All");
              }}
              className="mt-6 min-h-11 rounded-full border border-ion/30 px-5 text-sm text-ion"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
