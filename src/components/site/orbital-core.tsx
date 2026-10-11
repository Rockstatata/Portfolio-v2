"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { OrbitalLoader } from "@/components/ui/orbital-loader";
import type { CorePose } from "@/components/space/orbital-core-scene";
import { SceneBoundary } from "@/components/ui/scene-boundary";

const Scene = dynamic(() => import("@/components/space/orbital-core-scene"), {
  ssr: false,
  loading: () => <OrbitalLoader compact />,
});

export function OrbitalCore() {
  const [warp, setWarp] = useState(false);
  const pose = useRef<CorePose>({ yaw: 0, pitch: 0.15 });
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  return (
    <div className="orbital-core relative min-w-0">
      <div className="core-reticle" aria-hidden="true" />
      <div className="relative flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-dim">
        <span>STELLAR ENGINE / 01</span>
        <span className="text-ion">
          {warp ? "WARP ACTIVE" : "STABLE ORBIT"}
        </span>
      </div>
      <div
        className="core-viewport relative mx-auto h-[280px] w-full touch-pan-y cursor-grab outline-none active:cursor-grabbing sm:h-[360px]"
        role="group"
        aria-label="Interactive 3D orbital core. Drag sideways to rotate, or use the arrow keys."
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" || event.isPrimary) {
            drag.current = { x: event.clientX, yaw: pose.current.yaw };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={(event) => {
          if (drag.current) {
            pose.current.yaw =
              drag.current.yaw + (event.clientX - drag.current.x) * 0.012;
            window.dispatchEvent(new Event("scene-interaction"));
          }
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            pose.current.yaw += event.key === "ArrowLeft" ? -0.3 : 0.3;
            window.dispatchEvent(new Event("scene-interaction"));
          }
        }}
      >
        <div
          className="core-aura absolute inset-4 rounded-full"
          aria-hidden="true"
        />
        <SceneBoundary fallback={<div className="core-fallback" />}>
          <Scene warp={warp} pose={pose} />
        </SceneBoundary>
      </div>
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          aria-pressed={warp}
          onClick={() => setWarp((value) => !value)}
          className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs text-ion"
        >
          <Sparkles className="size-3.5" />
          {warp ? "Exit warp" : "Engage warp"}
        </button>
        <button
          type="button"
          onClick={() => {
            pose.current = { yaw: 0, pitch: 0.15 };
            setWarp(false);
            window.dispatchEvent(new Event("scene-interaction"));
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-xs text-dim"
        >
          <RotateCcw className="size-3.5" />
          Reset orbit
        </button>
      </div>
      <p className="relative mt-4 text-center font-mono text-[10px] tracking-wider text-dim">
        DRAG TO ROTATE · SCROLL TO EXPLORE
      </p>
    </div>
  );
}
