"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { OrbitalLoader } from "@/components/ui/orbital-loader";
import type { CorePose } from "@/components/space/orbital-core-scene";
import { RESEARCH_LAYERS, type ResearchLayer } from "@/components/space/research-map";
import { SceneBoundary } from "@/components/ui/scene-boundary";

const Scene = dynamic(() => import("@/components/space/orbital-core-scene"), {
  ssr: false,
  loading: () => <OrbitalLoader compact />,
});

export function OrbitalCore() {
  const [layer, setLayer] = useState<ResearchLayer>(1);
  const pose = useRef<CorePose>({ yaw: 0, pitch: 0.15 });
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const current = RESEARCH_LAYERS[layer];
  const select = (next: ResearchLayer) => {
    setLayer(next);
    window.dispatchEvent(new Event("scene-interaction"));
  };
  return (
    <figure className="orbital-core relative min-w-0" aria-labelledby="research-map-title">
      <div className="relative flex items-center justify-between gap-3">
        <h2 id="research-map-title" className="text-xs font-medium text-dim">How my work connects</h2>
      </div>
      <div
        className="core-viewport relative mx-auto h-[260px] w-full touch-pan-y cursor-grab outline-none active:cursor-grabbing sm:h-[330px]"
        role="group"
        aria-label="3D research map. Drag sideways or use left and right arrow keys to rotate. Choose a layer below to explore the story."
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (event.pointerType === "mouse" || event.isPrimary) {
            drag.current = { x: event.clientX, yaw: pose.current.yaw };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={(event) => {
          if (drag.current) {
            pose.current.yaw = drag.current.yaw + (event.clientX - drag.current.x) * 0.012;
            window.dispatchEvent(new Event("scene-interaction"));
          }
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            pose.current.yaw += event.key === "ArrowLeft" ? -0.3 : 0.3;
            window.dispatchEvent(new Event("scene-interaction"));
          }
        }}
      >
        <SceneBoundary fallback={<div className="core-fallback" aria-hidden="true" />}>
          <Scene layer={layer} pose={pose} />
        </SceneBoundary>
        <span className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] text-dim">{current.caption}</span>
      </div>
      <div className="relative grid grid-cols-4 gap-1 pb-3" role="group" aria-label="Research map layers">
        {RESEARCH_LAYERS.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={layer === index} aria-controls="research-map-story"
            onClick={() => select(index as ResearchLayer)}
            className="research-layer relative min-h-11 px-1 text-[11px] transition-colors sm:text-xs">
            {item.label}
          </button>
        ))}
      </div>
      <figcaption id="research-map-story" className="relative pt-4" aria-live="polite" aria-atomic="true">
        <h3 className="font-display text-lg font-medium text-ink">{current.title}</h3>
        <p className="mt-2 min-h-[7.5rem] text-sm leading-6 text-dim sm:min-h-[6rem]">{current.description}</p>
        <a href={current.href} className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs text-ink underline decoration-line underline-offset-4 hover:decoration-current">
          {current.evidence}<ArrowUpRight className="size-3.5" />
        </a>
      </figcaption>
      <div className="relative mt-3 flex items-center justify-between gap-2 pt-2 text-[10px] text-dim">
        <span>Drag to rotate · choose a layer</span>
        <button type="button" className="inline-flex min-h-11 items-center gap-1.5 px-2 hover:text-ink" onClick={() => {
          pose.current = { yaw: 0, pitch: 0.15 };
          select(1);
        }}><RotateCcw className="size-3" />Reset view</button>
      </div>
    </figure>
  );
}
