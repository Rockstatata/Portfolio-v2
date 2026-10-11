"use client";

import { ReactLenis } from "lenis/react";
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce), (pointer: coarse)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Lenis smooth scrolling for mouse and trackpad users; native scroll on touch or reduced motion. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(QUERY).matches,
    () => false,
  );

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        anchors: enabled ? { offset: -80 } : false,
        autoRaf: enabled,
        smoothWheel: enabled,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
