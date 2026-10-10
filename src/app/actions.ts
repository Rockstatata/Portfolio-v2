"use server";

import { z } from "zod";
import { db, hasDatabase, schema } from "@/lib/db";

export type ContactState = { ok?: boolean; error?: string };

const message = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(120),
  email: z.email("That email doesn't look right").max(200),
  body: z
    .string()
    .trim()
    .min(10, "Say a little more (10+ characters)")
    .max(5000),
});

export async function sendMessage(
  _: ContactState,
  form: FormData,
): Promise<ContactState> {
  // Bots fill every field, people never see this one.
  if (form.get("company")) return { ok: true };

  const parsed = message.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    body: form.get("body"),
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Invalid message" };

  if (!hasDatabase) {
    return {
      error: "The message relay is offline. Please email me directly instead.",
    };
  }
  await db().insert(schema.messages).values(parsed.data);
  return { ok: true };
}
