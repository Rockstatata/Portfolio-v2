"use client";

import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export function useSceneState() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let intersecting = true;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setActive(intersecting && document.visibilityState === "visible");
      setReduced(media.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      media.removeEventListener("change", update);
    };
  }, []);
  return { host, active, reduced };
}

/** Demand rendering keeps phone scenes at 30fps and reduced-motion scenes still. */
export function SceneFrames({
  active,
  reduced,
  mobile,
}: {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const draw = () => invalidate();
    window.addEventListener("scene-interaction", draw);
    return () => window.removeEventListener("scene-interaction", draw);
  }, [invalidate]);
  useEffect(() => {
    invalidate();
    if (!active || reduced || !mobile) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [active, reduced, mobile, invalidate]);
  return null;
}
