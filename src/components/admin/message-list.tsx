"use client";

import { Mail, MailOpen, Reply, Trash2, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import {
  deleteMessage,
  setMessageRead,
  retryMessageDelivery,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Row = {
  id: number;
  name: string;
  email: string;
  body: string;
  read: boolean;
  createdAt: string;
  deliveryStatus: string;
  deliveryError: string;
};

export function MessageList({ messages }: { messages: Row[] }) {
  const [rows, setRows] = useState(messages);
  const [pending, start] = useTransition();

  if (rows.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-dim">
        No transmissions yet.
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {rows.map((m) => (
        <li
          key={m.id}
          className={cn("glass rounded-2xl p-5", !m.read && "border-ion/30")}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-white">
                {!m.read && <span className="size-2 rounded-full bg-ion" />}
                {m.name}
              </div>
              <a
                href={`mailto:${m.email}`}
                className="text-sm text-plasma hover:underline"
              >
                {m.email}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <span className="mr-2 font-mono text-xs text-faint">
                {new Date(m.createdAt).toLocaleString()}
              </span>
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                title="Reply"
                className="grid size-9 place-items-center rounded-lg text-dim hover:bg-white/5 hover:text-white"
              >
                <Reply className="size-4" />
              </a>
              <button
                type="button"
                title={m.read ? "Mark unread" : "Mark read"}
                onClick={() => {
                  setRows((r) =>
                    r.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)),
                  );
                  start(() => setMessageRead(m.id, !m.read));
                }}
                className="grid size-9 place-items-center rounded-lg text-dim hover:bg-white/5 hover:text-white"
              >
                {m.read ? (
                  <Mail className="size-4" />
                ) : (
                  <MailOpen className="size-4" />
                )}
              </button>
              <button
                type="button"
                title="Delete"
                onClick={() => {
                  if (!confirm("Delete this message?")) return;
                  setRows((r) => r.filter((x) => x.id !== m.id));
                  start(() => deleteMessage(m.id));
                }}
                className="grid size-9 place-items-center rounded-lg text-dim hover:bg-nova/10 hover:text-nova"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink/85">
            {m.body}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <div role="status" className="text-xs">
              <p
                className={
                  m.deliveryStatus === "delivered"
                    ? "text-aurora"
                    : "text-flare"
                }
              >
                {m.deliveryStatus === "delivered"
                  ? "Delivered to Google Sheet and email"
                  : "Delivery needs attention"}
              </p>
              {m.deliveryError && (
                <p className="mt-2 max-w-xl leading-5 text-dim">
                  {m.deliveryError}
                </p>
              )}
            </div>
            {m.deliveryStatus !== "delivered" && (
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    try {
                      const delivery = await retryMessageDelivery(m.id);
                      setRows((rows) =>
                        rows.map((row) =>
                          row.id === m.id ? { ...row, ...delivery } : row,
                        ),
                      );
                    } catch {
                      setRows((rows) =>
                        rows.map((row) =>
                          row.id === m.id
                            ? {
                                ...row,
                                deliveryError:
                                  "Retry failed. Your message remains saved; try again shortly.",
                              }
                            : row,
                        ),
                      );
                    }
                  })
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ion/30 px-4 text-xs text-ion disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" />
                {pending ? "Retrying…" : "Retry delivery"}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
