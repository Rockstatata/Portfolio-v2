import { listMessages } from "@/lib/admin/queries";
import { PageHeader } from "@/components/admin/page-header";
import { MessageList } from "@/components/admin/message-list";

export default async function MessagesPage() {
  const messages = await listMessages();
  return (
    <>
      <PageHeader
        title="Messages"
        description="Everything sent through the contact form."
      />
      <MessageList
        messages={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
