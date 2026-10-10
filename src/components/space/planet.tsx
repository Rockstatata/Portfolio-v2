import { cn, hashUnit } from "@/lib/utils";

// [highlight, body, shadow] — curated so every world stays on-palette.
const PALETTES = [
  ["#ddd6fe", "#7c3aed", "#1e0b4b"],
  ["#cffafe", "#0891b2", "#082f3d"],
  ["#fef3c7", "#d97706", "#3b1402"],
  ["#ffe4e6", "#e11d48", "#3f0414"],
  ["#d1fae5", "#059669", "#022c22"],
  ["#e0e7ff", "#4f46e5", "#16133f"],
  ["#ffedd5", "#ea580c", "#3a1205"],
  ["#f3e8ff", "#a855f7", "#2e0752"],
  ["#e0f2fe", "#0284c7", "#082f49"],
  ["#fae8ff", "#c026d3", "#3b0640"],
];

/**
 * A procedurally styled CSS planet. The seed (usually a project slug) picks
 * palette, cloud bands, ring and moon, so every project gets its own stable world.
 */
export function Planet({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const [light, body, dark] =
    PALETTES[Math.floor(hashUnit(seed) * PALETTES.length)];
  const [, accent] = PALETTES[Math.floor(hashUnit(seed, 9) * PALETTES.length)];
  const hasRing = hashUnit(seed, 2) > 0.5;
  const hasMoon = hashUnit(seed, 3) > 0.45;
  const tilt = Math.round(hashUnit(seed, 4) * 36 - 18);
  const bandSize = 8 + Math.round(hashUnit(seed, 5) * 10);

  const ring = (half: "front" | "back") => (
    <div
      className="absolute top-1/2 left-1/2 h-[30%] w-[150%] rounded-[50%]"
      style={{
        transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
        border: `2px solid ${accent}`,
        boxShadow: `0 0 0 5px ${accent}22, 0 0 24px ${accent}55`,
        opacity: half === "front" ? 0.85 : 0.45,
        clipPath:
          half === "front"
            ? "polygon(-10% 50%, 110% 50%, 110% 120%, -10% 120%)"
            : "polygon(-10% -20%, 110% -20%, 110% 50%, -10% 50%)",
        zIndex: half === "front" ? 3 : 0,
      }}
    />
  );

  return (
    <div className={cn("relative aspect-square", className)} aria-hidden>
      <div
        className="absolute inset-[15%] rounded-full opacity-60 blur-2xl"
        style={{ background: body }}
      />
      {hasRing && ring("back")}
      <div
        className="absolute inset-[12%] overflow-hidden rounded-full transition-transform duration-[1.2s] ease-[var(--ease-warp)] group-hover:scale-105"
        style={{
          zIndex: 1,
          background: `radial-gradient(circle at 32% 28%, ${light}, ${body} 42%, ${dark} 82%)`,
          boxShadow: `0 0 50px -6px ${body}aa, inset 0 0 10px ${light}55`,
        }}
      >
        {/* Soft cloud bands */}
        <div
          className="absolute inset-[-20%] opacity-40 mix-blend-soft-light blur-[2px]"
          style={{
            transform: `rotate(${tilt}deg)`,
            background: `repeating-linear-gradient(0deg, transparent 0 ${bandSize * 0.45}%, ${light} ${bandSize * 0.6}%, transparent ${bandSize}%)`,
          }}
        />
        {/* Night side */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,transparent_38%,rgb(2_3_10/0.78)_78%)]" />
      </div>
      {hasRing && ring("front")}
      {hasMoon && (
        <div
          className="absolute inset-[-2%] animate-orbit [--orbit-duration:22s]"
          style={{ zIndex: 4 }}
        >
          <span
            className="absolute top-[2%] left-1/2 size-[8%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #f8fafc, #64748b 70%)",
              boxShadow:
                "inset -2px -2px 4px rgb(0 0 0 / 0.6), 0 0 10px rgb(226 232 240 / 0.35)",
            }}
          />
        </div>
      )}
    </div>
  );
}
