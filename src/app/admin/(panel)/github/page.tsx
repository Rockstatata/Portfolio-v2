import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { githubConfigured, listGithubRepos } from "@/lib/github";
import { slugify } from "@/lib/admin/parse";
import { PageHeader } from "@/components/admin/page-header";
import { RepoPicker } from "@/components/admin/repo-picker";

export default async function GithubPage() {
  await requireAdmin();
  if (!githubConfigured()) {
    return (
      <>
        <PageHeader title="GitHub import" />
        <div className="glass max-w-2xl rounded-2xl p-6 text-sm leading-relaxed text-dim">
          Add a token to <code className="text-ion">.env.local</code> as{" "}
          <code className="text-ion">GITHUB_TOKEN</code>. With the GitHub CLI
          signed in, run <code className="text-ion">gh auth token</code> and
          paste the output, or create a fine-grained token with read access to
          repository metadata. Private and organisation repositories appear when
          the token can see them.
        </div>
      </>
    );
  }

  const [repos, existing] = await Promise.all([
    listGithubRepos(),
    db().select({ slug: schema.projects.slug }).from(schema.projects),
  ]);
  const taken = new Set(existing.map((e) => e.slug));

  return (
    <>
      <PageHeader
        title="GitHub import"
        description="Pick repositories to turn into projects. They arrive hidden so you can polish the copy before publishing. Private repos never expose their URL."
      />
      <RepoPicker
        repos={repos.map((r) => ({
          ...r,
          imported: taken.has(slugify(r.name)),
        }))}
      />
    </>
  );
}
