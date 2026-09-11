"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROOF, sourceHref, sourceLabel } from "@/lib/evidence";
import { useLocale } from "@/context/LocaleContext";

/**
 * PROOF STRIP — the credibility layer directly beneath the hero.
 *
 * WHY THIS IS A CLIENT COMPONENT, RELUCTANTLY
 * -------------------------------------------
 * It was written as a server component — it has no state, no effects and no
 * handlers, so it could ship zero JavaScript, which matters on a page where 68
 * of 90 .tsx files already hydrate. But /ar re-exports page.tsx's default
 * wholesale (see src/app/ar/page.tsx), so this section renders on the Arabic
 * route too, and useLocale() — the only translation mechanism here — is
 * client-only. A server component would have left five untranslated English
 * labels sitting on the second screen of the Arabic site.
 *
 * Shipping an untranslated section to keep a benchmark number is the wrong
 * trade. The perf win in this pass is real and came from elsewhere: the hero
 * lost a 20s infinite rotation and a self-re-arming 900ms setTimeout chain.
 *
 * `resolve()` in LocaleContext returns the KEY PATH when a lookup misses, so a
 * missing translation renders the literal string "proof.governance.label" on
 * the page. Both locale files therefore carry the full key set; adding an entry
 * to PROOF without adding both translations is a visible bug, not a silent one.
 *
 * DESIGN NOTE — every cell is a link, and that is the entire argument of the
 * section. A proof strip whose numbers cannot be clicked is just a bigger
 * claim. Making the verification target the primary affordance is what
 * separates "here is evidence" from "here are impressive figures": the reader
 * is invited to go and check, and the cost of checking is one click.
 *
 * Content deliberately stops at label + value. The reasoning for each item is
 * one layer deeper, in <EngineeringEvidence />. Putting the "why it matters"
 * prose here too would make the first screen after the hero dense enough to
 * skip, which is the opposite of what a proof layer is for.
 */
export default function ProofStrip() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="proof-heading"
      className="border-y border-border/70 bg-surface-1/30"
    >
      <h2 id="proof-heading" className="sr-only">
        {t("proof.heading")}
      </h2>

      <div className="container mx-auto px-6">
        {/*
          Hairline dividers via a 1px gap over a tinted background, rather than
          per-cell borders. Per-cell borders double up where cells meet and
          produce a 2px seam; a gap-over-background never does, and it reflows
          correctly when the column count changes at each breakpoint.

          Column counts: 2 at 320px (five items leave one orphan, handled by the
          last child spanning), 3 at md, 5 at lg. Never 5 on mobile — a 64px
          column cannot hold "SDK + 4 specialists" without breaking mid-word.
        */}
        <ul className="grid grid-cols-2 gap-px bg-border/50 md:grid-cols-3 lg:grid-cols-5 [&>li:last-child]:max-md:col-span-2">
          {PROOF.map((item) => (
            <li key={item.id} className="bg-background">
              <Link
                href={sourceHref(item.source)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-1 px-4 py-6 transition-colors duration-200 hover:bg-surface-1/60 focus-visible:bg-surface-1/60 lg:px-5"
              >
                <span className="text-eyebrow font-mono uppercase tracking-widest text-muted-foreground">
                  {t(`proof.${item.id}.label`)}
                </span>

                {/* tabular-nums so the figures sit on a shared grid instead of
                    jittering between cells — these read as instrumentation. */}
                <span className="font-display text-lg font-semibold leading-tight text-foreground tabular-nums lg:text-xl">
                  {t(`proof.${item.id}.value`)}
                </span>

                <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[11px] text-muted-foreground/70 transition-colors duration-200 group-hover:text-brand-soft group-focus-visible:text-brand-soft">
                  {t("proof.verify")}
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
                    aria-hidden="true"
                  />
                  {/* The concrete target is announced to screen readers but not
                      painted — the visible "Verify" alone would give a screen
                      reader five identical link names with no way to tell them
                      apart, which is exactly the failure WCAG 2.4.4 describes. */}
                  <span className="sr-only">
                    {t(`proof.${item.id}.label`)}: {sourceLabel(item.source)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
