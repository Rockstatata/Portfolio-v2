"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { saveProfile, type FormState } from "@/app/admin/actions";
import { UploadButton } from "./field-input";

type Values = Record<
  | "name"
  | "headline"
  | "roles"
  | "bio"
  | "location"
  | "email"
  | "avatarUrl"
  | "resumeUrl"
  | "availability"
  | "socials"
  | "stats",
  string
>;

function Text({
  name,
  label,
  value,
  help,
  rows,
}: {
  name: keyof Values;
  label: string;
  value: string;
  help?: string;
  rows?: number;
}) {
  return (
    <label className={rows ? "grid gap-2 sm:col-span-2" : "grid gap-2"}>
      <span className="hud-label">{label}</span>
      {rows ? (
        <textarea
          name={name}
          defaultValue={value}
          rows={rows}
          className="field resize-y"
        />
      ) : (
        <input name={name} defaultValue={value} className="field" />
      )}
      {help && <span className="text-xs text-faint">{help}</span>}
    </label>
  );
}

function AssetField({
  name,
  label,
  value,
  accept,
}: {
  name: keyof Values;
  label: string;
  value: string;
  accept: string;
}) {
  const [url, setUrl] = useState(value);
  return (
    <label className="grid gap-2">
      <span className="hud-label">{label}</span>
      <div className="flex gap-2">
        <input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="field"
        />
        <UploadButton onUploaded={setUrl} accept={accept} />
      </div>
    </label>
  );
}

export function ProfileForm({ initial }: { initial: Values }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveProfile,
    {},
  );

  useEffect(() => {
    if (state.ok) toast.success(state.ok);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form
      action={action}
      className="glass grid gap-5 rounded-2xl p-5 sm:grid-cols-2 sm:p-7"
    >
      <Text name="name" label="Name" value={initial.name} />
      <Text name="location" label="Location" value={initial.location} />
      <Text
        name="headline"
        label="Headline"
        value={initial.headline}
        rows={2}
      />
      <Text
        name="roles"
        label="Rotating roles"
        value={initial.roles}
        rows={4}
        help="One per line — typed out in the hero."
      />
      <Text name="bio" label="About" value={initial.bio} rows={7} />
      <Text name="email" label="Public email" value={initial.email} />
      <Text
        name="availability"
        label="Availability line"
        value={initial.availability}
      />
      <AssetField
        name="avatarUrl"
        label="Portrait"
        value={initial.avatarUrl}
        accept="image/*"
      />
      <AssetField
        name="resumeUrl"
        label="CV (PDF)"
        value={initial.resumeUrl}
        accept="application/pdf"
      />
      <Text
        name="socials"
        label="Social links"
        value={initial.socials}
        rows={5}
        help="One per line as  Label | https://url  — GitHub, LinkedIn, X, Google Scholar and Email get icons."
      />
      <Text
        name="stats"
        label="Stats"
        value={initial.stats}
        rows={4}
        help="One per line as  Label | value  — numbers count up on scroll."
      />
      <div className="flex items-center gap-4 sm:col-span-2">
        <button
          disabled={pending}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-void transition hover:bg-plasma disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save & publish"}
        </button>
        {state.errors?.name && (
          <p className="text-sm text-nova">{state.errors.name}</p>
        )}
      </div>
    </form>
  );
}
