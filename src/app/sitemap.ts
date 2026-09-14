import type { MetadataRoute } from "next";
import { hasTranslation, listArticleMeta } from "@/lib/content";
import { BASE_URL } from "@/lib/seo";
import { FLAGSHIP_SYSTEMS } from "@/lib/flagship-systems";

// English and Arabic cross-reference each other. Next renders this as
// <xhtml:link rel="alternate" hreflang="..."> inside each <url> entry, which
// is how a sitemap declares hreflang. It has to be reciprocal — a one-way
// alternate is discarded.
// These MUST be absolute. Next writes sitemap alternate hrefs verbatim and
// does not resolve them against metadataBase the way page metadata does, so a
// relative "/ar" here produces a silently broken sitemap. They also have to
// match the page-level hreflang hrefs byte-for-byte, trailing slash included,
// or the annotations fail validation.
const HOME_ALTERNATES = {
  languages: {
    en: BASE_URL,
    ar: `${BASE_URL}/ar`,
    "x-default": BASE_URL,
  },
};

/** Mirrors buildArticleMetadata()'s hreflang block, absolute-URL form. */
function articleAlternates(slug: string) {
  return {
    languages: {
      en: `${BASE_URL}/blog/${slug}`,
      ar: `${BASE_URL}/ar/blog/${slug}`,
      "x-default": `${BASE_URL}/blog/${slug}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Articles were missing from the sitemap entirely until the hub was built.
  // lastModified is the article's own date, not new Date(): a sitemap that
  // claims every page changed on every build teaches crawlers to ignore it.
  const en = listArticleMeta("en");
  const ar = listArticleMeta("ar");

  const systems: MetadataRoute.Sitemap = FLAGSHIP_SYSTEMS.map(({ slug }) => ({
    url: `${BASE_URL}/systems/${slug}`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const articles: MetadataRoute.Sitemap = [
    ...en.map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.updated || a.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      ...(hasTranslation("en", a.slug) && { alternates: articleAlternates(a.slug) }),
    })),
    ...ar.map((a) => ({
      url: `${BASE_URL}/ar/blog/${a.slug}`,
      lastModified: new Date(a.updated || a.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(hasTranslation("ar", a.slug) && { alternates: articleAlternates(a.slug) }),
    })),
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: HOME_ALTERNATES,
    },
    {
      url: `${BASE_URL}/ar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: HOME_ALTERNATES,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: en[0] ? new Date(en[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...systems,
    ...articles,
    {
      url: `${BASE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
