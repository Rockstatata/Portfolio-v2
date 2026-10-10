"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "about", label: "About" },
  { id: "focus", label: "Focus" },
  { id: "research", label: "Papers" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Flight Log" },
  { id: "skills", label: "Skills" },
  { id: "honors", label: "Honors" },
  { id: "contact", label: "Contact" },
];

export function Nav({ initials }: { initials: string }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of LINKS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [onHome]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500",
          scrolled
            ? "glass shadow-[0_8px_40px_-12px_rgb(0_0_0/0.6)]"
            : "border border-transparent",
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1"
          aria-label="Home"
        >
          <span className="relative grid size-9 place-items-center rounded-full border border-line bg-hull font-display text-xs font-semibold tracking-wider">
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(139_92_246/0.6),transparent_40%)] opacity-0 transition-opacity duration-500 group-hover:animate-orbit group-hover:opacity-100 [--orbit-duration:3s]" />
            <span className="relative">{initials}</span>
          </span>
          <span className="hud-label hidden !text-[0.65rem] sm:inline">
            Mission Control
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.id} className="relative">
              <a
                href={href(link.id)}
                className={cn(
                  "relative z-10 block rounded-full px-3.5 py-2 text-sm transition-colors",
                  active === link.id ? "text-white" : "text-dim hover:text-ink",
                )}
              >
                {link.label}
              </a>
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full border border-nebula/30 bg-nebula/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={href("contact")}
            className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition hover:bg-plasma sm:inline-block"
          >
            Open a channel
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute inset-x-4 top-20 rounded-3xl p-3 lg:hidden"
          >
            <ul className="grid gap-1">
              {LINKS.map((link, i) => (
                <li key={link.id}>
                  <a
                    href={href(link.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-ink hover:bg-white/5"
                  >
                    <span>{link.label}</span>
                    <span className="hud-label">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
