/**
 * Metadata and JSON-LD for article routes — ONE builder for both locales.
 *
 * The English and Arabic [slug] routes used to each carry a ~50-line copy of
 * this. The two had to stay byte-for-byte reciprocal on hreflang (Google
 * discards a one-way alternate), which is exactly the kind of invariant two
 * copies eventually break. Server only: it reaches the filesystem through
 * hasTranslation().
 */

import type { Metadata } from "next";
import { hasTranslation, type ArticleMeta, type Locale } from "@/lib/content";
import { getCategory } from "@/lib/blog-taxonomy";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

export function articleHref(locale: Locale, slug: string): string {
  return `${locale === "ar" ? "/ar" : ""}/blog/${slug}`;
}

export function buildArticleMetadata(article: ArticleMeta): Metadata {
  const { slug, lang } = article;
  const path = articleHref(lang, slug);
  // hreflang is declared ONLY when the other-language file actually exists.
  // Advertising an alternate that 404s is worse than declaring none.
  const translated = hasTranslation(lang, slug);
  const category = getCategory(article.category);

  return {
    metadataBase: new URL(BASE_URL),
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author, url: BASE_URL }],
    // Page-scoped, never layout-scoped — a canonical on a layout is inherited
    // by every descendant. See the note in src/app/ar/page.tsx.
    alternates: {
      canonical: path,
      ...(translated && {
        languages: {
          en: `/blog/${slug}`,
          ar: `/ar/blog/${slug}`,
          "x-default": `/blog/${slug}`,
        },
      }),
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `${BASE_URL}${path}`,
      siteName: "Asadullah Shafique Portfolio",
      locale: lang === "ar" ? "ar_AR" : "en_US",
      ...(translated && { alternateLocale: [lang === "ar" ? "en_US" : "ar_AR"] }),
      publishedTime: article.date,
      ...(article.updated && { modifiedTime: article.updated }),
      ...(category && { section: category.label }),
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

/**
 * BlogPosting + BreadcrumbList as one @graph. The author and publisher point
 * at the SHARED Person @id rather than declaring a second entity — one human,
 * one node, whichever language the article is in.
 */
export function buildArticleJsonLd(article: ArticleMeta): string {
  const url = `${BASE_URL}${articleHref(article.lang, article.slug)}`;
  const category = getCategory(article.category);
  const isAr = article.lang === "ar";

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        inLanguage: article.lang,
        datePublished: article.date,
        dateModified: article.updated || article.date,
        wordCount: article.wordCount,
        ...(category && { articleSection: category.label }),
        keywords: article.tags.join(", "),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        image: `${BASE_URL}/opengraph-image`,
        url,
        mainEntityOfPage: url,
        ...(!isAr && { isPartOf: { "@id": `${BASE_URL}/blog#blog` } }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: isAr
          ? [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${BASE_URL}/ar` },
              { "@type": "ListItem", position: 2, name: article.title, item: url },
            ]
          : [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Knowledge Hub", item: `${BASE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: article.title, item: url },
            ],
      },
    ],
  };

  // `<` escaped so no string in the data can close the <script> element.
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
