import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here (and in the nested [id] segment) is "use client", so route
// metadata can't live there directly -- a layout carries it instead
// (standard Next.js pattern). This layout cascades to /question/[id] too, so
// one file covers both. Not in sitemap.ts by design; noindex finishes that
// call so these legacy DevUnity pages stop sharing the homepage's
// title/description as a duplicate in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function QuestionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
