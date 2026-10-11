import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/posts";
import { getContent } from "@/lib/content";
import { displayPostDate, readingMinutes } from "@/lib/blog-utils";
import { Markdown } from "@/components/blog/markdown";
import { ArticleTools } from "@/components/blog/article-tools";
import { siteUrl } from "@/lib/utils";
import { PostCover } from "@/components/blog/post-cover";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}
async function PostContent({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { profile } = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: profile.name },
    ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
    url: `${siteUrl}/blog/${post.slug}`,
  };
  return (
    <article
      id="top"
      className="relative mx-auto max-w-3xl px-5 pt-28 pb-20 sm:px-8 sm:pt-36"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Link
        href="/blog"
        className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-ion"
      >
        <ArrowLeft className="size-3.5" />
        Back to the journal
      </Link>
      <header className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-nebula/30 px-3 py-1 text-xs text-plasma"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-display text-3xl leading-tight tracking-tight text-white sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-dim">{post.excerpt}</p>
        <div className="my-6 flex flex-wrap gap-3 font-mono text-xs text-dim">
          <span>{profile.name}</span>
          <time dateTime={post.publishedDate || undefined}>
            {displayPostDate(post.publishedDate)}
          </time>
          <span>{readingMinutes(post.body)} min read</span>
        </div>
        <ArticleTools title={post.title} />
      </header>
      {post.coverUrl && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line">
          <PostCover
            src={post.coverUrl}
            alt={post.title}
            className="h-auto w-full"
          />
        </div>
      )}
      <div className="mt-10 border-t border-line pt-8">
        <Markdown body={post.body} />
      </div>
      <div className="mt-12 border-t border-line pt-8">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-ion"
        >
          <ArrowLeft className="size-4" />
          More from the journal
        </Link>
      </div>
    </article>
  );
}
export default function PostPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-5 pt-32 text-dim" role="status">
          Receiving this transmission…
        </div>
      }
    >
      <PostContent {...props} />
    </Suspense>
  );
}
