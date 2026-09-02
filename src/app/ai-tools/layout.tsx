import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here is "use client", so route metadata can't live there directly
// -- a layout carries it instead (standard Next.js pattern). Unlike the
// other legacy routes, /ai-tools is in sitemap.ts (priority 0.6) -- it's a
// live demo of the backend agents, not scaffolding -- so it gets unique,
// indexable metadata instead of noindex. Copy states only what CLAUDE.md
// verifies: real calls to the Agents SDK specialists (Rule 1) with graceful
// degradation, no invented numbers.
export const metadata: Metadata = {
  title: "AI Tools | Asadullah Shafique",
  description:
    "Live tools backed by real specialist agents on the OpenAI Agents SDK -- Error Solver, Learning, and Teaching -- each degrading gracefully so a missing API key never breaks the demo.",
};

export default function AIToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
