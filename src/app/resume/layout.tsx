import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here is "use client", so route metadata can't live there directly
// -- a layout carries it instead (standard Next.js pattern). Unlike the
// other legacy routes, /resume is in sitemap.ts (priority 0.8) -- it's the
// real CV, not scaffolding -- so it gets unique, indexable metadata instead
// of noindex. Copy is taken verbatim from the page's own positioning line
// (resume/page.tsx:386-390), not invented.
export const metadata: Metadata = {
  title: "Resume | Asadullah Shafique",
  description:
    "Asadullah Shafique — Agentic AI Engineer, Multi-Agent Systems Architect, Enterprise AI Strategist. Bridging AI potential with financial services reality through orchestration, compliance, and scalable adoption.",
};

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
