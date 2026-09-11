"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { ArticleMeta } from "@/lib/content";

/**
 * The homepage slice of the blog.
 *
 * This component used to hold POSTS_EN / POSTS_AR — a hand-copied duplicate
 * of every article's frontmatter that had to be edited in step with the
 * markdown. It now receives the list from the server (src/app/page.tsx reads
 * content/ through src/lib/content.ts), so an article exists on the homepage
 * the moment its .md file does. Only frontmatter crosses into this client
 * component — never article HTML — so the payload stays a few kilobytes.
 */

export type PostSummary = Pick<
  ArticleMeta,
  "slug" | "title" | "excerpt" | "readTime" | "displayDate" | "tags" | "accentColor"
>;

/** Two clean rows of the md:grid-cols-3 layout. The rest live on /blog. */
const HOMEPAGE_LIMIT = 6;

function PostCard({
  post,
  readArticleLabel,
  basePath,
}: {
  post: PostSummary;
  readArticleLabel: string;
  /** "" for English, "/ar" for Arabic. The URL is the only source of locale
   *  (see LocaleContext), so an Arabic card must link to an Arabic URL —
   *  linking to /blog/... would drop the reader back into English. */
  basePath: string;
}) {
  return (
    <Reveal as="article"
      className="group relative bg-surface-2 border border-white/8 rounded-2xl overflow-hidden hover:border-brand/30 transition-all duration-300 flex flex-col"
    >
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${post.accentColor}80, transparent)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-muted-foreground">{post.displayDate}</span>
          <span className="w-1 h-1 rounded-full bg-muted" />
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <h3
          className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-brand transition-colors duration-200"
          style={{ viewTransitionName: `post-title-${post.slug}` }}
        >
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border"
              style={{
                backgroundColor: `${post.accentColor}12`,
                borderColor: `${post.accentColor}40`,
                color: post.accentColor,
              }}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Cyan, not the per-post accent: the accent is decoration (hairline,
            tags), and cyan is this site's only interactive colour. The
            aria-label carries the title so six "Read Article" links are not
            indistinguishable in a screen reader's link list. */}
        <Link
          href={`${basePath}/blog/${post.slug}`}
          aria-label={`${readArticleLabel}: ${post.title}`}
          className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-soft transition-colors duration-200 group/link w-fit"
        >
          {readArticleLabel}
          <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </Reveal>
  );
}

export function BlogSection({ posts }: { posts: { en: PostSummary[]; ar: PostSummary[] } }) {
  const { t, locale } = useLocale();
  const all = locale === "ar" ? posts.ar : posts.en;
  const shown = all.slice(0, HOMEPAGE_LIMIT);

  return (
    <section id="blog" className="py-24 bg-surface-1">
      <div className="container mx-auto px-6">

        <Reveal
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("blog.title")} <span className="text-brand">{t("blog.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("blog.subtitle")}
          </p>
          {/* Several excerpts carry figures from the article as published
              ("85% code reuse", "zero failures") that the homepage no longer
              states as its own. They are not rewritten — that would falsify
              the historical record — but they are framed as the article's
              claims, not as metrics this site verifies. */}
          <p className="mx-auto mt-3 max-w-xl text-pretty text-xs text-muted-foreground/70">
            {t("blog.historicalNote")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shown.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              readArticleLabel={t("blog.readArticle")}
              basePath={locale === "ar" ? "/ar" : ""}
            />
          ))}
        </div>

        {/* The hub is English-only (content/ar holds a subset of the
            archive), so the Arabic label says so rather than surprising the
            reader. The count is the real number of English articles. */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/40 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10"
          >
            {t("blog.viewAll")}
            <span className="text-muted-foreground tabular-nums">· {posts.en.length}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>

        <Reveal step={3}
          className="mt-12 p-8 bg-surface-2 border border-brand/20 rounded-2xl text-center"
        >
          <p className="text-muted-foreground mb-4">
            {t("blog.discordNote")}
          </p>
          <a
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            {t("blog.joinHub")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default BlogSection;
