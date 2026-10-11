"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Skill } from "@/lib/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { useEnhancedVisuals } from "@/lib/use-enhanced-visuals";
import {
  AsteroidBelt,
  Comet,
  ComputeCore,
} from "@/components/space/compute-core";

const PALETTE = [
  "#22d3ee",
  "#c084fc",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#818cf8",
];

export function Skills({
  skills,
  initials,
}: {
  skills: Skill[];
  initials: string;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of skills)
      map.set(s.category, [...(map.get(s.category) ?? []), s.name]);
    return [...map.entries()].map(([category, names], i) => ({
      category,
      names,
      color: PALETTE[i % PALETTE.length],
    }));
  }, [skills]);
  const [active, setActive] = useState(0);
  const enhanced = useEnhancedVisuals();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (groups.length === 0) return null;
  const current = groups[Math.min(active, groups.length - 1)];

  return (
    <section id="skills" className="relative overflow-hidden py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          eyebrow="Orbital systems"
          title={
            <>
              A toolkit in <span className="text-gradient">stable orbit.</span>
            </>
          }
          intro="Choose a discipline to explore the tools I use. On a larger screen, each discipline becomes an orbit around an interactive compute core."
        />

        <div
          className={cn(
            "grid items-center gap-12 lg:gap-20",
            enhanced && "lg:grid-cols-2",
          )}
        >
          {enhanced && (
            <Reveal
              className="relative mx-auto aspect-square w-full max-w-[560px] [perspective:1000px]"
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setTilt({ x: -y * 18, y: x * 18 });
              }}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div
                className="relative size-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
                style={{
                  transform: `rotateX(${tilt.x + 14}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                <div className="grid-fade absolute inset-[-10%]" />
                <AsteroidBelt inner={29.5} outer={33.5} />
                <Comet />
                {groups.map((group, i) => {
                  const size =
                    34 + (66 / Math.max(groups.length, 1)) * (i + 1) - 4;
                  const duration = 50 + i * 22;
                  const isActive = i === active;
                  return (
                    <div
                      key={group.category}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: `${size}%`,
                        height: `${size}%`,
                        containerType: "size",
                      }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full border transition-all duration-700",
                          isActive ? "border-solid" : "border-dashed",
                        )}
                        style={{
                          borderColor: isActive
                            ? `${group.color}66`
                            : "rgb(148 163 255 / 0.2)",
                          boxShadow: isActive
                            ? `0 0 40px -8px ${group.color}55, inset 0 0 40px -12px ${group.color}33`
                            : undefined,
                        }}
                      />
                      <div
                        className={cn(
                          "absolute inset-0",
                          i % 2 ? "animate-orbit-reverse" : "animate-orbit",
                        )}
                        style={{
                          ["--orbit-duration" as string]: `${duration}s`,
                        }}
                      >
                        {group.names.map((name, j) => {
                          const angle = (j / group.names.length) * 360 + i * 23;
                          const lit = hovered === name || isActive;
                          return (
                            <div
                              key={name}
                              className="absolute top-1/2 left-1/2 size-0"
                              style={{
                                transform: `rotate(${angle}deg) translateX(50cqw)`,
                              }}
                            >
                              <button
                                type="button"
                                onMouseEnter={() => setHovered(name)}
                                onMouseLeave={() => setHovered(null)}
                                onFocus={() => setHovered(name)}
                                onBlur={() => setHovered(null)}
                                onClick={() => setActive(i)}
                                className="group absolute -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                                }}
                                aria-label={`${name} (${group.category})`}
                              >
                                <span
                                  className={cn(
                                    "relative block",
                                    i % 2
                                      ? "animate-orbit"
                                      : "animate-orbit-reverse",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "block rounded-full transition-all duration-500",
                                      lit ? "size-3" : "size-2",
                                    )}
                                    style={{
                                      background: group.color,
                                      boxShadow: lit
                                        ? `0 0 16px 4px ${group.color}99`
                                        : `0 0 8px 1px ${group.color}55`,
                                    }}
                                  />
                                  <span
                                    className={cn(
                                      "pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md bg-void/90 px-2 py-1 font-mono text-[0.65rem] whitespace-nowrap text-ink ring-1 ring-line transition-opacity",
                                      hovered === name
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  >
                                    {name}
                                  </span>
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <ComputeCore initials={initials} />
              </div>
            </Reveal>
          )}

          <div>
            <div className="flex flex-wrap gap-2" aria-label="Skill categories">
              {groups.map((group, i) => (
                <button
                  key={group.category}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    i === active ? "text-white" : "text-dim hover:text-ink",
                  )}
                >
                  {i === active && (
                    <motion.span
                      layoutId="skill-tab"
                      className="absolute inset-0 rounded-full border bg-white/5"
                      style={{ borderColor: `${group.color}66` }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: group.color }}
                    />
                    {group.category}
                  </span>
                </button>
              ))}
            </div>

            <motion.ul
              key={current.category}
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04 } } }}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {current.names.map((name) => (
                <motion.li
                  key={name}
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "glass rounded-xl px-4 py-2.5 text-sm transition-colors",
                    hovered === name ? "text-white" : "text-ink/85",
                  )}
                  style={
                    hovered === name
                      ? { borderColor: `${current.color}88` }
                      : undefined
                  }
                >
                  {name}
                </motion.li>
              ))}
            </motion.ul>
            <p className="mt-8 font-mono text-xs text-faint">
              {String(current.names.length).padStart(2, "0")} bodies on this
              orbit · {skills.length} total
            </p>
          </div>
        </div>
      </div>

      {/* Drifting marquee of everything */}
      <div className="relative mt-24 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...skills, ...skills].map((s, i) => (
            <span
              key={i}
              className="font-display text-2xl font-light text-white/[0.12] md:text-4xl"
            >
              {s.name} <span className="text-nebula/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
