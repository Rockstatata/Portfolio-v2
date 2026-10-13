"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(update: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

/** Match the server snapshot during hydration, then follow live OS preferences. */
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
