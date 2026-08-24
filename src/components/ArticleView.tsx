import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import type { Article } from "@/lib/content";

/**
 * Renders one article. SERVER COMPONENT ON PURPOSE — no "use client".
 *
 * The 17 components behind useLocale() are already forced client-side (see
 * CLAUDE.md), and article pages are the one part of this site that is pure
 * static prose. Keeping this on the server means the markdown, the parser and
 * the article body never touch the client bundle.
 *
 * That also means it cannot call useLocale(). Every string it needs is passed
 * in or read off the article's own frontmatter, which is the correct source
 * anyway: an Arabic article carries Arabic metadata.
 */

type Props = {
  article: Article;
  /** Where "back" goes: "/" for English, "/ar" for Arabic. */
  homeHref: string;
  labels: {
    backToBlog: string;
    writtenBy: string;
  };
};

export function ArticleView({ article, homeHref, labels }: Props) {
  const isRTL = article.dir === "rtl";
  // The arrow must point back the way the reader came, which is the opposite
  // direction in Arabic. tailwindcss-rtl flips margins and padding for us but
  // it cannot flip the meaning of an icon.
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <article dir={article.dir} lang={article.lang} className="min-h-screen bg-background">
      {/* Accent hairline in the article's own colour, matching its card on the
          home page so the two read as the same object. */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${article.accentColor}80, transparent)`,
        }}
      />

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link
          href={`${homeHref}#blog`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors duration-200 mb-10"
        >
          <BackArrow className="w-4 h-4" />
          {labels.backToBlog}
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {/* dateTime stays ISO in both locales; only the visible text is
                localized. That is why frontmatter carries two date fields. */}
            <time dateTime={article.date} className="text-xs text-muted-foreground">
              {article.displayDate}
            </time>
            <span className="w-1 h-1 rounded-full bg-muted" />
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-5">
            {article.title}
          </h1>

          <p className="text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border"
                style={{
                  backgroundColor: `${article.accentColor}12`,
                  borderColor: `${article.accentColor}40`,
                  color: article.accentColor,
                }}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground border-t border-border pt-5">
            {labels.writtenBy} <span className="text-foreground">{article.author}</span>
          </p>
        </header>

        {/* The markdown is authored in this repo, not user-submitted, so there
            is no untrusted-HTML path here. `marked` escapes code content and
            the frontmatter never reaches the body. */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </div>
    </article>
  );
}

export default ArticleView;
