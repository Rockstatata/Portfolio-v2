import {
  Atom,
  Bot,
  Cpu,
  Eye,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { FocusArea } from "@/lib/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

// Picks an icon from the title so new vectors added in the dashboard still get one.
const ICONS: [RegExp, typeof Cpu][] = [
  [/gpu|hpc|cuda|compute/i, Cpu],
  [/efficient|transformer|sparse|compression/i, Atom],
  [/vision|multimodal|image/i, Eye],
  [/robot|hri/i, Bot],
  [/trust|health|bangla|safe/i, ShieldCheck],
  [/financ|quant|market/i, LineChart],
];
const iconFor = (title: string) =>
  ICONS.find(([re]) => re.test(title))?.[1] ?? Sparkles;

const ACCENTS = [
  "from-ion/25 text-ion",
  "from-plasma/25 text-plasma",
  "from-aurora/25 text-aurora",
  "from-flare/25 text-flare",
  "from-nova/25 text-nova",
  "from-nebula/30 text-nebula",
];

export function ResearchFocus({
  index,
  items,
}: {
  index: string;
  items: FocusArea[];
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="focus"
      className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36"
    >
      <SectionHeading
        index={index}
        eyebrow="Research vectors"
        title={
          <>
            Where I&apos;m pointing{" "}
            <span className="text-gradient">the telescope.</span>
          </>
        }
        intro="The questions I keep coming back to: how to make intelligent systems faster, smaller and more reliable, and how to deploy them where they matter."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = iconFor(item.title);
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal key={item.id} delay={(i % 3) * 0.07} className="h-full">
              <SpotlightCard className="group relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <div
                  className={cn(
                    "pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-gradient-to-br to-transparent opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-80",
                    accent,
                  )}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div
                    className={cn(
                      "grid size-11 place-items-center rounded-2xl border border-current/30 bg-current/10",
                      accent.split(" ")[1],
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-faint">
                    V-{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="relative mt-6 font-display text-xl font-medium text-white">
                  {item.title}
                </h3>
                {item.status && (
                  <div
                    className={cn(
                      "relative mt-1.5 text-xs tracking-wide",
                      accent.split(" ")[1],
                    )}
                  >
                    {item.status}
                  </div>
                )}
                <p className="relative mt-4 text-sm leading-relaxed text-pretty text-dim">
                  {item.summary}
                </p>
                {item.keywords.length > 0 && (
                  <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
                    {item.keywords.map((k) => (
                      <li
                        key={k}
                        className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[0.66rem] text-ink/70 ring-1 ring-line"
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                )}
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
