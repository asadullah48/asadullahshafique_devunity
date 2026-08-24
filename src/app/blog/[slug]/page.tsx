import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getArticle, hasTranslation, listSlugs } from "@/lib/content";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

// Prerendered at build time. The content is static markdown in the repo, so
// there is nothing to revalidate and no reason to pay for a runtime render.
export function generateStaticParams() {
  return listSlugs("en").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("en", slug);
  if (!article) return {};

  // hreflang is declared ONLY when the Arabic file actually exists. Advertising
  // an alternate that 404s is worse than declaring none — and since these are
  // written per-article rather than per-site, an untranslated post must not
  // inherit a blanket claim that it has an Arabic twin.
  const translated = hasTranslation("en", slug);

  return {
    metadataBase: new URL(BASE_URL),
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author }],
    // Page-scoped, never layout-scoped — a canonical on a layout is inherited
    // by every descendant. See the note in src/app/ar/page.tsx.
    alternates: {
      canonical: `/blog/${slug}`,
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
      description: article.excerpt,
      type: "article",
      url: `${BASE_URL}/blog/${slug}`,
      locale: "en_US",
      ...(translated && { alternateLocale: ["ar_AR"] }),
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("en", slug);
  if (!article) notFound();

  // BlogPosting pointing at the SHARED Person @id rather than declaring a
  // second author entity — same rule the Arabic profile page follows.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${slug}#article`,
    headline: article.title,
    description: article.excerpt,
    inLanguage: "en",
    datePublished: article.date,
    keywords: article.tags.join(", "),
    author: { "@id": PERSON_ID },
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView
        article={article}
        homeHref="/"
        labels={{ backToBlog: "Back to articles", writtenBy: "Written by" }}
      />
    </>
  );
}
