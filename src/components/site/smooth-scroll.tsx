"use client";

import { ReactLenis } from "lenis/react";

/** One continuous scroll clock for wheel, touch inertia and anchor navigation. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{
      lerp: 0.085,
      anchors: true,
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.6,
      respectReducedMotion: false,
    }}>
      {children}
    </ReactLenis>
  );
}
