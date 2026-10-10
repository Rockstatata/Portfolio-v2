const steps = [
  [
    "Create a Neon database",
    "neon.tech → New project. Copy the pooled connection string.",
  ],
  ["Add it to .env.local", "DATABASE_URL=postgres://…"],
  ["Create the tables", "npm run db:push"],
  ["Load your current content", "npm run db:seed"],
  ["Restart the dev server", "Then refresh this page."],
];

export function SetupNotice() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-white">Connect a database</h1>
      <p className="mt-3 text-dim">
        The public site is rendering from{" "}
        <code className="text-ion">src/content/seed.ts</code>. To edit content
        from this dashboard, connect Neon Postgres:
      </p>
      <ol className="mt-8 space-y-3">
        {steps.map(([title, detail], i) => (
          <li key={title} className="glass flex gap-4 rounded-2xl p-4">
            <span className="font-mono text-sm text-ion">0{i + 1}</span>
            <div>
              <div className="text-ink">{title}</div>
              <code className="text-sm text-dim">{detail}</code>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
