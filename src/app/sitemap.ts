import type { MetadataRoute } from "next";

const BASE_URL = "https://asadullahshafique-devunity.vercel.app";

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

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${BASE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
