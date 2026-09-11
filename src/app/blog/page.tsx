import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleListItem } from "@/components/blog/ArticleListItem";
import { getArticle, getFeatured, listArticleMeta, type ArticleMeta } from "@/lib/content";
import { CATEGORIES, READING_PATHS, getCategory } from "@/lib/blog-taxonomy";
import { OG_IMAGE, articleHref } from "@/lib/article-seo";
import { BASE_URL, PERSON_ID } from "@/lib/seo";

/**
 * /blog — the knowledge hub. A static server page: every section below is
 * derived from content/en frontmatter at build time, and nothing on it ships
 * client JavaScript. Category "filters" are in-page anchors, not state, so the
 * page stays prerendered (a ?category= query would force dynamic rendering).
 *
 * English-only by design: content/ar holds a subset of the archive, and an
 * /ar/blog index listing three posts would be a thinner page, not a
 * translation. The Arabic homepage section links its own articles directly.
 */

const TITLE = "Knowledge Hub — Asadullah Shafique";
const DESCRIPTION =
  "Essays on agentic AI architecture, knowledge systems of record, reliability, decision-making and technical communication — each linked, where it exists, to the code that implements it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${BASE_URL}/blog`,
    siteName: "Asadullah Shafique Portfolio",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

function PathMeta({ article }: { article: ArticleMeta }) {
  const category = getCategory(article.category);
  return (
    <span className="text-xs text-muted-foreground">
      {category ? `${category.label} · ` : ""}
      {article.readTime}
    </span>
  );
}

export default function BlogIndexPage() {
  const all = listArticleMeta("en");
  const featuredMeta = getFeatured(all);
  const featured = featuredMeta ? getArticle("en", featuredMeta.slug) : null;
  const featuredCategory = featured ? getCategory(featured.category) : null;
  const bySlug = new Map(all.map((a) => [a.slug, a]));

  // Only categories that hold content are rendered — an empty heading is a
  // promise the site has not kept.
  const groups = CATEGORIES.map((category) => ({
    category,
    articles: all.filter((a) => a.category === category.id),
  })).filter((g) => g.articles.length > 0);
  const uncategorized = all.filter((a) => !a.category);

  const paths = READING_PATHS.map((p) => ({
    ...p,
    articles: p.slugs.map((s) => bySlug.get(s)).filter((a): a is ArticleMeta => a != null),
  })).filter((p) => p.articles.length >= 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/blog#blog`,
    name: "Knowledge Hub",
    description: DESCRIPTION,
    url: `${BASE_URL}/blog`,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    blogPost: all.map((a) => ({
      "@type": "BlogPosting",
      "@id": `${BASE_URL}/blog/${a.slug}#article`,
      headline: a.title,
      url: `${BASE_URL}/blog/${a.slug}`,
      datePublished: a.date,
    })),
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* pt-24/28 clears the fixed Navbar — see the same note in ArticleView. */}
      <div className="container mx-auto px-4 pb-24 pt-24 sm:px-6 lg:pt-28">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">
              Writing · Asadullah Shafique
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl">
              Knowledge Hub
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              How I think about agentic architecture, systems of record, reliability, decision-making
              and the human side of technical work. Where an idea is implemented in the system behind
              this site, the article links to the code — so it can be checked, not just read.
            </p>
            <p className="mt-4 text-sm tabular-nums text-muted-foreground">
              {all.length} articles · {groups.length} topics
            </p>
          </header>

          <nav aria-label="Topics" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {groups.map(({ category, articles }) => (
                <li key={category.id}>
                  <a
                    href={`#category-${category.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                  >
                    {category.label}
                    <span className="text-xs tabular-nums text-muted-foreground/70">{articles.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {featured && (
            <section aria-labelledby="featured-heading" className="mt-12">
              <h2 id="featured-heading" className="sr-only">
                Featured article
              </h2>
              <article className="overflow-hidden rounded-2xl border border-border bg-surface-1 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand-soft">
                      Featured
                    </span>
                    {featuredCategory && <span className="text-foreground/80">{featuredCategory.label}</span>}
                    <time dateTime={featured.date}>{featured.displayDate}</time>
                    <span aria-hidden>·</span>
                    <span>{featured.readTime}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    <Link href={articleHref("en", featured.slug)} className="transition-colors hover:text-brand">
                      {featured.title}
                    </Link>
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground sm:text-lg">
                    {featured.abstract || featured.excerpt}
                  </p>
                  {featured.tags.length > 0 && (
                    <ul aria-label="Tags" className="mt-5 flex flex-wrap gap-1.5">
                      {featured.tags.map((tag) => (
                        <li key={tag} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button asChild size="lg" className="mt-7">
                    <Link href={articleHref("en", featured.slug)}>
                      Read the article
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </div>

                {/* The article's real H2s, not marketing bullets: the reader
                    sees the argument's shape before committing to it. */}
                {featured.toc.length > 0 && (
                  <div className="border-t border-border bg-surface-2/40 p-6 sm:p-8 lg:border-s lg:border-t-0 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      What it covers
                    </p>
                    <ol className="mt-4 space-y-2.5 text-sm">
                      {featured.toc.slice(0, 8).map((entry, i) => (
                        <li key={entry.id} className="flex gap-3">
                          <span aria-hidden className="pt-0.5 font-mono text-xs tabular-nums text-brand-soft">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Link
                            href={`${articleHref("en", featured.slug)}#${entry.id}`}
                            className="text-foreground/85 transition-colors hover:text-brand"
                          >
                            {entry.text}
                          </Link>
                        </li>
                      ))}
                    </ol>
                    {featured.toc.length > 8 && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        + {featured.toc.length - 8} more sections
                      </p>
                    )}
                  </div>
                )}
              </article>
            </section>
          )}

          {paths.length > 0 && (
            <section aria-labelledby="paths-heading" className="mt-20">
              <h2 id="paths-heading" className="text-2xl font-bold text-foreground">
                Reading paths
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Articles that build on one another, in the order they are best read.
              </p>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {paths.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-surface-1 p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                    <ol className="mt-5 space-y-4">
                      {p.articles.map((a, i) => (
                        <li key={a.slug} className="flex gap-3">
                          <span
                            aria-hidden
                            className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-brand/40 font-mono text-[11px] text-brand-soft"
                          >
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={articleHref("en", a.slug)}
                              className="font-medium leading-snug text-foreground transition-colors hover:text-brand"
                            >
                              {a.title}
                            </Link>
                            <div>
                              <PathMeta article={a} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-20 space-y-16">
            {groups.map(({ category, articles }) => (
              <section
                key={category.id}
                id={`category-${category.id}`}
                aria-labelledby={`category-${category.id}-heading`}
                className="scroll-mt-24"
              >
                <div className="mb-6 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id={`category-${category.id}-heading`} className="text-2xl font-bold text-foreground">
                      {category.label}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {articles.length} {articles.length === 1 ? "article" : "articles"}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((a) => (
                    <ArticleListItem key={a.slug} article={a} showCategory={false} />
                  ))}
                </div>
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section aria-labelledby="more-heading">
                <h2 id="more-heading" className="mb-6 border-b border-border pb-4 text-2xl font-bold text-foreground">
                  More writing
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {uncategorized.map((a) => (
                    <ArticleListItem key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <section
            aria-labelledby="hub-cta-heading"
            className="mt-20 rounded-2xl border border-brand/20 bg-surface-1 p-6 sm:p-8"
          >
            <h2 id="hub-cta-heading" className="text-xl font-semibold text-foreground">
              From writing to working systems
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The articles argue for orchestration you can explain, guardrails that hold without a
              model, and evaluation that reads the trace. The portfolio shows where each of those is
              running, with a link to the source.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="soft">
                <Link href="/#evidence">See the engineering evidence</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/#contact">Discuss a project</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
