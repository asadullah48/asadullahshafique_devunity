import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getAdjacent, getArticle, getRelated, listArticleMeta, listSlugs } from "@/lib/content";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/article-seo";

// Only slugs that actually exist in content/ar are prerendered. An English
// article with no Arabic translation yields no /ar/blog route at all, which is
// correct: a 404 is honest, whereas serving the English body under an Arabic
// URL is the duplicate-content bug the URL-only-locale refactor removed.
export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("ar").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("ar", slug);
  // Every human-facing string comes from the Arabic frontmatter, so the
  // metadata is localized by construction rather than by a parallel list.
  return article ? buildArticleMetadata(article) : {};
}

export default async function ArabicBlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("ar", slug);
  if (!article) notFound();

  // Related and newer/older come from the ARABIC archive only, so an Arabic
  // reader is never routed into English mid-session without being told.
  const all = listArticleMeta("ar");
  const { newer, older } = getAdjacent(slug, all);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildArticleJsonLd(article) }}
      />
      <ArticleView
        article={article}
        related={getRelated(article, all)}
        newer={newer}
        older={older}
      />
    </>
  );
}
