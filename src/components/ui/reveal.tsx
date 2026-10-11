"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useRef } from "react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Scroll-linked entrance and exit, without hiding server-rendered content. */
export function Reveal({
  delay = 0,
  y = 28,
  children,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const travel = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [Math.min(y, 32), 0, 0, -Math.min(y, 32)],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.6, 1, 1, 0.6],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0.98, 1, 1, 0.98],
  );
  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        y: reduced ? 0 : travel,
        opacity: reduced ? 1 : opacity,
        scale: reduced ? 1 : scale,
      }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
