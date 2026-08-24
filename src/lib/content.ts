/**
 * Article loading for the blog routes.
 *
 * SERVER ONLY. `gray-matter` and `marked` are imported here and nowhere a
 * client component can reach them, so they never enter the client bundle —
 * which is the whole reason adding two dependencies was acceptable at all
 * given the 211 kB -> 171 kB fight recorded in CLAUDE.md.
 *
 * Locale comes from the directory, mirroring LocaleContext's rule that the URL
 * is the only source of locale:
 *
 *   /blog/<slug>      -> content/en/<slug>.md
 *   /ar/blog/<slug>   -> content/ar/<slug>.md
 *
 * The two files share a slug on purpose. That is what makes them each other's
 * hreflang alternate rather than two unrelated posts.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

export type Locale = "en" | "ar";

export type ArticleMeta = {
  slug: string;
  lang: Locale;
  dir: "ltr" | "rtl";
  title: string;
  excerpt: string;
  author: string;
  /** ISO 8601 (YYYY-MM-DD). Never localized — this is what sorts and what
   *  goes in <time datetime>. `displayDate` is the human-facing one. */
  date: string;
  displayDate: string;
  readTime: string;
  tags: string[];
  accentColor: string;
};

export type Article = ArticleMeta & { html: string };

const CONTENT_ROOT = path.join(process.cwd(), "content");

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A fresh Marked instance rather than the global singleton: the global one
 * carries whatever options anything else in the process last set, which is a
 * cross-talk bug waiting to happen once a second caller appears.
 */
function renderMarkdown(source: string, dir: "ltr" | "rtl"): string {
  const md = new Marked({ gfm: true, breaks: false });

  md.use({
    renderer: {
      /**
       * Code is ALWAYS ltr, even inside an rtl article.
       *
       * This is the single most important RTL detail on the page. The Unicode
       * bidirectional algorithm reorders by character class, so in an rtl
       * container a line like `except Exception:` gets its trailing colon
       * flung to the left edge and an indented block loses its shape
       * entirely. Snippets stop being copy-pasteable and start being wrong.
       */
      code({ text, lang }: { text: string; lang?: string }) {
        const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        return `<pre dir="ltr" class="article-code"><code${cls}>${escapeHtml(text)}</code></pre>`;
      },

      /**
       * Inline code likewise. `dir="ltr"` plus `unicode-bidi: isolate` in the
       * page styles keeps a token like `stateless_http=True` from splitting
       * around its `=` when it sits mid-sentence in Arabic prose.
       */
      codespan({ text }: { text: string }) {
        return `<code dir="ltr" class="article-codespan">${escapeHtml(text)}</code>`;
      },
    },
  });

  const html = md.parse(source) as string;

  /**
   * Tables inherit the article direction (in Arabic the first column belongs
   * on the right) and get a scroll container, so a wide table never forces the
   * page body to scroll sideways. Done as a post-pass because overriding the
   * table renderer means reimplementing cell/alignment parsing by hand.
   */
  return html.replace(
    /<table>/g,
    `<div class="article-table-wrap" dir="${dir}"><table>`
  ).replace(/<\/table>/g, "</table></div>");
}

function articlePath(locale: Locale, slug: string): string {
  return path.join(CONTENT_ROOT, locale, `${slug}.md`);
}

/** Slugs that exist for a locale. Drives generateStaticParams. */
export function listSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_ROOT, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * YAML parses an unquoted `2025-04-01` into a Date, so this handles both that
 * and a quoted string. toISOString() would shift the day backwards for anyone
 * east of UTC (which is where these are authored), so the parts are read in
 * UTC explicitly.
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value ?? "");
}

/**
 * Returns null when the article does not exist so the route can call
 * notFound(). A missing translation is a 404, never a silent fall back to the
 * English text under an Arabic URL — that is the same class of bug the
 * URL-only-locale refactor fixed in LocaleContext.
 */
export function getArticle(locale: Locale, slug: string): Article | null {
  const file = articlePath(locale, slug);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const dir: "ltr" | "rtl" = data.dir === "rtl" ? "rtl" : "ltr";

  return {
    slug: typeof data.slug === "string" ? data.slug : slug,
    lang: locale,
    dir,
    title: String(data.title ?? ""),
    excerpt: String(data.excerpt ?? ""),
    author: String(data.author ?? "Asadullah Shafique"),
    date: normalizeDate(data.date),
    displayDate: String(data.displayDate ?? ""),
    readTime: String(data.readTime ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    accentColor: String(data.accentColor ?? "#00F2FF"),
    html: renderMarkdown(content, dir),
  };
}

/** All articles for a locale, newest first. */
export function listArticles(locale: Locale): Article[] {
  return listSlugs(locale)
    .map((slug) => getArticle(locale, slug))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * True when the same slug exists in the other locale — gates the hreflang
 * alternate so we never advertise a translation that 404s.
 */
export function hasTranslation(locale: Locale, slug: string): boolean {
  return fs.existsSync(articlePath(locale === "en" ? "ar" : "en", slug));
}
