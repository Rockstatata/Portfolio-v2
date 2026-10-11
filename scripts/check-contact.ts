import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { createDatabase } from "../src/lib/db/client";
import { messages } from "../src/lib/db/schema";
import {
  contactDeliveryConfigured,
  deliverContactMessage,
} from "../src/lib/contact-delivery";

config({ path: ".env.local", quiet: true });
async function main() {
  if (!contactDeliveryConfigured() || !process.env.DATABASE_URL)
    throw new Error(
      "Set CONTACT_WEBHOOK_URL, CONTACT_WEBHOOK_SECRET and DATABASE_URL in .env.local first.",
    );
  const health = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
    signal: AbortSignal.timeout(15000),
  });
  const result = await health.json();
  if (!health.ok || result.service !== "portfolio-contact-relay")
    throw new Error(
      "The Google web app is not reachable. Deploy it as yourself, accessible to Anyone, and use its /exec URL.",
    );
  const db = createDatabase(process.env.DATABASE_URL!);
  const [message] = await db
    .insert(messages)
    .values({
      name: "Portfolio relay verification",
      email: "sarwad015@gmail.com",
      body: "This is the portfolio contact setup check. If you received this email and see this message in your Messages sheet, both delivery destinations are working.",
    })
    .returning();
  const delivery = await deliverContactMessage(message);
  await db.update(messages).set(delivery).where(eq(messages.id, message.id));
  if (delivery.deliveryStatus !== "delivered")
    throw new Error(delivery.deliveryError);
  console.log(
    `Verified message ${message.id}: saved in the database, Google Sheet and email.`,
  );
}
main()
  .then(() => process.exit(0))
  .catch(() => {
    console.error(
      "Contact verification failed. Check the Google deployment and /admin/messages for delivery details. No secret values were printed.",
    );
    process.exit(1);
  });
