import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here is "use client", so route metadata can't live there directly
// -- a layout carries it instead (standard Next.js pattern). This is
// "Privacy Controls" (the NoTeachLLM AI-training opt-out feature), not a
// legal privacy policy -- one of the 13 legacy DevUnity routes. Not in
// sitemap.ts by design; noindex finishes that call so it stops sharing the
// homepage's title/description as a duplicate in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
