import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Lock, Radio } from "lucide-react";
import { getContent, getProject } from "@/lib/content";
import { Planet } from "@/components/space/planet";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline || project.description.slice(0, 160),
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const { projects } = await getContent();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="relative mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 md:pt-40">
      <Link
        href="/#projects"
        className="hud-label inline-flex items-center gap-2 transition hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> Back to all worlds
      </Link>

      <header className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <Reveal>
          <div className="hud-label flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-ion">{project.category}</span>
            {project.year && <span>{project.year}</span>}
            {project.context && (
              <span className="text-plasma/80 normal-case tracking-normal">
                {project.context}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-6xl">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mt-5 max-w-2xl text-lg text-pretty text-dim sm:text-xl">
              {project.tagline}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-void transition hover:bg-plasma"
              >
                <Radio className="size-4" /> Visit live
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:border-nebula/50"
              >
                <GithubIcon className="size-4" /> Source code
              </a>
            )}
            {project.isPrivate && !project.repoUrl && (
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-faint">
                <Lock className="size-4" /> Private repository
              </span>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto w-56 md:w-72">
          <Planet seed={project.slug} className="animate-float" />
        </Reveal>
      </header>

      {project.imageUrl && (
        <Reveal className="relative mt-16 aspect-video overflow-hidden rounded-3xl border border-line">
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
        </Reveal>
      )}

      <div className="mt-20 grid gap-14 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="hud-label mb-4">Mission overview</div>
          <p className="text-lg leading-[1.85] text-pretty whitespace-pre-line text-ink/90">
            {project.description}
          </p>

          {project.highlights.length > 0 && (
            <>
              <div className="hud-label mt-14 mb-5">Key achievements</div>
              <ul className="space-y-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-4 text-dim">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ion shadow-[0_0_10px_2px_rgb(34_211_238/0.6)]" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-6">
            <div className="hud-label mb-4">Instruments</div>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-lg bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-ink/80 ring-1 ring-line"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {next && next.slug !== project.slug && (
        <Link
          href={`/projects/${next.slug}`}
          className="group glass mt-24 flex items-center justify-between gap-6 rounded-3xl p-6 transition hover:border-nebula/40 sm:p-8"
        >
          <div>
            <div className="hud-label">Next world</div>
            <div className="mt-2 font-display text-2xl text-white sm:text-3xl">
              {next.title}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Planet seed={next.slug} className="hidden w-20 sm:block" />
            <ArrowUpRight className="size-6 text-dim transition-transform duration-500 group-hover:rotate-45 group-hover:text-white" />
          </div>
        </Link>
      )}
    </article>
  );
}
