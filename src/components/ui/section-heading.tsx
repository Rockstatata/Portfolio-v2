import { Reveal } from "./reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
};

export function SectionHeading({ index, eyebrow, title, intro }: Props) {
  return (
    <Reveal className="mb-8 max-w-3xl md:mb-14">
      <div className="hud-label mb-4 flex items-center gap-3">
        <span className="text-ion">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-ion/70 to-transparent" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-[clamp(1.5rem,6.3vw,1.875rem)] leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-dim md:text-lg">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
