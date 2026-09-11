import Link from "next/link";
import type { ArticleMeta } from "@/lib/content";
import { getCategory } from "@/lib/blog-taxonomy";
import { articleHref } from "@/lib/article-seo";

/**
 * One article in a list — the hub's category grids and an article's
 * "Related reading". SERVER COMPONENT: no hooks, no client JavaScript.
 *
 * The whole card is clickable through a single stretched link on the title
 * (`after:absolute after:inset-0`) rather than a wrapping <a>: a block-level
 * link would make a screen reader announce the excerpt and every tag as link
 * text.
 *
 * The per-article accent is a 6px dot and nothing more. Text stays on theme
 * tokens so contrast holds in light mode, where several accents fail AA.
 */
export function ArticleListItem({
  article,
  headingLevel = "h3",
  showCategory = true,
}: {
  article: ArticleMeta;
  headingLevel?: "h2" | "h3";
  showCategory?: boolean;
}) {
  const Heading = headingLevel;
  const category = getCategory(article.category);
  const isAr = article.lang === "ar";

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-surface-1 p-5 transition-colors duration-200 hover:border-brand/40 focus-within:border-brand/60">
      <div className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
        {showCategory && category && (
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: article.accentColor }}
            />
            {isAr ? category.ar : category.label}
          </span>
        )}
        <time dateTime={article.date}>{article.displayDate}</time>
        <span aria-hidden>·</span>
        <span>{article.readTime}</span>
      </div>

      <Heading className="font-display text-lg font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-brand">
        <Link
          href={articleHref(article.lang, article.slug)}
          className="after:absolute after:inset-0 after:rounded-xl after:content-['']"
        >
          {article.title}
        </Link>
      </Heading>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>

      {article.tags.length > 0 && (
        <ul aria-label={isAr ? "الوسوم" : "Tags"} className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {article.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default ArticleListItem;
