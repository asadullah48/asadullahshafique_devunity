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
 *
 * THE MARKDOWN FILE IS THE SINGLE SOURCE OF TRUTH for an article. The hub
 * (/blog), the homepage section, the sitemap and the article route all read
 * frontmatter through this module. Adding an article means adding one file —
 * never a second literal somewhere else that can drift from it.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { ENGINEERING_EVIDENCE, PROOF, type Evidence } from "@/lib/evidence";
import { isCategoryId, type CategoryId } from "@/lib/blog-taxonomy";

export type Locale = "en" | "ar";

export type TocEntry = { id: string; text: string };

export type ArticleMeta = {
  slug: string;
  lang: Locale;
  dir: "ltr" | "rtl";
  title: string;
  /** Card and share text. */
  excerpt: string;
  /** <meta name="description">. Falls back to `excerpt`. */
  description: string;
  /** Two-to-four sentence summary shown above the body. Optional. */
  abstract: string;
  author: string;
  /** ISO 8601 (YYYY-MM-DD). Never localized — this is what sorts and what
   *  goes in <time datetime>. `displayDate` is the human-facing one. */
  date: string;
  /** ISO date of the last substantive revision, or "" if never revised. */
  updated: string;
  displayDate: string;
  readTime: string;
  wordCount: number;
  tags: string[];
  accentColor: string;
  category: CategoryId | null;
  featured: boolean;
  /** Explicit related slugs, in editorial order. */
  related: string[];
  /** Where the ideas in the article exist as code. Resolved, never free text. */
  evidence: Evidence[];
};

export type Article = ArticleMeta & { html: string; toc: TocEntry[] };

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** ~230 words a minute is the usual figure for technical prose. */
const WORDS_PER_MINUTE = 230;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Heading anchor. `\p{L}\p{N}` rather than `[a-z0-9]` so an Arabic heading
 * gets an Arabic anchor instead of collapsing to an empty string.
 */
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/**
 * Callouts use the GitHub alert syntax, so the markdown still reads correctly
 * in the repo and survives a paste into other editors:
 *
 *   > [!IMPLICATION]
 *   > The permission check lives outside the model.
 *
 * The kinds are deliberately few. A callout that can be anything stops meaning
 * anything; each of these marks a different kind of claim.
 */
const CALLOUT_LABELS: Record<string, string> = {
  NOTE: "Note",
  IMPLICATION: "Engineering implication",
  FAILURE: "Failure mode",
  EVIDENCE: "In this codebase",
  ILLUSTRATIVE: "Illustrative example",
};

/**
 * A fresh Marked instance per render rather than the global singleton: the
 * global one carries whatever options anything else in the process last set,
 * and the heading renderer below closes over per-article state (the TOC and
 * the anchor de-duplication set).
 */
function renderMarkdown(
  source: string,
  dir: "ltr" | "rtl"
): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();
  const md = new Marked({ gfm: true, breaks: false });

  md.use({
    renderer: {
      /**
       * The page owns the one H1 (the article title). A stray `#` in the
       * markdown is demoted to H2 rather than trusted, so no article can ever
       * ship two H1s. H2s feed the table of contents.
       */
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const level = Math.max(2, depth);
        const plain = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();

        let id = slugify(plain);
        for (let n = 2; usedIds.has(id); n++) id = `${slugify(plain)}-${n}`;
        usedIds.add(id);

        if (level === 2) toc.push({ id, text: plain });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },

      /**
       * Code is ALWAYS ltr, even inside an rtl article.
       *
       * This is the single most important RTL detail on the page. The Unicode
       * bidirectional algorithm reorders by character class, so in an rtl
       * container a line like `except Exception:` gets its trailing colon
       * flung to the left edge and an indented block loses its shape
       * entirely. Snippets stop being copy-pasteable and start being wrong.
       *
       * A ```flow fence is not code: it is a sequence, one step per line,
       * rendered as an ordered list so it reflows at 320px instead of forcing
       * a horizontal scrollbar the way ASCII-art arrows do. Arrow-only lines
       * are skipped (the connectors are drawn in CSS). A final line starting
       * with "↺" is rendered as the loop-back note.
       */
      code({ text, lang }: Tokens.Code) {
        if (lang === "flow") {
          const items = text
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l && !/^[↓→|│]+$/.test(l))
            .map((l) =>
              l.startsWith("↺")
                ? `<li class="article-flow-loop">${escapeHtml(l.slice(1).trim())}</li>`
                : `<li>${escapeHtml(l)}</li>`
            )
            .join("");
          return `<ol class="article-flow">${items}</ol>\n`;
        }
        const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        return `<pre dir="ltr" class="article-code" tabindex="0"><code${cls}>${escapeHtml(text)}</code></pre>\n`;
      },

      /**
       * Inline code likewise. `dir="ltr"` plus `unicode-bidi: isolate` in the
       * page styles keeps a token like `stateless_http=True` from splitting
       * around its `=` when it sits mid-sentence in Arabic prose. `text` is
       * already escaped by the lexer here.
       */
      codespan({ text }: Tokens.Codespan) {
        return `<code dir="ltr" class="article-codespan">${text}</code>`;
      },

      /**
       * `role="note"` rather than <aside>: every <aside> is a landmark, and an
       * article with eight callouts would hand a screen-reader user eight
       * extra landmarks to wade through.
       */
      blockquote({ tokens }: Tokens.Blockquote) {
        const body = this.parser.parse(tokens);
        const m = body.match(/^<p>\[!([A-Z]+)\][ \t]*\n?/);
        if (!m || !CALLOUT_LABELS[m[1]]) {
          return `<blockquote>\n${body}</blockquote>\n`;
        }
        const label = CALLOUT_LABELS[m[1]];
        let rest = body.slice(m[0].length);
        rest = rest.startsWith("</p>") ? rest.slice(4) : `<p>${rest}`;
        return `<div class="article-callout" role="note" data-kind="${m[1].toLowerCase()}"><p class="article-callout-label">${label}</p>${rest}</div>\n`;
      },
    },
  });

  const html = md.parse(source) as string;

  /**
   * Tables inherit the article direction (in Arabic the first column belongs
   * on the right) and get a scroll container, so a wide table never forces the
   * page body to scroll sideways. Done as a post-pass because overriding the
   * table renderer means reimplementing cell/alignment parsing by hand.
   * `tabindex="0"` makes the scroll region reachable by keyboard.
   */
  return {
    html: html
      .replace(
        /<table>/g,
        `<div class="article-table-wrap" dir="${dir}" tabindex="0" role="region" aria-label="Table"><table>`
      )
      .replace(/<\/table>/g, "</table></div>"),
    toc,
  };
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
  return value == null ? "" : String(value);
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

const EVIDENCE_BY_ID = new Map<string, Evidence>(
  [...PROOF, ...ENGINEERING_EVIDENCE].map((e) => [e.id, e])
);

/**
 * `evidence:` frontmatter entries are either an id from src/lib/evidence.ts
 * (the verified registry the homepage uses) or an inline object pointing at a
 * path in THIS repository:
 *
 *   evidence:
 *     - observability
 *     - label: Single source of truth
 *       value: portfolio.json
 *       detail: One file, three renderers.
 *       path: backend/knowledge/portfolio.json
 *
 * Both are checked AT BUILD TIME: an unknown id or a local path that does not
 * exist throws, so an article cannot cite code the repository does not
 * contain. That is CLAUDE.md's Reality Rule, enforced by the compiler of
 * last resort — `next build`.
 */
function resolveEvidence(raw: unknown, file: string): Evidence[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry, i) => {
    let ev: Evidence;
    if (typeof entry === "string") {
      const found = EVIDENCE_BY_ID.get(entry);
      if (!found) throw new Error(`${file}: unknown evidence id "${entry}"`);
      ev = found;
    } else if (entry && typeof entry === "object" && "path" in entry) {
      const e = entry as Record<string, unknown>;
      ev = {
        id: `local-${i}`,
        label: String(e.label ?? ""),
        value: String(e.value ?? ""),
        detail: String(e.detail ?? ""),
        source: { kind: "local", path: String(e.path) },
      };
    } else {
      throw new Error(`${file}: malformed evidence entry at index ${i}`);
    }
    if (ev.source.kind === "local" && !fs.existsSync(path.join(process.cwd(), ev.source.path))) {
      throw new Error(`${file}: evidence path does not exist: ${ev.source.path}`);
    }
    return ev;
  });
}

function readArticle(locale: Locale, slug: string): { meta: ArticleMeta; body: string } | null {
  const file = articlePath(locale, slug);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const rel = `content/${locale}/${slug}.md`;

  if (data.category !== undefined && !isCategoryId(data.category)) {
    throw new Error(`${rel}: unknown category "${String(data.category)}"`);
  }

  const date = normalizeDate(data.date);
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const excerpt = String(data.excerpt ?? "");

  return {
    body: content,
    meta: {
      slug: typeof data.slug === "string" ? data.slug : slug,
      lang: locale,
      dir: data.dir === "rtl" ? "rtl" : "ltr",
      title: String(data.title ?? ""),
      excerpt,
      description: String(data.description ?? excerpt),
      abstract: String(data.abstract ?? ""),
      author: String(data.author ?? "Asadullah Shafique"),
      date,
      updated: normalizeDate(data.updated),
      displayDate: String(data.displayDate ?? formatDisplayDate(date)),
      // An explicit readTime wins (the Arabic files carry localized strings);
      // otherwise it is COMPUTED, so it cannot drift from the text.
      readTime: data.readTime
        ? String(data.readTime)
        : `${Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))} min read`,
      wordCount,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      accentColor: String(data.accentColor ?? "#2FD2DA"),
      category: isCategoryId(data.category) ? data.category : null,
      featured: data.featured === true,
      related: Array.isArray(data.related) ? data.related.map(String) : [],
      evidence: resolveEvidence(data.evidence, rel),
    },
  };
}

/**
 * Returns null when the article does not exist so the route can call
 * notFound(). A missing translation is a 404, never a silent fall back to the
 * English text under an Arabic URL — that is the same class of bug the
 * URL-only-locale refactor fixed in LocaleContext.
 */
export function getArticle(locale: Locale, slug: string): Article | null {
  const read = readArticle(locale, slug);
  if (!read) return null;
  return { ...read.meta, ...renderMarkdown(read.body, read.meta.dir) };
}

function byNewest(a: ArticleMeta, b: ArticleMeta): number {
  return (
    b.date.localeCompare(a.date) ||
    Number(b.featured) - Number(a.featured) ||
    a.title.localeCompare(b.title)
  );
}

/**
 * Frontmatter only — no markdown rendering. This is what every listing uses
 * (hub, homepage, sitemap), and it is what may cross into a client component:
 * it carries no article HTML, so the homepage payload stays small.
 */
export function listArticleMeta(locale: Locale): ArticleMeta[] {
  return listSlugs(locale)
    .map((slug) => readArticle(locale, slug)?.meta)
    .filter((m): m is ArticleMeta => m != null)
    .sort(byNewest);
}

/** The featured article: the newest one flagged `featured`, else the newest. */
export function getFeatured(all: ArticleMeta[]): ArticleMeta | null {
  return all.find((a) => a.featured) ?? all[0] ?? null;
}

/**
 * Related reading. Explicit `related:` slugs first, in the author's order —
 * an editorial link beats any heuristic. Remaining slots are filled by shared
 * category, then tag overlap, then recency. An article with nothing in common
 * gets no inferred neighbours rather than three random ones.
 */
export function getRelated(article: ArticleMeta, all: ArticleMeta[], limit = 3): ArticleMeta[] {
  const others = all.filter((a) => a.slug !== article.slug);
  const explicit = article.related
    .map((slug) => others.find((a) => a.slug === slug))
    .filter((a): a is ArticleMeta => a != null);

  const tags = new Set(article.tags.map((t) => t.toLowerCase()));
  const score = (a: ArticleMeta) =>
    (a.category && a.category === article.category ? 10 : 0) +
    a.tags.filter((t) => tags.has(t.toLowerCase())).length;

  const inferred = others
    .filter((a) => !explicit.includes(a) && score(a) > 0)
    .sort((a, b) => score(b) - score(a) || byNewest(a, b));

  return [...explicit, ...inferred].slice(0, limit);
}

/** Chronological neighbours for newer/older navigation. */
export function getAdjacent(
  slug: string,
  all: ArticleMeta[]
): { newer: ArticleMeta | null; older: ArticleMeta | null } {
  const i = all.findIndex((a) => a.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return { newer: all[i - 1] ?? null, older: all[i + 1] ?? null };
}

/**
 * True when the same slug exists in the other locale — gates the hreflang
 * alternate so we never advertise a translation that 404s.
 */
export function hasTranslation(locale: Locale, slug: string): boolean {
  return fs.existsSync(articlePath(locale === "en" ? "ar" : "en", slug));
}
