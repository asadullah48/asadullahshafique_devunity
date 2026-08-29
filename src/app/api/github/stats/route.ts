import { NextResponse } from "next/server";

const GITHUB_USERNAME = "asadullah48";

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
}

// Last-known-good values served when the GitHub API is unreachable or
// rate-limited (unauthenticated requests share 60/hr per IP on Vercel).
// Keeping the strip populated beats an eternal "Loading…" state.
// Re-measured on 2026-08-27 (repos 481 -> 507). Earlier values had
// drifted badly in both directions — repos and followers were understated
// (467/40), stars were overstated (25). A fallback that lies is worse than
// no fallback, so re-measure these when you touch this file.
//
// Re-measured again 2026-08-29 against the live API: repos 507 -> 506 (the
// total can go DOWN when a repo is deleted or made private, which is exactly
// why a "+" suffix belongs on the display and not in this object), followers
// 135 -> 136. following/total_stars/top_languages verified unchanged.
// Of the 506, 498 are original and 8 are forks.
const FALLBACK_STATS = {
  public_repos: 506,
  followers: 136,
  following: 1429,
  total_stars: 19,
  top_languages: ["TypeScript", "Python", "JavaScript", "Jupyter Notebook", "HTML"],
  fallback: true,
};

export async function GET() {
  // An optional GITHUB_TOKEN raises the rate limit from 60/hr to 5000/hr.
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      return NextResponse.json(FALLBACK_STATS);
    }

    const profile = (await profileRes.json()) as GitHubProfile;
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
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      total_stars,
      top_languages,
    });
  } catch (error) {
    console.error("GitHub Stats error:", error);
    return NextResponse.json(FALLBACK_STATS);
  }
}
