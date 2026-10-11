"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef } from "react";
import { useLenis } from "lenis/react";

export function ScrollConsole() {
  const { scrollYProgress } = useScroll();
  const lenis = useLenis();
  const slider = useRef<HTMLInputElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (slider.current) slider.current.value = String(Math.round(value * 100));
    if (label.current)
      label.current.textContent = `${Math.round(value * 100)}%`;
  });
  return (
    <div className="scroll-console fixed top-1/2 right-2 z-40 hidden -translate-y-1/2 items-center gap-4 rounded-full border border-ion/15 bg-void/80 px-2 py-5 backdrop-blur-sm lg:flex lg:flex-col">
      <span className="scroll-wheel" aria-hidden="true">
        <span />
      </span>
      <input
        ref={slider}
        type="range"
        min="0"
        max="100"
        defaultValue="0"
        aria-label="Scroll position"
        className="scroll-range"
        onChange={(event) => {
          const top =
            ((document.documentElement.scrollHeight - window.innerHeight) *
              Number(event.target.value)) /
            100;
          if (lenis) lenis.scrollTo(top, { immediate: true });
          else window.scrollTo({ top, behavior: "instant" });
        }}
      />
      <span
        ref={label}
        className="w-7 text-center font-mono text-[9px] text-ion"
      >
        0%
      </span>
    </div>
  );
}
