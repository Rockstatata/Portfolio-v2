"use client";

import { Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/app/admin/actions";
import type { Field } from "@/lib/admin/collections";
import { cn } from "@/lib/utils";
import { MarkdownEditor } from "./markdown-editor";

function toText(field: Field, value: unknown) {
  if (Array.isArray(value))
    return value.join(field.type === "tags" ? ", " : "\n");
  return value == null ? "" : String(value);
}

export function UploadButton({
  onUploaded,
  accept = "image/*",
}: {
  onUploaded: (url: string) => void;
  accept?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  return (
    <>
      <input
        ref={input}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const data = new FormData();
          data.set("file", file);
          start(async () => {
            const result = await uploadFile(data);
            if (result.url) {
              onUploaded(result.url);
              toast.success("Uploaded");
            } else toast.error(result.error ?? "Upload failed");
          });
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={pending}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line px-3 text-sm text-dim transition hover:text-white disabled:opacity-60"
      >
        <Upload className="size-4" /> {pending ? "Uploading…" : "Upload"}
      </button>
    </>
  );
}

export function FieldInput({
  field,
  value,
  error,
}: {
  field: Field;
  value: unknown;
  error?: string;
}) {
  const [text, setText] = useState(toText(field, value));
  const id = `field-${field.name}`;
  const wrap = cn(
    "grid content-start gap-2",
    (field.wide || field.type === "textarea" || field.type === "lines") &&
      "sm:col-span-2",
  );

  if (field.type === "boolean") {
    return (
      <label className={cn(wrap, "glass cursor-pointer rounded-xl p-4")}>
        <span className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink">{field.label}</span>
          <input
            type="checkbox"
            name={field.name}
            defaultChecked={value === true}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/10 transition peer-checked:bg-nebula peer-focus-visible:ring-2 peer-focus-visible:ring-ion after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
        </span>
        {field.help && <span className="text-xs text-faint">{field.help}</span>}
      </label>
    );
  }

  return (
    <div className={wrap}>
      <label htmlFor={id} className="hud-label">
        {field.label}
        {field.required && <span className="text-nova"> *</span>}
      </label>
      {field.type === "markdown" ? (
        <MarkdownEditor
          id={id}
          name={field.name}
          value={text}
          onChange={setText}
        />
      ) : field.type === "textarea" || field.type === "lines" ? (
        <textarea
          id={id}
          name={field.name}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={field.type === "lines" ? 5 : 6}
          placeholder={field.placeholder}
          className="field resize-y"
        />
      ) : field.type === "select" ? (
        <select id={id} name={field.name} defaultValue={text} className="field">
          {field.options?.map((o) => (
            <option key={o.value} value={o.value} className="bg-hull">
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type={field.type === "date" ? "date" : "text"}
            id={id}
            name={field.name}
            value={text}
            onChange={(e) => {
              if (e.nativeEvent.isTrusted)
                e.currentTarget.dataset.touched = "1";
              setText(e.target.value);
            }}
            placeholder={
              field.placeholder ??
              (field.type === "url" || field.type === "image"
                ? "https://"
                : undefined)
            }
            className="field"
          />
          {field.type === "image" && <UploadButton onUploaded={setText} />}
        </div>
      )}
      {field.type === "image" && text && (
        // Admin preview of an arbitrary URL; next/image would need every host allow-listed.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={text}
          alt=""
          className="mt-1 h-28 w-auto rounded-xl border border-line object-cover"
        />
      )}
      {error ? (
        <span className="text-xs text-nova">{error}</span>
      ) : (
        field.help && <span className="text-xs text-faint">{field.help}</span>
      )}
    </div>
  );
}
