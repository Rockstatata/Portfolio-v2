"use client";

import { useSyncExternalStore } from "react";
const QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribe(update: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}
/** Reserve continuous GPU effects for larger devices with a mouse. */
export function useEnhancedVisuals() {
  return useSyncExternalStore(
    subscribe,
    () => {
      const connection = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection;
      return window.matchMedia(QUERY).matches && !connection?.saveData;
    },
    () => false,
  );
}
