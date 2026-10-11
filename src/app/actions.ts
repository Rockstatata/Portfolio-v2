"use server";

import { z } from "zod";
import { db, hasDatabase, schema } from "@/lib/db";
import { deliverContactMessage } from "@/lib/contact-delivery";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ContactState = { ok?: boolean; error?: string };

const message = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(120),
  email: z
    .string()
    .trim()
    .max(200)
    .pipe(z.email("That email doesn't look right")),
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
  let saved;
  try {
    [saved] = await db()
      .insert(schema.messages)
      .values(parsed.data)
      .returning();
    if (!saved) throw new Error("message_not_saved");
  } catch {
    return {
      error:
        "Your message could not be saved. Please try again or email me directly.",
    };
  }
  const delivery = await deliverContactMessage(saved);
  try {
    await db()
      .update(schema.messages)
      .set(delivery)
      .where(eq(schema.messages.id, saved.id));
  } catch {
    // The original remains durable even if recording the delivery receipt fails.
    console.error("contact_delivery_receipt_not_saved");
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}
