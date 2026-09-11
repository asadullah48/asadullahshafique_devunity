"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ENGINEERING_EVIDENCE, sourceHref, sourceLabel } from "@/lib/evidence";
import { useLocale } from "@/context/LocaleContext";

/**
 * ENGINEERING EVIDENCE — the layer beneath the proof strip.
 *
 * The proof strip answers "is there anything here?" in five words per cell.
 * This section answers "why does that matter?" and, crucially, "where do I go
 * to check?" — every entry ends in a link to the directory or endpoint that
 * settles it.
 *
 * LAYOUT — a two-column grid, not three. Three is the reflexive choice and it
 * would squeeze this prose to roughly 30 characters per line, which is where
 * technical writing stops being readable. Two columns keeps each entry near the
 * ~65-character measure that actually gets read, and six entries divide evenly
 * into it.
 *
 * The value is set larger than the label because the value is the claim; the
 * label is only its category. Reversing that emphasis is a common tell of a
 * section designed around its grid rather than around what it is saying.
 */
export default function EngineeringEvidence() {
  const { t, locale } = useLocale();
  const isArabic = locale === "ar";

  return (
    <section id="evidence" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-14 text-center">
          <div className="mb-3 font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {t("evidence.eyebrow")}
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground lg:text-5xl">
            {t("evidence.title")}{" "}
            <span className="text-brand">{t("evidence.titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            {t("evidence.subtitle")}
          </p>
        </Reveal>

        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-border/50 md:grid-cols-2">
          {ENGINEERING_EVIDENCE.map((item, i) => {
            // Fall back to the English record when a translation is absent,
            // rather than rendering an empty cell. `ar` is optional on the
            // type, so an entry added without a translation degrades to English
            // instead of breaking the page.
            const copy = isArabic && item.ar ? item.ar : item;

            return (
              <li
                key={item.id}
                className="group flex flex-col bg-background p-6 transition-colors duration-300 hover:bg-surface-1/40 lg:p-8"
              >
                <Reveal step={i} className="flex h-full flex-col">
                  <span className="font-mono text-eyebrow uppercase tracking-widest text-muted-foreground">
                    {copy.label}
                  </span>

                  <span className="mt-2 font-display text-2xl font-semibold tabular-nums text-foreground">
                    {copy.value}
                  </span>

                  <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {copy.detail}
                  </p>

                  {/* mt-auto pins every link to the bottom of its cell, so the
                      six form a clean line regardless of how long the prose
                      above them runs. */}
                  <a
                    href={sourceHref(item.source)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex flex-wrap items-center gap-x-1.5 pt-6 font-mono text-xs text-brand-soft transition-colors duration-200 hover:text-brand"
                  >
                    {t("evidence.inspect")}
                    <span className="text-muted-foreground/60">
                      {sourceLabel(item.source)}
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
                      aria-hidden="true"
                    />
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
