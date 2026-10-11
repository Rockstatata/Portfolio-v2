import { listMessages } from "@/lib/admin/queries";
import { PageHeader } from "@/components/admin/page-header";
import { MessageList } from "@/components/admin/message-list";
import { contactDeliveryConfigured } from "@/lib/contact-delivery";
import { Suspense } from "react";

export default function MessagesPage() {
  return (
    <>
      <PageHeader
        title="Messages"
        description="Everything sent through the contact form."
      />
      <div className="glass mb-6 rounded-2xl p-5 text-sm leading-7">
        <p
          className={contactDeliveryConfigured() ? "text-aurora" : "text-flare"}
        >
          {contactDeliveryConfigured()
            ? "Google delivery is configured. Each message below shows whether both the Sheet and email confirmed delivery."
            : "Google delivery needs setup. Messages are saved here, but Sheet and email delivery are not connected yet."}
        </p>
        <a
          href="https://github.com/Rockstatata/Portfolio-v2/blob/master/docs/contact-setup.md"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex min-h-11 items-center text-ion underline underline-offset-4"
        >
          Google Sheet and email setup guide
        </a>
      </div>
      <Suspense
        fallback={
          <div role="status" className="glass rounded-2xl p-5 text-dim">
            Loading messages…
          </div>
        }
      >
        <Messages />
      </Suspense>
    </>
  );
}

async function Messages() {
  const messages = await listMessages();
  return (
    <MessageList
      messages={messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
