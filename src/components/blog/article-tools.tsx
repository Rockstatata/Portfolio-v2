"use client";
import { useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Share2 } from "lucide-react";

export function ArticleTools({ title }: { title: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setMessage("Link copied");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setMessage("Copy the address from your browser to share this post.");
    }
  }
  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-nebula to-ion"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={share}
          className="glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs text-ion"
        >
          <Share2 className="size-3.5" />
          Share this note
        </button>
        <span role="status" className="text-xs text-dim">
          {message}
        </span>
      </div>
    </>
  );
}
