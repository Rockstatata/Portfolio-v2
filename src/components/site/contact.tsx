"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { sendMessage, type ContactState } from "@/app/actions";
import type { Profile } from "@/lib/db/schema";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SocialIcon } from "@/components/ui/brand-icons";

export function Contact({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    {},
  );
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgb(139_92_246/0.18),transparent_65%)]" />
      <SectionHeading
        index="08"
        eyebrow="Open a channel"
        title={
          <>
            Have a mission in mind?{" "}
            <span className="text-gradient">Let&apos;s talk.</span>
          </>
        }
        intro={profile.availability}
      />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="space-y-8">
          {profile.email && (
            <div>
              <div className="hud-label mb-3">Direct frequency</div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-display text-xl break-all text-white underline decoration-nebula/40 underline-offset-8 transition hover:decoration-ion sm:text-2xl"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="grid size-10 place-items-center rounded-full border border-line text-dim transition hover:text-white"
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="size-4 text-aurora" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}
          <div>
            <div className="hud-label mb-3">Elsewhere in the galaxy</div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {profile.socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target={s.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-ink transition hover:border-nebula/40"
                  >
                    <SocialIcon label={s.label} className="size-4 text-dim" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            action={action}
            className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {state.ok ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid min-h-[340px] place-items-center text-center"
                >
                  <div>
                    <div className="mx-auto grid size-16 place-items-center rounded-full border border-aurora/40 bg-aurora/10">
                      <Check className="size-7 text-aurora" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-white">
                      Transmission received
                    </h3>
                    <p className="mt-2 text-dim">
                      Thanks for reaching out. I&apos;ll reply soon.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  exit={{ opacity: 0 }}
                  className="grid gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="hud-label">Call sign</span>
                      <input
                        name="name"
                        required
                        minLength={2}
                        maxLength={120}
                        className="field"
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="hud-label">Return frequency</span>
                      <input
                        name="email"
                        type="email"
                        required
                        className="field"
                        placeholder="you@domain.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                  <label className="grid gap-2">
                    <span className="hud-label">Message</span>
                    <textarea
                      name="body"
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={6}
                      className="field resize-none"
                      placeholder="Research collaboration, internship, a project idea…"
                    />
                  </label>
                  <input
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                  />
                  {state.error && (
                    <p className="text-sm text-nova">{state.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-void transition hover:bg-plasma disabled:opacity-60"
                  >
                    {pending ? "Transmitting…" : "Transmit message"}
                    <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
