"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Cpu,
  Telescope,
  ExternalLink,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { GithubIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/focusAreas", label: "Research vectors", icon: Telescope },
  { href: "/admin/projects", label: "Projects", icon: Rocket },
  { href: "/admin/publications", label: "Research", icon: BookOpen },
  { href: "/admin/experiences", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/achievements", label: "Honors", icon: Award },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/github", label: "GitHub import", icon: GithubIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-line lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5 lg:py-8">
        <Link href="/admin" className="mb-6 flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-full border border-line bg-hull">
            <span className="size-2 rounded-full bg-ion shadow-[0_0_10px_2px_rgb(34_211_238/0.7)]" />
          </span>
          <span>
            <span className="block font-display text-sm text-white">
              Mission Control
            </span>
            <span className="hud-label !text-[0.6rem]">Content admin</span>
          </span>
        </Link>
        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition",
                  active
                    ? "bg-nebula/15 text-white ring-1 ring-nebula/30"
                    : "text-dim hover:bg-white/5 hover:text-ink",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex gap-2 lg:mt-auto lg:flex-col">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-dim transition hover:bg-white/5 hover:text-ink"
          >
            <ExternalLink className="size-4" /> View site
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-dim transition hover:bg-white/5 hover:text-nova">
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
