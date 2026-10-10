"use client";

import { useActionState } from "react";
import { saveItem, type FormState } from "@/app/admin/actions";
import type { Field } from "@/lib/admin/collections";
import { slugify } from "@/lib/admin/parse";
import { FieldInput } from "./field-input";

type Props = {
  collectionKey: string;
  id: number | null;
  fields: Field[];
  initial: Record<string, unknown>;
};

export function ItemForm({ collectionKey, id, fields, initial }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveItem.bind(null, collectionKey, id),
    {},
  );

  return (
    <form
      action={action}
      className="glass grid gap-5 rounded-2xl p-5 sm:grid-cols-2 sm:p-7"
      onChange={(e) => {
        // Suggest a slug from the title while creating a new item.
        const target = e.target;
        if (
          id ||
          !(target instanceof HTMLInputElement) ||
          target.name !== "title"
        )
          return;
        const slug = e.currentTarget.elements.namedItem(
          "slug",
        ) as HTMLInputElement | null;
        if (slug && !slug.dataset.touched) {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          )?.set;
          setter?.call(slug, slugify(target.value));
          slug.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }}
    >
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={initial[field.name]}
          error={state.errors?.[field.name]}
        />
      ))}
      <div className="flex items-center gap-4 sm:col-span-2">
        <button
          disabled={pending}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-void transition hover:bg-plasma disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save & publish"}
        </button>
        {state.error && <p className="text-sm text-nova">{state.error}</p>}
      </div>
    </form>
  );
}
