"use server";

import { desc, eq, inArray } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { put } from "@vercel/blob";
import { db, schema } from "@/lib/db";
import {
  adminConfigured,
  endSession,
  passwordMatches,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import {
  collections,
  isCollectionKey,
  type CollectionKey,
} from "@/lib/admin/collections";
import { parseFields, parsePairs, slugify } from "@/lib/admin/parse";
import { tables } from "@/lib/admin/tables";
import { listGithubRepos } from "@/lib/github";
import { CONTENT_TAG } from "@/lib/content";

export type FormState = {
  error?: string;
  errors?: Record<string, string>;
  ok?: string;
};

// The generic CRUD below works on any collection table. They all share
// id / sortOrder / visible columns, and values are validated against the
// collection's field list before they reach the query.
type AnyTable = typeof schema.projects;
const tableFor = (key: CollectionKey) => tables[key] as unknown as AnyTable;

function refresh() {
  updateTag(CONTENT_TAG);
}

/* ─────────────────────────── auth ─────────────────────────── */

const attempts = new Map<string, { count: number; until: number }>();

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!adminConfigured()) {
    return {
      error: "Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local first.",
    };
  }
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.count >= 5 && entry.until > now) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  if (!passwordMatches(String(form.get("password") ?? ""))) {
    const count = entry && entry.until > now ? entry.count + 1 : 1;
    attempts.set(ip, { count, until: now + 10 * 60 * 1000 });
    return { error: "Wrong passphrase." };
  }

  attempts.delete(ip);
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ─────────────────────────── collections ─────────────────────────── */

export async function saveItem(
  key: string,
  id: number | null,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  if (!isCollectionKey(key)) return { error: "Unknown collection" };

  const parsed = parseFields(collections[key].fields, form);
  if (!parsed.ok)
    return { errors: parsed.errors, error: "Fix the highlighted fields." };

  const table = tableFor(key);
  try {
    if (id) {
      await db().update(table).set(parsed.values).where(eq(table.id, id));
    } else {
      const [last] = await db()
        .select({ sortOrder: table.sortOrder })
        .from(table)
        .orderBy(desc(table.sortOrder))
        .limit(1);
      await db()
        .insert(table)
        .values({
          ...parsed.values,
          sortOrder: (last?.sortOrder ?? -1) + 1,
        } as AnyTable["$inferInsert"]);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("unique"))
      return { errors: { slug: "That slug is already used" } };
    return { error: message };
  }

  refresh();
  redirect(`/admin/${key}?saved=1`);
}

export async function deleteItem(key: string, id: number) {
  await requireAdmin();
  if (!isCollectionKey(key)) return;
  const table = tableFor(key);
  await db().delete(table).where(eq(table.id, id));
  refresh();
}

export async function toggleVisible(key: string, id: number, visible: boolean) {
  await requireAdmin();
  if (!isCollectionKey(key)) return;
  const table = tableFor(key);
  await db().update(table).set({ visible }).where(eq(table.id, id));
  refresh();
}

/** Persists a full drag-and-drop ordering: ids[i] gets sortOrder i. */
export async function reorder(key: string, ids: number[]) {
  await requireAdmin();
  if (!isCollectionKey(key)) return;
  const table = tableFor(key);
  await Promise.all(
    ids.map((id, index) =>
      db().update(table).set({ sortOrder: index }).where(eq(table.id, id)),
    ),
  );
  refresh();
}

/* ─────────────────────────── profile ─────────────────────────── */

export async function saveProfile(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const get = (name: string) => String(form.get(name) ?? "").trim();
  const name = get("name");
  if (!name) return { errors: { name: "Name is required" } };

  const values = {
    name,
    headline: get("headline"),
    roles: get("roles")
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean),
    bio: get("bio"),
    location: get("location"),
    email: get("email"),
    avatarUrl: get("avatarUrl"),
    resumeUrl: get("resumeUrl"),
    availability: get("availability"),
    socials: parsePairs(get("socials")).map(({ label, value }) => ({
      label,
      url: value,
    })),
    stats: parsePairs(get("stats")),
    updatedAt: new Date(),
  };

  await db()
    .insert(schema.profile)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: schema.profile.id, set: values });
  refresh();
  return { ok: "Profile saved" };
}

/* ─────────────────────────── uploads ─────────────────────────── */

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function uploadFile(
  form: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      error:
        "Set BLOB_READ_WRITE_TOKEN to enable uploads, or paste a URL instead.",
    };
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { error: "No file selected" };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Max upload size is 8 MB" };
  if (!/^(image\/|application\/pdf$)/.test(file.type))
    return { error: "Images or PDFs only" };

  const blob = await put(`portfolio/${slugify(file.name) || "upload"}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return { url: blob.url };
}

/* ─────────────────────────── messages ─────────────────────────── */

export async function setMessageRead(id: number, read: boolean) {
  await requireAdmin();
  await db()
    .update(schema.messages)
    .set({ read })
    .where(eq(schema.messages.id, id));
}

export async function deleteMessage(id: number) {
  await requireAdmin();
  await db().delete(schema.messages).where(eq(schema.messages.id, id));
}

/* ─────────────────────────── GitHub import ─────────────────────────── */

export async function importRepos(fullNames: string[]): Promise<FormState> {
  await requireAdmin();
  if (fullNames.length === 0)
    return { error: "Select at least one repository" };

  const repos = (await listGithubRepos()).filter((r) =>
    fullNames.includes(r.fullName),
  );
  const existing = await db()
    .select({ slug: schema.projects.slug })
    .from(schema.projects)
    .where(
      inArray(
        schema.projects.slug,
        repos.map((r) => slugify(r.name)),
      ),
    );
  const taken = new Set(existing.map((e) => e.slug));
  const [last] = await db()
    .select({ sortOrder: schema.projects.sortOrder })
    .from(schema.projects)
    .orderBy(desc(schema.projects.sortOrder))
    .limit(1);
  let order = (last?.sortOrder ?? -1) + 1;

  const rows = repos
    .filter((r) => !taken.has(slugify(r.name)))
    .map((r) => ({
      slug: slugify(r.name),
      title: r.name.replace(/[-_]+/g, " "),
      tagline: r.description,
      description: r.description,
      tech: [r.language, ...r.topics].filter(Boolean),
      category: "Web",
      repoUrl: r.isPrivate ? "" : r.url,
      liveUrl: r.homepage,
      year: r.pushedAt.slice(0, 4),
      context: r.owner === r.viewer ? "" : r.owner,
      isPrivate: r.isPrivate,
      visible: false,
      sortOrder: order++,
    }));

  if (rows.length) await db().insert(schema.projects).values(rows);
  refresh();
  const skipped = repos.length - rows.length;
  return {
    ok: `Imported ${rows.length} as hidden drafts${skipped ? `, skipped ${skipped} already present` : ""}. Edit and publish them from Projects.`,
  };
}
