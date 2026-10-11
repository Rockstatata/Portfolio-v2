"use client";
import { useState } from "react";
import { Markdown } from "@/components/blog/markdown";

export function MarkdownEditor({
  id,
  name,
  value,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-void/50">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-2">
        <button
          type="button"
          aria-pressed={!preview}
          onClick={() => setPreview(false)}
          className={`min-h-11 rounded-lg px-4 text-sm ${!preview ? "bg-nebula/20 text-white" : "text-dim"}`}
        >
          Write
        </button>
        <button
          type="button"
          aria-pressed={preview}
          onClick={() => setPreview(true)}
          className={`min-h-11 rounded-lg px-4 text-sm ${preview ? "bg-nebula/20 text-white" : "text-dim"}`}
        >
          Preview
        </button>
        <span className="px-2 text-xs text-dim">
          Markdown: ## heading · **bold** · [link](url) · ``` code
        </span>
      </div>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={18}
        className={`field min-h-80 resize-y border-0 font-mono text-sm ${preview ? "hidden" : "block"}`}
        placeholder="Write something worth sharing…"
      />
      {preview && (
        <div className="min-h-80 p-5">
          {value ? (
            <Markdown body={value} />
          ) : (
            <p className="text-dim">Your article preview appears here.</p>
          )}
        </div>
      )}
    </div>
  );
}
