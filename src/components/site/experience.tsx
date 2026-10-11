"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Experience as ExperienceRow } from "@/lib/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { sortTimeline } from "@/lib/timeline";
import { Reveal } from "@/components/ui/reveal";

const KIND_COLOR: Record<string, string> = {
  Work: "text-ion border-ion/30 bg-ion/10",
  Research: "text-plasma border-plasma/30 bg-plasma/10",
  Leadership: "text-flare border-flare/30 bg-flare/10",
  Volunteer: "text-aurora border-aurora/30 bg-aurora/10",
  Education: "text-nova border-nova/30 bg-nova/10",
};

export function Experience({ items }: { items: ExperienceRow[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  if (items.length === 0) return null;

  return (
    <section
      id="experience"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-32"
    >
      <SectionHeading
        index="05"
        eyebrow="Flight log"
        title={
          <>
            Missions flown,{" "}
            <span className="text-gradient">lessons logged.</span>
          </>
        }
      />

      <ol ref={ref} className="relative">
        <div
          className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:left-1/2"
          aria-hidden
        />
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-gradient-to-b from-ion via-nebula to-plasma shadow-[0_0_12px_rgb(139_92_246/0.8)] md:left-1/2"
          aria-hidden
        />

        {sortTimeline(items).map((item, i) => {
          const right = i % 2 === 1;
          return (
            <li
              key={item.id}
              className="relative pb-14 pl-12 last:pb-0 md:grid md:grid-cols-2 md:pl-0"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-30% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute top-1.5 left-[5px] grid size-[13px] place-items-center rounded-full border border-nebula bg-void md:left-1/2 md:-translate-x-1/2"
              >
                <span className="size-[5px] rounded-full bg-ion shadow-[0_0_10px_2px_rgb(34_211_238/0.8)]" />
              </motion.span>

              <Reveal
                className={cn(
                  right ? "md:col-start-2 md:pl-14" : "md:pr-14 md:text-right",
                )}
              >
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-3",
                    !right && "md:justify-end",
                  )}
                >
                  <span className="font-mono text-xs tracking-wider text-faint">
                    {item.period}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[0.65rem] tracking-wider uppercase",
                      KIND_COLOR[item.kind] ?? KIND_COLOR.Work,
                    )}
                  >
                    {item.kind}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-medium text-white md:text-2xl">
                  {item.role}
                </h3>
                <div
                  className={cn(
                    "mt-1 flex items-center gap-1 text-plasma",
                    !right && "md:justify-end",
                  )}
                >
                  {item.orgUrl ? (
                    <a
                      href={item.orgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 hover:text-white"
                    >
                      {item.org}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    item.org
                  )}
                </div>
                {item.description && (
                  <p className="mt-4 leading-relaxed text-pretty text-dim">
                    {item.description}
                  </p>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
