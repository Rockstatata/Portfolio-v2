"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useMotionPreference } from "@/lib/use-motion-preference";

export function useSceneState() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const reduced = useMotionPreference();
  useEffect(() => {
    let intersecting = true;
    const update = () => {
      setActive(intersecting && document.visibilityState === "visible");
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return { host, active, reduced };
}

/** Schedule phone scenes on the browser's next frame; pause hidden or still scenes. */
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
  useFrame(() => {
    if (active && mobile && !reduced) invalidate();
  });
  useEffect(() => {
    const draw = () => invalidate();
    window.addEventListener("scene-interaction", draw);
    return () => window.removeEventListener("scene-interaction", draw);
  }, [invalidate]);
  useEffect(() => {
    invalidate();
  }, [active, reduced, mobile, invalidate]);
  return null;
}
