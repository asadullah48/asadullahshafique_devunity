"use client";

import { Reveal } from "@/components/Reveal";
import { ArrowRight, Github } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

/* --------------------------------------------------------------------
 * The Autonomous Agent Ecosystem
 *
 * This replaced a 21-row matrix (see git history at b46d0a6 for the full
 * table, its per-platform specialties, ports and Arabic translations).
 * The table was accurate and exhaustive and nobody read it: twenty-one
 * rows of near-identical shape is a wall, and a wall at the top of a
 * section costs you the reader before the project grid below it can argue
 * anything in depth.
 *
 * What survives is the claim itself — twenty-one platforms — stated once
 * at poster weight, with four named openers as proof of shape and a link
 * to the rest. Coverage is now demonstrated by the GitHub link rather than
 * by transcribing the index into the page.
 *
 * Every name below must resolve to a real public repository. A card whose
 * repo 404s is a claim the tree cannot answer for, which CLAUDE.md forbids
 * outright. The four here were verified against the GitHub API 2026-08-27.
 *
 * There are deliberately no "Live Dashboard" links. Each platform serves
 * its dashboard from 127.0.0.1, so a link would resolve to the VISITOR own
 * machine and fail for every reader.
 * ------------------------------------------------------------------ */

const GITHUB_OWNER = "asadullah48";
const TOTAL_PLATFORMS = 21;

type Featured = {
  /** Repo slug. Doubles as the React key and the specialty lookup key. */
  id: string;
  /** Latin proper noun. Never translated, always dir="ltr". */
  name: string;
};

/* Four openers, not a ranking — chosen because their specialties are the
   four most legible at a glance (modernization, security, supply chain,
   orchestration). Adding a fifth starts rebuilding the wall. */
const FEATURED: Featured[] = [
  { id: "legacyx",      name: "LegacyX" },
  { id: "securebridge", name: "SecureBridge" },
  { id: "stockai",      name: "StockAI" },
  { id: "graphai",      name: "GraphAI" },
];

/* Only the prose is localized. Keeping name/slug out of the locale maps
   means a swapped platform is ONE row plus two strings, and the two
   locales cannot drift on the facts — only on the wording. */
const SPECIALTY_EN: Record<string, string> = {
  legacyx:      "Legacy COBOL modernization",
  securebridge: "Zero-trust agent security",
  stockai:      "Supply chain automation",
  graphai:      "Workflow orchestration",
};

const SPECIALTY_AR: Record<string, string> = {
  legacyx:      "تحديث أنظمة COBOL القديمة",
  securebridge: "أمن الوكلاء بلا ثقة ضمنية",
  stockai:      "أتمتة سلاسل التوريد",
  graphai:      "تنسيق سير العمل",
};

const COPY = {
  en: {
    eyebrow: "// agent ecosystem",
    headline: "Production-grade autonomous AI platforms",
    subtitle:
      "Twenty-one production multi-agent platforms, each with its own FastAPI gateway, test suite and public repository.",
    /* No count in the string — the gutter already carries "+17", and in RTL
       a second one renders mirrored as "17+" beside it. */
    more: "further platforms, all open source and live",
    cta: `View all ${TOTAL_PLATFORMS} repositories`,
    stats: [
      { value: "263/263", label: "Tests passing" },
      { value: "100%", label: "Open source" },
      { value: "EN / AR", label: "RTL localization" },
    ],
    footnote:
      "263 automated tests green is the aggregate across the 21 public repositories, not a single suite in this one. Each platform serves its dashboard from localhost, so no dashboard is linked — clone the repo and it comes up there.",
  },
  ar: {
    eyebrow: "// منظومة الوكلاء",
    headline: "منصات ذكاء اصطناعي مستقلة بجودة إنتاجية",
    subtitle:
      "إحدى وعشرون منصة إنتاجية متعددة الوكلاء، لكل منها بوابة FastAPI ومجموعة اختبارات ومستودع عام.",
    more: "منصة أخرى، جميعها مفتوحة المصدر وتعمل",
    cta: `استعرض المستودعات الـ${TOTAL_PLATFORMS}`,
    stats: [
      { value: "263/263", label: "اختبار ناجح" },
      { value: "100%", label: "مفتوح المصدر" },
      { value: "EN / AR", label: "دعم الاتجاهين" },
    ],
    footnote:
      "رقم 263 اختبارًا ناجحًا هو الإجمالي عبر المستودعات العامة الواحد والعشرين، لا مجموعة اختبارات واحدة في هذا المستودع. وتقدّم كل منصة لوحتها من الجهاز المحلي، لذا لا تُربط أي لوحة — استنسخ المستودع وستعمل عليه.",
  },
} as const;

export function AgentEcosystem() {
  const { locale } = useLocale();
  const copy = locale === "ar" ? COPY.ar : COPY.en;
  const specialty = locale === "ar" ? SPECIALTY_AR : SPECIALTY_EN;

  return (
    /* mb-14 matches the rhythm the section headers set, so the gap below this
       panel equals the gap above it. */
    <div className="mb-14">
      {/* Deliberately NO header block of its own. This renders inside
          <section id="projects">, directly beneath that section's
          eyebrow/title/rule/subtitle — a second centered masthead put two
          identical header stacks fourteen pixels apart and restated the same
          claim twice over. The eyebrow now sits inside the panel as a
          left-aligned label: it keeps the section identity, and the asymmetry
          against the centered header above is the point, not an accident.

          spotlight-border + ease-spring are the house card treatment
          (Projects.tsx:1327). The hover lift those cards carry is omitted on
          purpose — a full-bleed panel rising under the cursor reads as a
          glitch, where a 380px card reads as a card. */}
      <Reveal className="glass-panel spotlight-border relative rounded-panel overflow-hidden transition-all duration-300 ease-spring">
        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Ambient only — violet never touches a clickable control, and
              the layer is inert so it cannot swallow a click on the links
              stacked above it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -start-16 w-72 h-72 rounded-full bg-violet/10 blur-3xl"
          />

          {/* The block inherits the page direction and uses text-start, so the
              label sits on the reading edge — left in English, right in
              Arabic, like everything else in the panel. Only the inner span is
              dir="ltr", which is what keeps the leading "//" from flipping to
              the trailing edge. Putting dir="ltr" on the block instead pins it
              left in BOTH locales, because on a block that attribute sets the
              default text-align too. Harmless while this was text-center;
              wrong the moment it became a left-aligned masthead. */}
          <div className="relative text-xs font-mono text-brand/60 uppercase tracking-widest mb-6 lg:mb-8 text-start">
            <span dir="ltr" className="inline-block">
              {copy.eyebrow}
            </span>
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 lg:gap-10">
            {/* tabular-nums with tight leading and negative tracking is what
                gives a web numeral the weight the poster version got from
                being set as art. Live text, so it stays sharp at any zoom
                and any device pixel ratio. */}
            <div
              dir="ltr"
              className="shrink-0 text-[5rem] sm:text-[6.5rem] lg:text-[8.5rem] font-bold leading-[0.78] tracking-tighter text-brand tabular-nums"
            >
              {TOTAL_PLATFORMS}
            </div>
            <div>
              <div className="w-10 h-1 bg-brand mb-4 rounded-full" />
              {/* h3, not h4: the enclosing section owns the h2, and this is
                  now the only heading in the block — the outline stays
                  h2 → h3 with nothing skipped. text-balance keeps the last
                  line from orphaning a single word. */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-[1.1] max-w-xl text-balance">
                {copy.headline}
              </h3>
              {/* muted-foreground, matching every other section subtitle in
                  the portfolio. This is the one fact the removed header block
                  carried that the card did not already state. */}
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xl text-pretty">
                {copy.subtitle}
              </p>
            </div>
          </div>

          {/* A grid, not flex-wrap. Wrapping is content-driven, so rows broke
              at different points depending on how long each specialty ran and
              the repo glyph orphaned onto its own line. Explicit columns put
              the break under our control: number + name + glyph on line one
              with the specialty beneath it on a phone, all four in one row
              from `sm` up, identically for every entry. */}
          <ul className="relative mt-8 lg:mt-12 border-t border-border/60">
            {FEATURED.map((item, i) => (
              <li key={item.id} className="border-b border-border/60">
                <a
                  href={`https://github.com/${GITHUB_OWNER}/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_10rem_1fr_auto] items-baseline gap-x-4 gap-y-1.5 py-4 rounded-sm transition-colors duration-200 hover:bg-brand/[0.04] focus-visible:bg-brand/[0.06] focus-visible:outline-none"
                >
                  <span
                    dir="ltr"
                    className="row-start-1 col-start-1 font-mono text-xs text-brand tabular-nums ps-1"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    dir="ltr"
                    className="row-start-1 col-start-2 font-semibold text-foreground text-base sm:text-lg transition-colors duration-200 group-hover:text-brand"
                  >
                    {item.name}
                  </span>
                  <span className="row-start-2 col-start-2 col-span-2 sm:row-start-1 sm:col-start-3 sm:col-span-1 text-muted-foreground text-sm leading-snug">
                    {specialty[item.id]}
                  </span>
                  {/* The repo path, restored from the old table. At 1440 the
                      glyph alone sat ~800px from its own row with nothing
                      between, which read as a layout fault rather than as
                      whitespace. The path fills that span with the thing the
                      row actually promises, and doubles as the classic
                      editorial index treatment: name left, source right.
                      Hidden below sm, where the row is already two lines. */}
                  <div
                    dir="ltr"
                    className="row-start-1 col-start-3 sm:col-start-4 self-center flex items-center gap-2"
                  >
                    <span className="hidden sm:inline font-mono text-xs text-muted-foreground/50 transition-colors duration-200 group-hover:text-brand-soft">
                      {`${GITHUB_OWNER}/${item.id}`}
                    </span>
                    <Github className="w-4 h-4 shrink-0 text-muted-foreground/40 transition-colors duration-200 group-hover:text-brand" />
                  </div>
                </a>
              </li>
            ))}
            <li className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 py-4">
              <span
                dir="ltr"
                className="font-mono text-xs text-muted-foreground/50 tabular-nums ps-1"
              >
                {`+${TOTAL_PLATFORMS - FEATURED.length}`}
              </span>
              <span className="text-muted-foreground/70 text-sm">
                {copy.more}
              </span>
            </li>
          </ul>
        </div>

        {/* Stat rail. Divider direction follows the axis: horizontal rules
            while stacked on a phone, vertical once it becomes a row. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-brand/20 bg-surface-1/60 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {copy.stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-5 sm:py-6 text-center sm:text-start"
            >
              <div
                dir="ltr"
                className="text-2xl lg:text-3xl font-bold text-foreground tabular-nums"
              >
                {stat.value}
              </div>
              <div className="text-eyebrow uppercase text-muted-foreground/70 mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal step={1} className="mt-6 text-center">
        {/* The house CTA, identical to the one closing the Projects section
            (Projects.tsx:1602) plus the press feedback the tab pills use.
            A bare text link here read as a footnote, not an invitation. */}
        <a
          href={`https://github.com/${GITHUB_OWNER}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-brand/40 text-brand hover:bg-brand/10 px-6 py-3 rounded-lg transition-all duration-200 ease-spring active:scale-[0.97]"
        >
          <Github className="w-4 h-4 shrink-0" />
          {copy.cta}
          {/* rtl:rotate-180 so the arrow points at the reading edge in
              Arabic instead of back at its own label. */}
          <ArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
        </a>
        <p className="text-xs text-muted-foreground/70 mt-5 max-w-2xl mx-auto leading-relaxed text-pretty">
          {copy.footnote}
        </p>
      </Reveal>
    </div>
  );
}

export default AgentEcosystem;
