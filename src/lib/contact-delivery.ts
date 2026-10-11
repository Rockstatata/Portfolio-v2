import type { Message } from "./db/schema";

export type ContactDelivery = {
  deliveryStatus: string;
  deliveryError: string;
  deliveredAt: Date | null;
};

export function contactDeliveryConfigured() {
  return Boolean(
    process.env.CONTACT_WEBHOOK_URL && process.env.CONTACT_WEBHOOK_SECRET,
  );
}

export async function deliverContactMessage(
  message: Pick<Message, "id" | "name" | "email" | "body" | "createdAt">,
): Promise<ContactDelivery> {
  if (!contactDeliveryConfigured())
    return {
      deliveryStatus: "unconfigured",
      deliveryError:
        "Complete Google contact setup to enable Sheet and email delivery.",
      deliveredAt: null,
    };
  try {
    const endpoint = new URL(process.env.CONTACT_WEBHOOK_URL!);
    if (
      endpoint.protocol !== "https:" &&
      !["localhost", "127.0.0.1"].includes(endpoint.hostname)
    )
      throw new Error("invalid_endpoint");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `portfolio-message-${message.id}`,
        name: message.name,
        email: message.email,
        body: message.body,
        submittedAt: message.createdAt.toISOString(),
        secret: process.env.CONTACT_WEBHOOK_SECRET,
      }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("relay_http_error");
    const receipt: {
      ok?: boolean;
      sheetSaved?: boolean;
      emailSent?: boolean;
      error?: string;
    } = await response.json();
    if (
      receipt.ok === true &&
      receipt.sheetSaved === true &&
      receipt.emailSent === true
    )
      return {
        deliveryStatus: "delivered",
        deliveryError: "",
        deliveredAt: new Date(),
      };
    const error =
      receipt.error === "unauthorized"
        ? "Google rejected the shared secret. Check CONTACT_WEBHOOK_SECRET and redeploy the Google script."
        : receipt.sheetSaved === true
          ? "Saved in Google Sheet, but email delivery failed. Check the Apps Script email quota and retry."
          : "Google did not confirm delivery. Check the script deployment, authorization and Sheet access, then retry.";
    return {
      deliveryStatus: "failed",
      deliveryError: error,
      deliveredAt: null,
    };
  } catch {
    return {
      deliveryStatus: "failed",
      deliveryError:
        "Could not reach the Google relay. The original message is safe here; check the webhook and retry.",
      deliveredAt: null,
    };
  }
}
