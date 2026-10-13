"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

/** Animates the numeric part of values like "3.78", "40+" or "5". */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);

  useEffect(() => {
    if (!inView || !match || !ref.current) return;
    const [, prefix, num, suffix] = match;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const el = ref.current;
    const controls = animate(0, Number(num), {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref}>{value}</span>;
}
