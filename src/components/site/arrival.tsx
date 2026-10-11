"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { OrbitalLoader } from "@/components/ui/orbital-loader";

export function Arrival() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    let resolveScene: () => void;
    const scene = new Promise<void>((resolve) => {
      resolveScene = resolve;
    });
    const ready = () => resolveScene();
    window.addEventListener("galaxy-ready", ready);
    const host = document.getElementById("galaxy-host");
    if (!host || host.dataset.ready === "true") ready();
    let loadReady: () => void = () => {};
    const page =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            loadReady = resolve;
            window.addEventListener("load", loadReady, { once: true });
          });
    let timeout: number;
    const maximumWait = new Promise<void>((resolve) => {
      timeout = window.setTimeout(resolve, 2400);
    });
    Promise.race([
      Promise.allSettled([page, document.fonts.ready, scene]),
      maximumWait,
    ]).then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("galaxy-ready", ready);
      window.removeEventListener("load", loadReady);
    };
  }, []);
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="arrival-screen pointer-events-none fixed inset-0 z-[90] bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <OrbitalLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
