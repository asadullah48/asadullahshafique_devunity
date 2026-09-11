import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { getAdjacent, getArticle, getRelated, listArticleMeta, listSlugs } from "@/lib/content";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/article-seo";

// Prerendered at build time. The content is static markdown in the repo, so
// there is nothing to revalidate and no reason to pay for a runtime render.
// dynamicParams=false: a slug with no file is a 404 at the edge, not a
// serverless invocation that reads the filesystem to discover the same thing.
export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("en").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("en", slug);
  return article ? buildArticleMetadata(article) : {};
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("en", slug);
  if (!article) notFound();

  const all = listArticleMeta("en");
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
