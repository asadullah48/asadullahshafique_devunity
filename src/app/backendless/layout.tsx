import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here is "use client", so route metadata can't live there directly
// -- a layout carries it instead (standard Next.js pattern). Not in
// sitemap.ts by design; noindex finishes that call so this legacy DevUnity
// page stops sharing the homepage's title/description as a duplicate in
// search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BackendlessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
