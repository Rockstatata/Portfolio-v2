import "server-only";
import { asc, count, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { CollectionKey } from "./collections";
import { tables } from "./tables";

type AnyTable = typeof schema.projects;

export async function listItems(key: CollectionKey) {
  await requireAdmin();
  const table = tables[key] as unknown as AnyTable;
  return (await db()
    .select()
    .from(table)
    .orderBy(asc(table.sortOrder), asc(table.id))) as Record<
    string,
    unknown
  >[] as ({
    id: number;
    visible: boolean;
    sortOrder: number;
  } & Record<string, unknown>)[];
}

export async function getItem(key: CollectionKey, id: number) {
  await requireAdmin();
  const table = tables[key] as unknown as AnyTable;
  const [row] = await db().select().from(table).where(eq(table.id, id));
  return (row as Record<string, unknown> | undefined) ?? null;
}

export async function getProfileRow() {
  await requireAdmin();
  const [row] = await db()
    .select()
    .from(schema.profile)
    .where(eq(schema.profile.id, 1));
  return row ?? null;
}

export async function listMessages() {
  await requireAdmin();
  return db()
    .select()
    .from(schema.messages)
    .orderBy(desc(schema.messages.createdAt));
}

export async function dashboardCounts() {
  await requireAdmin();
  const entries = await Promise.all(
    (Object.keys(tables) as CollectionKey[]).map(async (key) => {
      const [row] = await db()
        .select({ n: count() })
        .from(tables[key] as unknown as AnyTable);
      return [key, row?.n ?? 0] as const;
    }),
  );
  const [unread] = await db()
    .select({ n: count() })
    .from(schema.messages)
    .where(eq(schema.messages.read, false));
  return { ...Object.fromEntries(entries), unread: unread?.n ?? 0 } as Record<
    CollectionKey | "unread",
    number
  >;
}
