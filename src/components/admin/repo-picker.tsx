"use client";

import { Check, GitFork, Lock, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { importRepos } from "@/app/admin/actions";
import type { GithubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

type Repo = GithubRepo & { imported: boolean };

export function RepoPicker({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [showForks, setShowForks] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const router = useRouter();

  const owners = useMemo(
    () => Array.from(new Set(repos.map((r) => r.owner))),
    [repos],
  );
  const [owner, setOwner] = useState("all");

  const visible = repos.filter(
    (r) =>
      (showForks || !r.isFork) &&
      (owner === "all" || r.owner === owner) &&
      `${r.fullName} ${r.description} ${r.language}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  const toggle = (name: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${repos.length} repositories`}
            className="field pl-9"
          />
        </label>
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="field w-auto"
        >
          <option value="all" className="bg-hull">
            All owners
          </option>
          {owners.map((o) => (
            <option key={o} value={o} className="bg-hull">
              {o}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-dim">
          <input
            type="checkbox"
            checked={showForks}
            onChange={(e) => setShowForks(e.target.checked)}
          />
          Show forks
        </label>
        <button
          type="button"
          disabled={pending || selected.size === 0}
          onClick={() =>
            start(async () => {
              const result = await importRepos([...selected]);
              if (result.ok) toast.success(result.ok);
              if (result.error) toast.error(result.error);
              setSelected(new Set());
              router.refresh();
            })
          }
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-void transition hover:bg-plasma disabled:opacity-50"
        >
          {pending ? "Importing…" : `Import ${selected.size || ""}`.trim()}
        </button>
      </div>

      <ul className="grid gap-2 md:grid-cols-2">
        {visible.map((r) => {
          const checked = selected.has(r.fullName);
          return (
            <li key={r.fullName}>
              <button
                type="button"
                disabled={r.imported}
                onClick={() => toggle(r.fullName)}
                className={cn(
                  "glass flex w-full items-start gap-3 rounded-2xl p-4 text-left transition",
                  checked && "border-nebula/60 bg-nebula/10",
                  r.imported
                    ? "cursor-default opacity-50"
                    : "hover:border-nebula/40",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border",
                    checked || r.imported
                      ? "border-nebula bg-nebula text-white"
                      : "border-line",
                  )}
                >
                  {(checked || r.imported) && <Check className="size-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-sm text-white">
                    {r.fullName}
                    {r.isPrivate && <Lock className="size-3.5 text-flare" />}
                    {r.isFork && <GitFork className="size-3.5 text-faint" />}
                    {r.imported && (
                      <span className="text-xs text-aurora">imported</span>
                    )}
                  </span>
                  {r.description && (
                    <span className="mt-1 line-clamp-2 block text-xs text-dim">
                      {r.description}
                    </span>
                  )}
                  <span className="mt-2 flex gap-3 font-mono text-[0.68rem] text-faint">
                    {r.language && <span>{r.language}</span>}
                    {r.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="size-3" /> {r.stars}
                      </span>
                    )}
                    <span>{r.pushedAt.slice(0, 10)}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
