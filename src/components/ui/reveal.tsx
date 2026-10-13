"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useRef } from "react";
import { useMotionPreference } from "@/lib/use-motion-preference";

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
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 32, mass: 0.4 });
  const travel = useTransform(
    progress,
    [0, 0.18, 0.82, 1],
    [Math.min(y, 32), 0, 0, -Math.min(y, 32)],
  );
  const opacity = useTransform(
    progress,
    [0, 0.15, 0.85, 1],
    [0.6, 1, 1, 0.6],
  );
  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        y: reduced ? 0 : travel,
        opacity: reduced ? 1 : opacity,
      }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
