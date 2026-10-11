"use client";

import { ArrowUp } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

/** Current second on the client; null during server render so the shell stays static. */
function useKhulnaTime() {
  const second = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  return second === null ? null : new Date(second * 1000);
}

export function Footer({ name }: { name: string }) {
  const now = useKhulnaTime();
  const time =
    now?.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour12: false,
    }) ?? "--:--:--";

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-dim sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          © {now?.getFullYear() ?? ""} {name}. Built among the stars in Khulna.
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="hud-label">
            Local time <span className="text-ink tabular-nums">{time}</span> BST
          </span>
          <a
            href="#top"
            className="grid size-10 place-items-center rounded-full border border-line transition hover:border-nebula/50 hover:text-white"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
