"use client";

import { useEffect, useState } from "react";
import { cn, hashUnit } from "@/lib/utils";

const GRID = 8;

/** Each mode is a different firing schedule over the same 8×8 tile of cores. */
const MODES = [
  {
    key: "tensor",
    label: "Systolic matmul",
    detail: "8×8 tensor tile · diagonal wavefront",
    delay: (r: number, c: number) => (r + c) * 70,
  },
  {
    key: "simt",
    label: "SIMT warps",
    detail: "32 lanes in lockstep · row by row",
    delay: (r: number) => r * 140,
  },
  {
    key: "stream",
    label: "Big-data shuffle",
    detail: "map → shuffle → reduce · scattered",
    delay: (r: number, c: number) => Math.round(hashUnit(`${r}-${c}`) * 1100),
  },
] as const;

/**
 * The centre of the skill system: a GPU die whose cores fire in parallel
 * waves, with data packets streaming out to the orbits. Click to switch the
 * execution model; hovering overclocks it.
 */
export function ComputeCore({ initials }: { initials: string }) {
  const [mode, setMode] = useState(0);
  const [boost, setBoost] = useState(false);
  const [tflops, setTflops] = useState(61.4);
  const current = MODES[mode];

  useEffect(() => {
    const id = setInterval(() => {
      setTflops((v) => {
        const target = boost ? 98 : 64;
        return (
          Math.round(
            (v + (target - v) * 0.25 + (Math.random() - 0.5) * 3) * 10,
          ) / 10
        );
      });
    }, 220);
    return () => clearInterval(id);
  }, [boost]);

  return (
    <>
      {/* Data packets streaming from the die to the orbits */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 h-px w-[46%] origin-left"
            style={{ transform: `rotate(${i * 30 + 15}deg)` }}
          >
            <span
              className="packet absolute top-1/2 h-[2px] w-6 -translate-y-1/2 rounded-full"
              style={{
                animationDelay: `${(i * 377) % 2400}ms`,
                animationDuration: boost ? "1.1s" : "2.4s",
                background: ["#22d3ee", "#c084fc", "#34d399"][i % 3],
                color: ["#22d3ee", "#c084fc", "#34d399"][i % 3],
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2">
        {/* Stellar corona behind the die */}
        <div className="absolute -inset-[30%] animate-orbit rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(251_191_36/0.35),transparent_30%,rgb(192_132_252/0.35),transparent_60%,rgb(34_211_238/0.35),transparent)] blur-xl [--orbit-duration:14s]" />
        <div className="absolute -inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(251_191_36/0.28),transparent_65%)]" />
        <span className="absolute inset-[8%] animate-pulse-ring rounded-2xl border border-ion/40" />

        {/* A moon in a tight orbit around the die */}
        <div className="absolute -inset-[22%] animate-orbit [--orbit-duration:7s]">
          <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-slate-200 shadow-[0_0_10px_2px_rgb(226_232_240/0.5)]" />
        </div>

        <button
          type="button"
          onClick={() => setMode((m) => (m + 1) % MODES.length)}
          onPointerEnter={() => setBoost(true)}
          onPointerLeave={() => setBoost(false)}
          className="group/die absolute inset-0 rounded-2xl border border-white/15 bg-[linear-gradient(145deg,#1b2140,#0a0d1d)] p-[9%] shadow-[0_0_60px_-6px_rgb(139_92_246/0.7),inset_0_1px_0_rgb(255_255_255/0.08)] transition-transform duration-500 hover:scale-105"
          aria-label={`Compute core: ${current.label}. Click to switch execution model.`}
          style={{ ["--fire-speed" as string]: boost ? "0.55s" : "1.1s" }}
        >
          {/* Package pins */}
          {(["top", "bottom", "left", "right"] as const).map((side) => (
            <span
              key={side}
              className={cn(
                "absolute flex justify-around",
                side === "top" && "inset-x-[14%] -top-[7%] h-[7%]",
                side === "bottom" && "inset-x-[14%] -bottom-[7%] h-[7%]",
                side === "left" && "inset-y-[14%] -left-[7%] w-[7%] flex-col",
                side === "right" && "inset-y-[14%] -right-[7%] w-[7%] flex-col",
              )}
            >
              {Array.from({ length: 6 }, (_, k) => (
                <span
                  key={k}
                  className={cn(
                    "bg-amber-300/60",
                    side === "top" || side === "bottom"
                      ? "h-full w-[2px]"
                      : "h-[2px] w-full",
                  )}
                />
              ))}
            </span>
          ))}

          <span className="grid size-full grid-cols-8 gap-[6%]">
            {Array.from({ length: GRID * GRID }, (_, idx) => {
              const r = Math.floor(idx / GRID);
              const c = idx % GRID;
              return (
                <span
                  key={`${current.key}-${idx}`}
                  className="core-cell rounded-[2px]"
                  style={{ animationDelay: `${current.delay(r, c)}ms` }}
                />
              );
            })}
          </span>
          <span className="absolute inset-x-0 bottom-[2%] text-center font-mono text-[clamp(5px,1.1vw,8px)] tracking-[0.3em] text-white/45">
            {initials}-H100
          </span>
        </button>
      </div>

      {/* Telemetry */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 flex justify-center">
        <div className="glass flex items-center gap-3 rounded-full px-4 py-1.5 font-mono text-[0.62rem] text-dim">
          <span className="text-ion">{current.label}</span>
          <span className="hidden sm:inline">{current.detail}</span>
          <span className="text-flare tabular-nums">
            {tflops.toFixed(1)} TFLOP/s
          </span>
        </div>
      </div>
    </>
  );
}

/** A slowly turning band of asteroids between two orbits. */
export function AsteroidBelt({
  inner,
  outer,
}: {
  inner: number;
  outer: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 animate-orbit [--orbit-duration:240s]"
      aria-hidden
    >
      {Array.from({ length: 90 }, (_, i) => {
        const angle = hashUnit(`belt-a-${i}`) * Math.PI * 2;
        const radius = inner + hashUnit(`belt-r-${i}`) * (outer - inner);
        const size = 1 + hashUnit(`belt-s-${i}`) * 2.2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-slate-400/50"
            style={{
              left: `${50 + Math.cos(angle) * radius}%`,
              top: `${50 + Math.sin(angle) * radius}%`,
              width: size,
              height: size,
            }}
          />
        );
      })}
    </div>
  );
}

/** A comet that streaks across the system every so often. */
export function Comet() {
  return (
    <div
      className="comet pointer-events-none absolute h-[2px] w-24 rotate-[28deg]"
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-sky-200/40 to-white" />
      <span className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgb(186_230_253/0.8)]" />
    </div>
  );
}
