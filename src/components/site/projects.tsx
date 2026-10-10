"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Lock, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/db/schema";
import { Planet } from "@/components/space/planet";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2">
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-dim transition hover:border-white/30 hover:text-white"
        >
          <GithubIcon className="size-3.5" /> Code
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-aurora/30 bg-aurora/10 px-3 py-1.5 text-xs text-aurora transition hover:bg-aurora/20"
        >
          <Radio className="size-3.5" /> Live
        </a>
      )}
      {project.isPrivate && !project.repoUrl && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-faint">
          <Lock className="size-3" /> Private source
        </span>
      )}
    </div>
  );
}

/** A screenshot framed like a mission-control monitor. */
function Screen({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-void shadow-[0_30px_80px_-30px_rgb(139_92_246/0.55)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-hull/80 px-3 py-2">
        <span className="size-2 rounded-full bg-nova/70" />
        <span className="size-2 rounded-full bg-flare/70" />
        <span className="size-2 rounded-full bg-aurora/70" />
        <span className="ml-2 truncate font-mono text-[0.6rem] text-faint">
          {title.toLowerCase().replace(/s+/g, "-")}
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt={`${title} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
          className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-warp)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
      </div>
    </div>
  );
}

function FeaturedCard({ project, big }: { project: Project; big: boolean }) {
  return (
    <SpotlightCard
      className={cn(
        "group relative flex h-full flex-col overflow-hidden p-6 sm:p-8",
        big && "lg:flex-row lg:items-center lg:gap-8",
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title}`}
      />
      {project.imageUrl ? (
        <div
          className={cn(
            "relative mb-7",
            big && "lg:order-2 lg:mb-0 lg:w-[55%] lg:shrink-0",
          )}
        >
          <Screen src={project.imageUrl} title={project.title} />
          <Planet
            seed={project.slug}
            className="absolute -top-5 -right-3 w-16 sm:w-20"
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative mx-auto mb-6 w-40 shrink-0 sm:w-48",
            big && "lg:order-2 lg:mb-0 lg:w-72",
          )}
        >
          <Planet seed={project.slug} className="animate-float" />
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="hud-label flex flex-wrap items-center gap-x-3 gap-y-1 !text-[0.62rem]">
          <span className="text-ion">{project.category}</span>
          {project.year && <span>{project.year}</span>}
          {project.context && (
            <span className="text-plasma/80 normal-case tracking-normal">
              {project.context}
            </span>
          )}
        </div>
        <h3 className="mt-3 flex items-start justify-between gap-3 font-display text-2xl font-medium text-white sm:text-3xl">
          {project.title}
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-faint transition-all duration-500 group-hover:rotate-45 group-hover:text-white" />
        </h3>
        <p className="mt-3 leading-relaxed text-pretty text-dim">
          {project.tagline}
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.slice(0, big ? 7 : 5).map((t) => (
            <li
              key={t}
              className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[0.68rem] text-ink/70 ring-1 ring-line"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </SpotlightCard>
  );
}

function CompactCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="group relative flex h-full flex-col overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Open ${project.title}`}
      />
      {project.imageUrl && (
        <div className="relative aspect-[16/8] overflow-hidden border-b border-line">
          <Image
            src={project.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover object-top opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space to-transparent" />
        </div>
      )}
      <div className="flex flex-1 gap-4 p-5">
        <Planet seed={project.slug} className="w-14 shrink-0 self-start" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-medium text-white">
              {project.title}
            </h3>
            <span className="font-mono text-[0.65rem] text-faint">
              {project.year}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-dim">
            {project.tagline}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] text-faint">
            {project.tech.slice(0, 3).join(" · ")}
          </div>
          <div className="mt-4">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(others.map((p) => p.category)))],
    [others],
  );
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);
  const filtered =
    filter === "All" ? others : others.filter((p) => p.category === filter);
  const shown = expanded ? filtered : filtered.slice(0, 9);

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-40"
    >
      <SectionHeading
        index="04"
        eyebrow="Explored worlds"
        title={
          <>
            Things I&apos;ve{" "}
            <span className="text-gradient">launched into orbit.</span>
          </>
        }
        intro="From NASA fire data to blackout-proof forums, robot arms and money that moves exactly once. Every world below is a real system, public or private."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((project, i) => {
          // The first card is a hero; an unpaired last card also spans the row.
          const wide = i === 0 || (i === featured.length - 1 && i % 2 === 1);
          return (
            <Reveal
              key={project.id}
              delay={(i % 2) * 0.08}
              className={cn(wide && "md:col-span-2")}
            >
              <FeaturedCard project={project} big={wide} />
            </Reveal>
          );
        })}
      </div>

      {others.length > 0 && (
        <div className="mt-24">
          <Reveal className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="hud-label mb-2">Deep-space catalogue</div>
              <h3 className="font-display text-2xl text-white">
                More missions
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setFilter(c);
                    setExpanded(false);
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs transition",
                    filter === c
                      ? "border-nebula/50 bg-nebula/15 text-white"
                      : "border-line text-dim hover:text-ink",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CompactCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length > 9 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="glass rounded-full px-6 py-3 text-sm text-ink transition hover:border-nebula/50"
              >
                {expanded ? "Show fewer" : `Show all ${filtered.length}`}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
