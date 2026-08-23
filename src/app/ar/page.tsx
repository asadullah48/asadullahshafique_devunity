import type { Metadata } from "next";

// Page-scoped so it cannot be inherited by a future /ar/* route. Must be the
// exact mirror of src/app/page.tsx: Google discards hreflang annotations that
// are not reciprocal, and the hrefs have to match sitemap.ts byte-for-byte.
export const metadata: Metadata = {
  alternates: {
    canonical: "/ar",
    languages: {
      en: "/",
      ar: "/ar",
      "x-default": "/",
    },
  },
};

// The Arabic homepage renders the exact same composition as "/" — no
// duplicated JSX. Locale is resolved from the URL by LocaleProvider (see
// src/context/LocaleContext.tsx), so all 17 translated components, including
// the Navbar up in the root layout, switch to Arabic without prop drilling.
//
// Only the default is re-exported, so page.tsx's own `metadata` (with the
// English canonical) does NOT leak here. Route-config exports added to
// page.tsx later — `dynamic`, `revalidate` — would likewise not propagate,
// so the two routes could silently diverge on those.
export { default } from "../page";
