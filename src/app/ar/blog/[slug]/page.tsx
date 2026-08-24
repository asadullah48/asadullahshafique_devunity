import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getArticle, hasTranslation, listSlugs } from "@/lib/content";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

// Only slugs that actually exist in content/ar are prerendered. An English
// article with no Arabic translation yields no /ar/blog route at all, which is
// correct: a 404 is honest, whereas serving the English body under an Arabic
// URL is the duplicate-content bug the URL-only-locale refactor removed.
export function generateStaticParams() {
  return listSlugs("ar").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("ar", slug);
  if (!article) return {};

  const translated = hasTranslation("ar", slug);

  // Every human-facing string here comes from the Arabic frontmatter, so the
  // metadata is localized by construction rather than by a parallel list that
  // can drift out of sync with the article.
  return {
    metadataBase: new URL(BASE_URL),
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author }],
    // Page-scoped so /ar/layout.tsx's subtree metadata cannot leak a canonical
    // onto it, and reciprocal with the English route byte-for-byte.
    alternates: {
      canonical: `/ar/blog/${slug}`,
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
      url: `${BASE_URL}/ar/blog/${slug}`,
      locale: "ar_AR",
      ...(translated && { alternateLocale: ["en_US"] }),
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

export default async function ArabicBlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("ar", slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/ar/blog/${slug}#article`,
    headline: article.title,
    description: article.excerpt,
    inLanguage: "ar",
    datePublished: article.date,
    keywords: article.tags.join(", "),
    // Same Person @id as the English article. One human, one entity, two
    // languages — not two authors who happen to share a name.
    author: { "@id": PERSON_ID },
    mainEntityOfPage: `${BASE_URL}/ar/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView
        article={article}
        homeHref="/ar"
        labels={{ backToBlog: "العودة إلى المقالات", writtenBy: "بقلم" }}
      />
    </>
  );
}
