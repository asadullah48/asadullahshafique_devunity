import type { Metadata } from "next";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

// Arabic copy is taken from src/i18n/ar.json — the site's own translations —
// rather than machine-translated here, so the metadata speaks in the same
// voice as the page it describes. Swap in strategy copy by editing these
// three constants; nothing else in this file depends on their wording.
const AR_TITLE = "أسد الله شافق | مطور ذكاء اصطناعي وكيل";
const AR_DESCRIPTION =
  "مطور ذكاء اصطناعي وكيل، استراتيجي تسويق رقمي، ومؤسس صناعة CMT، أبني أنظمة مدعومة بالذكاء الاصطناعي وأسوّق لأعمال حقيقية عبر باكستان والإمارات.";
const AR_OG_DESCRIPTION =
  "أبني أنظمة ذكاء اصطناعي احترافية وأسوّق لأعمال حقيقية، من شركات البناء في دبي إلى مصانع النسيج الباكستانية. ستة هاكاثونات. صفر إخفاقات.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: AR_TITLE,
  description: AR_DESCRIPTION,
  keywords: [
    "أسد الله شافق",
    "ذكاء اصطناعي وكيل",
    "مطور ذكاء اصطناعي",
    "OpenAI Agents SDK",
    "خوادم MCP",
    "الذكاء الاصطناعي الدستوري",
    "تطوير ويب",
    "باكستان",
    "الإمارات",
  ],
  authors: [{ name: "أسد الله شافق" }],
  // `alternates` lives on ar/page.tsx, not here — see the note in
  // src/app/layout.tsx. A canonical declared at layout level is inherited by
  // every descendant route, so a future /ar/resume would silently canonicalise
  // itself to /ar. Title and OG stay here: those SHOULD apply to the subtree.
  robots: { index: true, follow: true },
  openGraph: {
    title: AR_TITLE,
    description: AR_OG_DESCRIPTION,
    type: "website",
    url: `${BASE_URL}/ar`,
    siteName: "أسد الله شافق",
    locale: "ar_AR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: AR_TITLE,
    description: AR_OG_DESCRIPTION,
  },
};

// A ProfilePage that POINTS AT the existing Person via @id instead of
// declaring a second Person node. One human described by two competing
// entities is a schema.org identity error, and it is the usual way a
// localized page damages the entity it was meant to reinforce.
const arabicProfileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${BASE_URL}/ar#profile`,
  url: `${BASE_URL}/ar`,
  inLanguage: "ar",
  name: AR_TITLE,
  description: AR_DESCRIPTION,
  // A reference WITH AN ALIAS, not a redefinition. Restating `name` and
  // `jobTitle` in Arabic on this @id would give one human two competing
  // labels once a consumer merges by @id — the exact "two entities that
  // disagree" problem the shared @id exists to prevent. The Arabic
  // human-readable label belongs on the ProfilePage `name` above, which
  // describes the PAGE.
  mainEntity: {
    "@id": PERSON_ID,
    "@type": "Person",
    alternateName: "أسد الله شافق",
  },
};

// Only the ROOT layout renders <html>, so this route cannot set
// <html lang="ar" dir="rtl"> declaratively. Two things compensate:
//
//   1. the wrapper <div lang dir> below, which IS server-rendered and is what
//      crawlers and assistive tech read for this subtree, and
//   2. this pre-paint script, which corrects documentElement before first
//      paint so there is no flash of LTR English.
//
// Raw SSR still carries <html lang="en">. Fixing that needs two root layouts
// behind route groups — deliberately out of scope. See CLAUDE.md.
const SET_DIR_BEFORE_PAINT = `document.documentElement.lang="ar";document.documentElement.dir="rtl";`;

export default function ArabicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SET_DIR_BEFORE_PAINT }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(arabicProfileJsonLd) }}
      />
      <div lang="ar" dir="rtl">
        {children}
      </div>
    </>
  );
}
