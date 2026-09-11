import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleListItem } from "@/components/blog/ArticleListItem";
import TocTracker from "@/components/blog/TocTracker";
import { formatDisplayDate, type Article, type ArticleMeta, type Locale, type TocEntry } from "@/lib/content";
import { getCategory } from "@/lib/blog-taxonomy";
import { articleHref } from "@/lib/article-seo";
import { sourceHref, sourceLabel } from "@/lib/evidence";

/**
 * Renders one article. SERVER COMPONENT ON PURPOSE — no "use client".
 *
 * The 17 components behind useLocale() are already forced client-side (see
 * CLAUDE.md), and article pages are the one part of this site that is pure
 * static prose. Keeping this on the server means the markdown, the parser and
 * the article body never touch the client bundle. The single client island is
 * TocTracker, which renders nothing and only toggles aria-current.
 *
 * That also means it cannot call useLocale(). Chrome strings are keyed off
 * the article's own `lang`, which is the correct source anyway: an Arabic
 * article carries Arabic metadata.
 *
 * Reading progress is NOT drawn here: <ScrollProgress /> in the root layout
 * already renders a CSS scroll-timeline bar on every route, with zero JS.
 */

const LABELS: Record<Locale, {
  home: string;
  hub: string;
  breadcrumb: string;
  onThisPage: string;
  inBrief: string;
  by: string;
  updated: string;
  tags: string;
  evidenceEyebrow: string;
  evidenceTitle: string;
  evidenceIntro: string;
  opensSource: string;
  aboutAuthor: string;
  authorRole: string;
  authorBio: string;
  ctaEvidence: string;
  ctaContact: string;
  moreArticles: string;
  newer: string;
  older: string;
  related: string;
}> = {
  en: {
    home: "Home",
    hub: "Knowledge Hub",
    breadcrumb: "Breadcrumb",
    onThisPage: "On this page",
    inBrief: "In brief",
    by: "By",
    updated: "Updated",
    tags: "Tags",
    evidenceEyebrow: "Idea → implementation",
    evidenceTitle: "Where this exists in code",
    evidenceIntro:
      "Some of the ideas above are implemented in the system behind this site. Each link opens the source, so the claim can be checked rather than taken on trust.",
    opensSource: "(opens the source on GitHub)",
    aboutAuthor: "About the author",
    authorRole: "Agentic AI Systems Engineer",
    authorBio:
      "I build multi-agent systems on the OpenAI Agents SDK with MCP tooling, constitutional guardrails and trace-level evaluation, and write here about the architecture and judgment behind them.",
    ctaEvidence: "See the engineering evidence",
    ctaContact: "Discuss a project",
    moreArticles: "More articles",
    newer: "Newer",
    older: "Older",
    related: "Related reading",
  },
  ar: {
    home: "الرئيسية",
    hub: "المقالات",
    breadcrumb: "مسار التنقل",
    onThisPage: "في هذه الصفحة",
    inBrief: "باختصار",
    by: "بقلم",
    updated: "حُدّث",
    tags: "الوسوم",
    evidenceEyebrow: "من الفكرة إلى التنفيذ",
    evidenceTitle: "أين يوجد هذا في الكود",
    evidenceIntro:
      "بعض الأفكار أعلاه منفّذة في النظام الذي يشغّل هذا الموقع. كل رابط يفتح المصدر، ليُتحقَّق من الادعاء بدلاً من قبوله على الثقة.",
    opensSource: "(يفتح المصدر على GitHub)",
    aboutAuthor: "عن الكاتب",
    authorRole: "مهندس أنظمة ذكاء اصطناعي وكيلة",
    authorBio:
      "أبني أنظمة متعددة الوكلاء على OpenAI Agents SDK مع أدوات MCP وحواجز حماية دستورية وتقييم على مستوى مسار التنفيذ، وأكتب هنا عن البنية والتقدير الهندسي وراءها.",
    ctaEvidence: "اطّلع على الأدلة الهندسية",
    ctaContact: "ناقش مشروعاً",
    moreArticles: "مقالات أخرى",
    newer: "الأحدث",
    older: "الأقدم",
    related: "قراءات ذات صلة",
  },
};

function TocList({ toc }: { toc: TocEntry[] }) {
  return (
    <ol className="space-y-0.5 border-s border-border text-sm">
      {toc.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            data-toc-link
            className="toc-link -ms-px block border-s-2 border-transparent py-1.5 ps-3 leading-snug text-muted-foreground transition-colors hover:text-foreground"
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

type Props = {
  article: Article;
  related: ArticleMeta[];
  newer: ArticleMeta | null;
  older: ArticleMeta | null;
};

export function ArticleView({ article, related, newer, older }: Props) {
  const locale = article.lang;
  const L = LABELS[locale];
  const isRTL = article.dir === "rtl";
  const homeHref = locale === "ar" ? "/ar" : "/";
  // Section anchors on the homepage. "/ar#x" and "/#x" — never "//#x".
  const homeAnchor = (id: string) => (locale === "ar" ? `/ar#${id}` : `/#${id}`);
  // The hub is English-only; an Arabic reader goes back to the Arabic list.
  const hubHref = locale === "ar" ? "/ar#blog" : "/blog";
  const category = getCategory(article.category);
  const categoryLabel = category ? (locale === "ar" ? category.ar : category.label) : null;
  // tailwindcss-rtl flips margins and padding, but it cannot flip the MEANING
  // of an arrow. "Newer" points back the way the reader reads from.
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;
  const showToc = article.toc.length > 2;

  return (
    <article dir={article.dir} lang={article.lang} className="bg-background">
      {/* Accent hairline in the article's own colour, matching its card. */}
      <div
        aria-hidden
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${article.accentColor}80, transparent)`,
        }}
      />

      {/* pt-24/28 clears the fixed Navbar (~4-4.5rem tall). At pt-10 the
          breadcrumb rendered underneath it at 390px — found by screenshot,
          not by the overflow probe, which cannot see overlap. */}
      <div className="container mx-auto px-4 pb-24 pt-24 sm:px-6 lg:pt-28">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
          <div className="mx-auto w-full min-w-0 max-w-[42rem] lg:mx-0">
            <nav aria-label={L.breadcrumb} className="mb-8 text-sm">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                <li>
                  <Link href={homeHref} className="transition-colors hover:text-brand">
                    {L.home}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={hubHref} className="transition-colors hover:text-brand">
                    {L.hub}
                  </Link>
                </li>
                {category && locale === "en" && (
                  <>
                    <li aria-hidden>/</li>
                    <li>
                      <Link
                        href={`/blog#category-${category.id}`}
                        className="transition-colors hover:text-brand"
                      >
                        {categoryLabel}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <header className="mb-10">
              {categoryLabel && (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-soft">
                  {categoryLabel}
                </p>
              )}

              <h1 className="text-3xl font-bold leading-[1.15] text-foreground sm:text-4xl lg:text-[2.75rem]">
                {article.title}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                <span>
                  {L.by} <span className="text-foreground">{article.author}</span>
                </span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                {/* dateTime stays ISO in both locales; only the visible text
                    is localized. That is why frontmatter carries two dates. */}
                <time dateTime={article.date}>{article.displayDate}</time>
                <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
                {article.updated && (
                  <>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>
                      {L.updated}{" "}
                      <time dateTime={article.updated}>{formatDisplayDate(article.updated)}</time>
                    </span>
                  </>
                )}
              </div>

              {article.tags.length > 0 && (
                <ul aria-label={L.tags} className="mt-4 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {tag}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </header>

            {article.abstract && (
              <div className="mb-10 rounded-xl border border-border bg-surface-1 p-5 sm:p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {L.inBrief}
                </p>
                <p className="leading-relaxed text-foreground/90">{article.abstract}</p>
              </div>
            )}

            {/* Mobile TOC: a native <details>, so it opens and closes with no
                JavaScript and is keyboard-operable by default. */}
            {showToc && (
              <details className="mb-10 rounded-xl border border-border bg-surface-1 lg:hidden">
                <summary className="cursor-pointer select-none px-5 py-3.5 text-sm font-medium text-foreground">
                  {L.onThisPage}{" "}
                  <span className="tabular-nums text-muted-foreground">· {article.toc.length}</span>
                </summary>
                <nav aria-label={L.onThisPage} className="border-t border-border px-5 py-4">
                  <TocList toc={article.toc} />
                </nav>
              </details>
            )}

            {/* The markdown is authored in this repo, not user-submitted, so
                there is no untrusted-HTML path here — it carries the same
                trust as the source code. `marked` escapes code content and the
                frontmatter never reaches the body. */}
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.html }} />

            {article.evidence.length > 0 && (
              <section
                aria-labelledby="evidence-heading"
                className="mt-16 rounded-2xl border border-border bg-surface-1 p-5 sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                  {L.evidenceEyebrow}
                </p>
                <h2 id="evidence-heading" className="mt-2 text-xl font-semibold text-foreground">
                  {L.evidenceTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L.evidenceIntro}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {article.evidence.map((ev) => {
                    const copy = locale === "ar" && ev.ar ? ev.ar : ev;
                    return (
                      <li key={ev.id} className="flex flex-col rounded-xl border border-border bg-background/60 p-4">
                        <p className="text-xs text-muted-foreground">{copy.label}</p>
                        {copy.value && (
                          <p className="mt-1 font-mono text-sm font-semibold text-foreground">{copy.value}</p>
                        )}
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.detail}</p>
                        <a
                          href={sourceHref(ev.source)}
                          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-brand-soft underline-offset-4 transition-colors hover:text-brand hover:underline"
                        >
                          <span dir="ltr" className="break-all">{sourceLabel(ev.source)}</span>
                          <ExternalLink aria-hidden className="h-3 w-3 shrink-0" />
                          <span className="sr-only">{L.opensSource}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section aria-labelledby="author-heading" className="mt-14 border-t border-border pt-10">
              <h2 id="author-heading" className="sr-only">
                {L.aboutAuthor}
              </h2>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/10 font-display text-sm font-semibold text-brand"
                >
                  AS
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{article.author}</p>
                  <p className="text-sm text-brand-soft">{L.authorRole}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L.authorBio}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild variant="soft" size="sm">
                      <Link href={homeAnchor("evidence")}>{L.ctaEvidence}</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={homeAnchor("contact")}>{L.ctaContact}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {(newer || older) && (
              <nav aria-label={L.moreArticles} className="mt-12 grid gap-3 sm:grid-cols-2">
                {newer ? (
                  <Link
                    href={articleHref(newer.lang, newer.slug)}
                    className="group rounded-xl border border-border p-4 transition-colors hover:border-brand/40"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BackArrow aria-hidden className="h-3.5 w-3.5" />
                      {L.newer}
                    </span>
                    <span className="mt-1 block font-medium leading-snug text-foreground transition-colors group-hover:text-brand">
                      {newer.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden className="hidden sm:block" />
                )}
                {older && (
                  <Link
                    href={articleHref(older.lang, older.slug)}
                    className="group rounded-xl border border-border p-4 transition-colors hover:border-brand/40 sm:text-end"
                  >
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:justify-end">
                      {L.older}
                      <ForwardArrow aria-hidden className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-1 block font-medium leading-snug text-foreground transition-colors group-hover:text-brand">
                      {older.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}

            {related.length > 0 && (
              <section aria-labelledby="related-heading" className="mt-14">
                <h2 id="related-heading" className="mb-5 text-xl font-semibold text-foreground">
                  {L.related}
                </h2>
                <div className="grid gap-4">
                  {related.map((a) => (
                    <ArticleListItem key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {showToc && (
            <nav aria-label={L.onThisPage} className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {L.onThisPage}
                </p>
                <TocList toc={article.toc} />
              </div>
            </nav>
          )}
        </div>
      </div>

      {showToc && <TocTracker />}
    </article>
  );
}

export default ArticleView;
