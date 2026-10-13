"use client";

import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Keep HTML readable, then choreograph real entrances and repeat them on return. */
export function Reveal({ delay = 0, y = 42, children, style, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const inView = useInView(ref, { margin: "0px 0px -8% 0px", amount: 0.12 });
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={!hydrated || inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: inView ? 0.8 : 0.45, delay: inView ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
