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
 */
export function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/stats")
      .then((r) => r.json())
      .then((data) => {
        // Only store stats when the backend returned valid data (no error key)
        if (!data.error) setStats(data);
      })
      .catch(() => {
        // Silently ignore network / parse errors; stats stays null
      })
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
