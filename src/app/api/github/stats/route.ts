import { NextResponse } from "next/server";

const GITHUB_USERNAME = "asadullah48";

export async function GET() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const profile = await profileRes.json();
    const repos: Array<{ stargazers_count: number; language: string | null; fork: boolean }> =
      await reposRes.json();

    const ownRepos = repos.filter((r) => !r.fork);
    const total_stars = ownRepos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    const langCount: Record<string, number> = {};
    for (const repo of ownRepos) {
      if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
    }
    const top_languages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    return NextResponse.json({
      public_repos: profile.public_repos as number,
      followers: profile.followers as number,
      following: profile.following as number,
      total_stars,
      top_languages,
    });
  } catch (error) {
    console.error("GitHub Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
