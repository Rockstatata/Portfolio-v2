"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export function useSceneState() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
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
  return { host, active };
}

/** Schedule phone scenes on the browser's next frame; pause only hidden scenes. */
export function SceneFrames({
  active,
  mobile,
}: {
  active: boolean;
  mobile: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useFrame(() => {
    if (active && mobile) invalidate();
  });
  useEffect(() => {
    const draw = () => invalidate();
    window.addEventListener("scene-interaction", draw);
    return () => window.removeEventListener("scene-interaction", draw);
  }, [invalidate]);
  useEffect(() => {
    invalidate();
  }, [active, mobile, invalidate]);
  return null;
}
