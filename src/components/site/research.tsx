import { ArrowUpRight, FileText } from "lucide-react";
import type { Publication } from "@/lib/db/schema";
import { PUBLICATION_STATUSES } from "@/lib/admin/collections";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  published: "text-aurora border-aurora/30 bg-aurora/10",
  accepted: "text-ion border-ion/30 bg-ion/10",
  under_review: "text-flare border-flare/30 bg-flare/10",
  poster: "text-plasma border-plasma/30 bg-plasma/10",
  preprint: "text-dim border-line bg-white/5",
  in_preparation: "text-dim border-line bg-white/5",
};

const statusLabel = (s: string) =>
  PUBLICATION_STATUSES.find((x) => x.value === s)?.label ?? s;

function Authors({ authors }: { authors: string }) {
  // Emphasise my own name wherever it appears in the author list.
  const parts = authors.split(
    /(S\.\s?H\.\s?Siddiqui|SH Siddiqui|Sarwad Hasan Siddiqui)/,
  );
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-ink">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Research({ publications }: { publications: Publication[] }) {
  if (publications.length === 0) return null;
  const counts = PUBLICATION_STATUSES.map((s) => ({
    ...s,
    n: publications.filter((p) => p.status === s.value).length,
  })).filter((s) => s.n > 0);

  return (
    <section
      id="research"
      className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-40"
    >
      <SectionHeading
        index="03"
        eyebrow="Transmissions"
        title={
          <>
            Research signals,{" "}
            <span className="text-gradient">sent and received.</span>
          </>
        }
        intro="Human–robot interaction, healthcare AI, computer vision and language technology for Bangla: in print, on posters and in review."
      />

      <Reveal className="mb-10 flex flex-wrap gap-3">
        {counts.map((c) => (
          <div
            key={c.value}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              STATUS_STYLE[c.value],
            )}
          >
            <span className="font-display font-medium">{c.n}</span> {c.label}
          </div>
        ))}
      </Reveal>

      <ol className="grid gap-4">
        {publications.map((pub, i) => (
          <Reveal key={pub.id} delay={Math.min(i, 4) * 0.05}>
            <SpotlightCard className="group grid gap-5 p-6 sm:p-7 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8">
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <span className="font-mono text-xs text-faint">
                  TX-{String(i + 1).padStart(3, "0")}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[0.65rem] tracking-wider whitespace-nowrap uppercase",
                    STATUS_STYLE[pub.status] ?? STATUS_STYLE.preprint,
                  )}
                >
                  {statusLabel(pub.status)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg leading-snug font-medium text-pretty text-white md:text-xl">
                  {pub.title}
                </h3>
                {pub.authors && (
                  <p className="mt-2 text-sm text-dim">
                    <Authors authors={pub.authors} />
                  </p>
                )}
                <p className="mt-2 text-sm text-plasma/90">
                  {[pub.venue, pub.kind, pub.year].filter(Boolean).join(" · ")}
                </p>
                {pub.abstract && (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty text-dim/90">
                    {pub.abstract}
                  </p>
                )}
              </div>
              {(pub.url || pub.pdfUrl) && (
                <div className="flex gap-2 md:flex-col">
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-dim transition hover:border-white/30 hover:text-white"
                    >
                      View <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                  {pub.pdfUrl && (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-dim transition hover:border-white/30 hover:text-white"
                    >
                      <FileText className="size-3.5" /> PDF
                    </a>
                  )}
                </div>
              )}
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
