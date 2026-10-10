"use client";

import { useActionState } from "react";
import { login, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    {},
  );
  return (
    <form action={action} className="glass grid gap-4 rounded-2xl p-6">
      <label className="grid gap-2">
        <span className="hud-label">Passphrase</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="field"
        />
      </label>
      {state.error && <p className="text-sm text-nova">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-void transition hover:bg-plasma disabled:opacity-60"
      >
        {pending ? "Verifying…" : "Enter"}
      </button>
    </form>
  );
}
