"use client";

import { ArrowUpRight, Download, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/db/schema";
import { SocialIcon } from "@/components/ui/brand-icons";
import { OrbitalCore } from "./orbital-core";
import { SceneBoundary } from "@/components/ui/scene-boundary";
import { useMotionPreference } from "@/lib/use-motion-preference";

const GalaxyScene = dynamic(() => import("@/components/space/galaxy-scene"), {
  ssr: false,
});
function RoleTicker({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduced = useMotionPreference();
  useEffect(() => {
    if (
      roles.length < 2 ||
      reduced
    )
      return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % roles.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [roles.length, reduced]);
  return (
    <div className="min-h-12 font-mono text-sm leading-6 text-ion sm:min-h-6">
      <span className="text-faint">&gt; </span>
      {roles[index % Math.max(roles.length, 1)] ?? "AI Systems Researcher"}
      <span aria-hidden className="ml-1 animate-pulse">
        ▍
      </span>
    </div>
  );
}

export function Hero({
  profile,
  currentRole,
}: {
  profile: Profile;
  currentRole?: string;
}) {
  const progress = useRef(0);
  const [first, ...rest] = profile.name.split(" ");
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      progress.current = Math.min(
        1,
        Math.max(
          0,
          window.scrollY /
            Math.max(1, hero?.offsetHeight ?? window.innerHeight),
        ),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <section id="top" className="hero-section relative isolate overflow-hidden">
      <div
        className="orbital-sky pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="hero-halo" />
        <div className="hero-grid" />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
      </div>
      <div
        id="galaxy-host"
        className="hero-galaxy pointer-events-none absolute inset-0 -z-10 opacity-80"
        aria-hidden
      >
        <SceneBoundary
          fallback={<div className="galaxy-fallback" />}
          onFailure={() => window.dispatchEvent(new Event("galaxy-ready"))}
        >
          <GalaxyScene progress={progress} />
        </SceneBoundary>
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-24 pb-12 sm:px-8 sm:pt-32 lg:min-h-svh lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-center lg:gap-16 lg:pt-36 lg:pb-24">
        <div className="min-w-0">
          <div className="hud-label mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 !tracking-[0.14em]">
            <span className="flex items-center gap-2 text-aurora">
              <span className="size-2 rounded-full bg-aurora shadow-[0_0_12px_#34d399]" />
              Systems online
            </span>
            <span>{profile.location}</span>
          </div>
          <h1 className="hero-name font-display font-semibold tracking-[-0.045em]">
            <span className="block">{first}</span>
            <span className="text-gradient block">{rest.join(" ")}</span>
          </h1>
          <div className="mt-5 max-w-xl space-y-2 sm:mt-7">
            <RoleTicker roles={profile.roles} />
            <p className="text-sm leading-7 text-pretty text-dim sm:text-lg">
              {profile.headline}
            </p>
          </div>
          {currentRole && (
            <div className="mission-card mt-6 max-w-xl rounded-2xl border border-ion/20 bg-space/80 p-4 sm:p-5">
              <div className="hud-label mb-2 flex items-center gap-2 !text-[0.6rem] text-ion">
                <Sparkles className="size-3.5" />
                Current mission
              </div>
              <p className="text-sm leading-6 text-ink">{currentRole}</p>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <a
              href="#projects"
              className="launch-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-void"
            >
              Explore my worlds
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm text-ink transition hover:border-ion/50"
              >
                <Download className="size-4" />
                Download CV
              </a>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-1">
            {profile.socials
              .filter((s) => !s.url.startsWith("mailto:"))
              .map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full text-dim transition hover:bg-ion/10 hover:text-ion"
                >
                  <SocialIcon label={s.label} className="size-[1.1rem]" />
                </a>
              ))}
            <Link
              href="/blog"
              className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-xs text-plasma transition hover:border-plasma/50"
            >
              Read my journal
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
        <OrbitalCore />
      </div>
      <a
        href="#about"
        className="mx-auto mb-8 flex w-fit items-center gap-2 font-mono text-xs text-dim transition hover:text-ion"
      >
        Continue the journey
        <span className="scroll-wheel" aria-hidden="true">
          <span />
        </span>
      </a>
    </section>
  );
}
