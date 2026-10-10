"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/db/schema";
import { SocialIcon } from "@/components/ui/brand-icons";

const GalaxyScene = dynamic(() => import("@/components/space/galaxy-scene"), {
  ssr: false,
});

const ease = [0.16, 1, 0.3, 1] as const;

function SplitWord({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1, delay: delay + i * 0.035, ease }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

function RoleTicker({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;
    const full = roles[index % roles.length];
    const done = !deleting && text === full;
    const cleared = deleting && text === "";
    const timeout = setTimeout(
      () => {
        if (done) setDeleting(true);
        else if (cleared) {
          setDeleting(false);
          setIndex((i) => i + 1);
        } else {
          setText(
            deleting
              ? full.slice(0, text.length - 1)
              : full.slice(0, text.length + 1),
          );
        }
      },
      done ? 2200 : deleting ? 28 : 55,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index, roles]);

  return (
    <span
      className="font-mono text-sm text-ion sm:text-base"
      aria-live="polite"
    >
      <span className="text-faint">&gt; </span>
      {text}
      <span className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.2em] animate-pulse bg-ion" />
    </span>
  );
}

export function Hero({
  profile,
  currentRole,
}: {
  profile: Profile;
  currentRole?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0]);

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[680px] overflow-hidden"
    >
      <motion.div
        style={{ opacity: sceneOpacity }}
        className="absolute inset-0"
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 size-[60vmax] -translate-x-1/4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.22),transparent_60%)] blur-2xl" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease }}
        >
          <GalaxyScene progress={progress} />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,var(--color-void))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgb(3_4_11/0.75),transparent_60%)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 sm:px-8 md:justify-center md:pb-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hud-label mb-6 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span className="flex items-center gap-2 text-aurora">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-aurora" />
              <span className="relative inline-flex size-2 rounded-full bg-aurora" />
            </span>
            Systems online
          </span>
          <span className="hidden sm:inline">22.90° N · 89.50° E</span>
          <span>{profile.location}</span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.4rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.03em]">
          <SplitWord text={first} delay={0.3} />
          <br />
          <span className="text-gradient">
            {last.split(" ").map((word, i) => (
              <span key={word + i}>
                {i > 0 && " "}
                <SplitWord text={word} delay={0.55 + i * 0.2} />
              </span>
            ))}
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease }}
          className="mt-7 max-w-xl space-y-4"
        >
          <RoleTicker roles={profile.roles} />
          <p className="text-base leading-relaxed text-pretty text-dim sm:text-lg">
            {profile.headline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.35, ease }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-void transition"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-plasma via-ion to-plasma transition-transform duration-700 ease-[var(--ease-warp)] group-hover:translate-x-0" />
            <span className="relative">Explore my worlds</span>
            <ArrowUpRight className="relative size-4 transition-transform group-hover:rotate-45" />
          </a>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-ink transition hover:border-nebula/50"
            >
              <Download className="size-4" /> Download CV
            </a>
          )}
          <div className="ml-1 flex items-center gap-1">
            {profile.socials
              .filter((s) => !s.url.startsWith("mailto:"))
              .map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full text-dim transition hover:bg-white/5 hover:text-white"
                >
                  <SocialIcon label={s.label} className="size-[1.1rem]" />
                </a>
              ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: contentOpacity }}>
        {currentRole && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.6, ease }}
            className="glass absolute right-8 bottom-10 hidden max-w-xs rounded-2xl p-4 lg:block"
          >
            <div className="hud-label mb-2">Current mission</div>
            <div className="text-sm text-ink">{currentRole}</div>
            {profile.availability && (
              <div className="mt-3 border-t border-line pt-3 text-xs text-dim">
                {profile.availability}
              </div>
            )}
          </motion.div>
        )}

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="hud-label absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        >
          Scroll to launch
          <ArrowDown className="size-4 animate-float text-ion" />
        </motion.a>
      </motion.div>
    </section>
  );
}
