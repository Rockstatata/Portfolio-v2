import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import { collectionList } from "@/lib/admin/collections";
import { dashboardCounts, listMessages } from "@/lib/admin/queries";
import { githubConfigured } from "@/lib/github";
import { PageHeader } from "@/components/admin/page-header";

export default async function AdminHome() {
  const [counts, messages] = await Promise.all([
    dashboardCounts(),
    listMessages(),
  ]);
  const recent = messages.slice(0, 4);
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Everything on the public site, at a glance. Edits go live as soon as you save."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {collectionList.map((c) => (
          <Link
            key={c.key}
            href={`/admin/${c.key}`}
            className="glass group flex items-start justify-between rounded-2xl p-5 transition hover:border-nebula/40"
          >
            <div>
              <div className="hud-label">{c.label}</div>
              <div className="mt-3 font-display text-3xl text-white">
                {counts[c.key]}
              </div>
              <div className="mt-1 text-xs text-faint">{c.description}</div>
            </div>
            <ArrowUpRight className="size-4 text-faint transition group-hover:text-white" />
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm text-ink">
              <Inbox className="size-4 text-ion" /> Recent messages
              {counts.unread > 0 && (
                <span className="rounded-full bg-ion/15 px-2 py-0.5 text-xs text-ion">
                  {counts.unread} new
                </span>
              )}
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-dim hover:text-white"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-faint">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={m.read ? "text-dim" : "text-white"}>
                      {m.name}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      {m.createdAt.toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-faint">
                    {m.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="mb-4 text-sm text-ink">System status</h2>
          <ul className="space-y-3 text-sm">
            {[
              [
                "Database",
                true,
                process.env.DATABASE_URL?.startsWith("pglite:")
                  ? "Local PGlite (dev only)"
                  : "Neon connected",
              ],
              [
                "Image uploads",
                blob,
                blob ? "Vercel Blob ready" : "Set BLOB_READ_WRITE_TOKEN",
              ],
              [
                "GitHub import",
                githubConfigured(),
                githubConfigured() ? "Token set" : "Set GITHUB_TOKEN",
              ],
            ].map(([label, ok, detail]) => (
              <li
                key={String(label)}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-dim">
                  <span
                    className={`size-2 rounded-full ${ok ? "bg-aurora" : "bg-flare"}`}
                  />
                  {label}
                </span>
                <span className="text-right text-xs text-faint">{detail}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
