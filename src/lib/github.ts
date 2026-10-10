import "server-only";

export type GithubRepo = {
  fullName: string;
  name: string;
  owner: string;
  viewer: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  topics: string[];
  stars: number;
  isPrivate: boolean;
  isFork: boolean;
  pushedAt: string;
};

type ApiRepo = {
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  private: boolean;
  fork: boolean;
  pushed_at: string;
};

export const githubConfigured = () => Boolean(process.env.GITHUB_TOKEN);

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Every repo the token can see: personal, collaborator and organisation, public and private. */
export async function listGithubRepos(): Promise<GithubRepo[]> {
  if (!githubConfigured()) return [];
  const viewer = (await gh<{ login: string }>("/user")).login;

  const repos: ApiRepo[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await gh<ApiRepo[]>(
      `/user/repos?per_page=100&page=${page}&sort=pushed&affiliation=owner,collaborator,organization_member`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  return repos.map((r) => ({
    fullName: r.full_name,
    name: r.name,
    owner: r.owner.login,
    viewer,
    description: r.description ?? "",
    url: r.html_url,
    homepage: r.homepage ?? "",
    language: r.language ?? "",
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    isPrivate: r.private,
    isFork: r.fork,
    pushedAt: r.pushed_at,
  }));
}
