"use client";

import { useGitHubStats } from "@/hooks/useGitHubStats";
import { Star, Users, GitFork } from "lucide-react";
import { motion } from "framer-motion";

/**
 * GitHubStatsStrip
 *
 * A small animated strip showing live GitHub profile metrics
 * (public repos, total stars, followers) fetched from /api/github/stats.
 *
 * Renders a loading pulse while the request is in-flight and returns
 * null (no broken UI) if the backend is unreachable or returns an error.
 */
export function GitHubStatsStrip() {
  const { stats, loading } = useGitHubStats();

  // Loading state — subtle pulse so the layout doesn't jump
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-8 mt-12 text-zinc-600">
        <span className="text-xs animate-pulse">Loading GitHub stats…</span>
      </div>
    );
  }

  // Error / unavailable — render nothing to avoid a broken strip
  if (!stats) return null;

  const items = [
    { icon: GitFork, label: "Repos", value: stats.public_repos },
    { icon: Star, label: "Stars", value: stats.total_stars },
    { icon: Users, label: "Followers", value: stats.followers },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex items-center justify-center gap-8 mt-12"
    >
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-2 text-zinc-400">
          <Icon className="w-4 h-4 text-[#9CE630]" />
          <span className="text-sm font-medium text-white">{value}</span>
          <span className="text-xs text-zinc-500">{label}</span>
        </div>
      ))}
    </motion.div>
  );
}
