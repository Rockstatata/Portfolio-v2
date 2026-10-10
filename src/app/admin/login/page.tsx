import { adminConfigured } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const configured = adminConfigured();
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border border-line bg-hull shadow-[0_0_60px_-10px_rgb(139_92_246/0.7)]">
            <span className="size-3 rounded-full bg-ion shadow-[0_0_14px_3px_rgb(34_211_238/0.7)]" />
          </div>
          <h1 className="font-display text-2xl text-white">Mission Control</h1>
          <p className="mt-2 text-sm text-dim">Authorised crew only.</p>
        </div>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="glass rounded-2xl p-5 text-sm leading-relaxed text-dim">
            Set <code className="text-ion">ADMIN_PASSWORD</code> and{" "}
            <code className="text-ion">ADMIN_SESSION_SECRET</code> in{" "}
            <code>.env.local</code> (see <code>.env.example</code>), then
            restart the server.
          </div>
        )}
      </div>
    </main>
  );
}
