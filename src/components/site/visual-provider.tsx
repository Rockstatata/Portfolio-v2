"use client";
import { MotionConfig } from "motion/react";
export function VisualProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
