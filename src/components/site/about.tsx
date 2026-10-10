import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Profile } from "@/lib/db/schema";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CountUp } from "@/components/ui/count-up";

export function About({ profile }: { profile: Profile }) {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-40"
    >
      <SectionHeading
        index="01"
        eyebrow="Mission briefing"
        title={
          <>
            Engineering systems that hold up{" "}
            <span className="text-gradient">under pressure.</span>
          </>
        }
      />

      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
          <div className="relative aspect-square">
            {/* Orbits around the portrait */}
            <div className="absolute -inset-6 rounded-full border border-dashed border-nebula/25" />
            <div className="absolute -inset-6 animate-orbit rounded-full [--orbit-duration:28s]">
              <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-ion shadow-[0_0_18px_4px_rgb(34_211_238/0.6)]" />
            </div>
            <div className="absolute -inset-14 rounded-full border border-line" />
            <div className="absolute -inset-14 animate-orbit-reverse rounded-full [--orbit-duration:46s]">
              <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-plasma shadow-[0_0_14px_3px_rgb(192_132_252/0.6)]" />
            </div>
            <div className="relative size-full overflow-hidden rounded-full border border-line bg-hull shadow-[0_0_120px_-20px_rgb(139_92_246/0.55)]">
              {profile.avatarUrl && (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 1024px) 384px, 420px"
                  className="object-cover object-[50%_22%]"
                  priority={false}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent" />
            </div>
          </div>
          <div className="glass absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs whitespace-nowrap text-dim">
            <MapPin className="size-3.5 text-ion" /> {profile.location}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-lg leading-[1.8] text-pretty text-ink/90 md:text-xl">
              {profile.bio}
            </p>
          </Reveal>

          {profile.stats.length > 0 && (
            <Reveal
              delay={0.1}
              className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-4"
            >
              {profile.stats.map((stat) => (
                <div key={stat.label} className="bg-space/90 p-5 sm:p-6">
                  <div className="font-display text-3xl font-medium text-white md:text-4xl">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mt-2 text-xs leading-snug text-dim">
                    {stat.label}
                  </div>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
