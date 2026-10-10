import { ArrowUpRight, Trophy } from "lucide-react";
import type { Achievement } from "@/lib/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { hashUnit } from "@/lib/utils";

/** A tiny random-but-stable constellation drawn behind each award. */
function Constellation({ seed }: { seed: string }) {
  const pts = Array.from({ length: 6 }, (_, i) => ({
    x: 10 + hashUnit(seed, i * 2) * 80,
    y: 10 + hashUnit(seed, i * 2 + 1) * 80,
  }));
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute -top-4 -right-4 size-40 opacity-40 transition-opacity duration-700 group-hover:opacity-90"
      aria-hidden
    >
      <polyline
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="rgb(196 181 253 / 0.45)"
        strokeWidth="0.4"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 ? 1.6 : 1}
          fill={i === 0 ? "#fbbf24" : "#e0e7ff"}
        />
      ))}
    </svg>
  );
}

export function Honors({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;
  return (
    <section
      id="honors"
      className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-40"
    >
      <SectionHeading
        index="07"
        eyebrow="Honors & medals"
        title={
          <>
            Podiums under <span className="text-gradient">bright skies.</span>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 4) * 0.07} className="h-full">
            <SpotlightCard className="group relative flex h-full flex-col overflow-hidden p-6">
              <Constellation seed={item.event} />
              <div className="relative grid size-11 place-items-center rounded-2xl border border-flare/30 bg-flare/10 text-flare shadow-[0_0_30px_-6px_rgb(251_191_36/0.6)]">
                <Trophy className="size-5" />
              </div>
              <div className="relative mt-6 font-display text-xl font-medium text-white">
                {item.title}
              </div>
              <div className="relative mt-1 text-plasma">{item.event}</div>
              {item.description && (
                <p className="relative mt-4 text-sm leading-relaxed text-dim">
                  {item.description}
                </p>
              )}
              <div className="relative mt-auto flex items-center justify-between pt-6">
                <span className="font-mono text-xs text-faint">
                  {item.date}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-dim hover:text-white"
                    aria-label={`More about ${item.event}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
