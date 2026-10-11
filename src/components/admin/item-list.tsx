"use client";

import { Reorder } from "motion/react";
import { Eye, EyeOff, GripVertical, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteItem, reorder, toggleVisible } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Row = {
  id: number;
  title: string;
  subtitle: string;
  visible: boolean;
  featured: boolean;
};

export function ItemList({
  collectionKey,
  items,
}: {
  collectionKey: string;
  items: Row[];
}) {
  const [rows, setRows] = useState(items);
  const [dirty, setDirty] = useState(false);
  const [, startTransition] = useTransition();

  // Re-sync when the server sends a fresh list (after a delete or save).
  const [source, setSource] = useState(items);
  if (source !== items) {
    setSource(items);
    setRows(items);
  }

  const persistOrder = () => {
    if (!dirty) return;
    setDirty(false);
    startTransition(async () => {
      await reorder(
        collectionKey,
        rows.map((r) => r.id),
      );
      toast.success("Order saved");
    });
  };

  if (rows.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-dim">
        Nothing here yet.
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={rows}
      onReorder={(next) => {
        setRows(next);
        setDirty(true);
      }}
      className="grid gap-2"
    >
      {rows.map((row) => (
        <Reorder.Item
          key={row.id}
          value={row}
          onDragEnd={persistOrder}
          className={cn(
            "glass flex items-center gap-3 rounded-2xl px-3 py-3 sm:px-4",
            !row.visible && "opacity-55",
          )}
        >
          <GripVertical className="size-4 shrink-0 cursor-grab text-faint active:cursor-grabbing" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm text-white">
                {row.title || "Untitled"}
              </span>
              {row.featured && (
                <Star className="size-3.5 shrink-0 fill-flare text-flare" />
              )}
              {!row.visible && (
                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.65rem] text-faint">
                  Hidden
                </span>
              )}
            </div>
            {row.subtitle && (
              <div className="truncate text-xs text-faint">{row.subtitle}</div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title={row.visible ? "Hide from site" : "Show on site"}
              onClick={() => {
                const visible = !row.visible;
                setRows((r) =>
                  r.map((x) => (x.id === row.id ? { ...x, visible } : x)),
                );
                startTransition(async () => {
                  await toggleVisible(collectionKey, row.id, visible);
                  toast.success(visible ? "Now visible" : "Hidden from site");
                });
              }}
              className="grid size-9 place-items-center rounded-lg text-dim transition hover:bg-white/5 hover:text-white"
            >
              {row.visible ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>
            <Link
              href={`/admin/${collectionKey}/${row.id}`}
              title="Edit"
              aria-label={`Edit ${row.title || "item"}`}
              className="grid size-9 place-items-center rounded-lg text-dim transition hover:bg-white/5 hover:text-white"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              type="button"
              title="Delete"
              onClick={() => {
                if (!confirm(`Delete "${row.title}"? This cannot be undone.`))
                  return;
                setRows((r) => r.filter((x) => x.id !== row.id));
                startTransition(async () => {
                  await deleteItem(collectionKey, row.id);
                  toast.success("Deleted");
                });
              }}
              className="grid size-9 place-items-center rounded-lg text-dim transition hover:bg-nova/10 hover:text-nova"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
