"use client";

import { useState, useEffect } from "react";

/**
 * Shape of the GitHub stats returned by /api/github/stats
 * (proxied from the FastAPI backend).
 */
interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  top_languages: string[];
}

/**
 * Fetches live GitHub profile stats from the /api/github/stats proxy route.
 * Returns { stats, loading } — stats is null while loading or on error.
 *
 * An AbortController is used so that if the component unmounts before the
 * response arrives, the in-flight request is cancelled and setState is never
 * called on the unmounted component.
 */
export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github/stats", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        // Only store stats when the backend returned valid data (no error key)
        if (!data.error) setStats(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // Silently ignore non-abort network / parse errors; stats stays null
        }
      })
      .finally(() => setLoading(false));

    // Cancel the fetch if the component unmounts before the response arrives
    return () => controller.abort();
  }, []);

  return { stats, loading };
}
