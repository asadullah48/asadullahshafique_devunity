"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * AGENT RUNTIME — the two real instruments, promoted out of the footer.
 *
 * WHY THIS SECTION EXISTS
 * -----------------------
 * The site had the arrangement backwards: a SCRIPTED terminal in the hero
 * (removed in the 2026-09-10 pass) and the two genuinely live panels buried
 * below the copyright rule. Most portfolios animate something that pretends to
 * be an AI system; this one can point at an endpoint. That is worth more than
 * any animation, and it was in the wrong place to be worth anything.
 *
 * MOVED, NOT COPIED. Both panels were removed from Footer.tsx rather than
 * duplicated here. Two mounted copies would mean two independent poll loops
 * against /api/agent/info and /api/health on every page rendering the footer,
 * for one visible readout.
 *
 * WORDING — WHY THIS IS NOT CALLED "TELEMETRY"
 * --------------------------------------------
 * /api/agent/info was audited field by field against the live upstream on
 * 2026-09-10. It returns two different KINDS of thing, and conflating them
 * would be exactly the overclaim the rest of this pass removed:
 *
 *   MEASURED AT REQUEST TIME (genuinely live)
 *     reachable / state         did the backend answer just now
 *     latency                   measured round trip, never estimated
 *     constitution.enforcement  "full" vs "deterministic-only" — this really
 *                               does change; it reports whether the classifier
 *                               model is currently reachable
 *     orchestration.available
 *
 *   REPORTED BY THE RUNNING SERVICE (real, but fixed per deployment)
 *     sdk_installed, model, primary_path, fallback_order,
 *     constitution.principles[5], constitution.version
 *
 *   DECLARED, NOT INTROSPECTED
 *     tools[6], specialists[4] — string literals in backend/main.py
 *     agent_info(). They would read 6 and 4 even if the SDK were missing, so
 *     they are shown as a declared roster and never cited as proof of
 *     anything running. orchestration.available is the field that is.
 *
 *   ABSENT ENTIRELY
 *     request counts, per-run traces, token usage, error rates, throughput
 *
 * Because that third group is empty, this is a SERVICE READOUT, not execution
 * telemetry, and the copy says so in as many words. "Live agent telemetry"
 * would be a claim the endpoint cannot support.
 */

/**
 * The same lazy, client-only treatment these two carried in the footer, for
 * the same reason: each renders nothing but placeholders until a fetch
 * resolves, so server-rendering them produces a panel full of "—".
 *
 * The skeleton heights match the settled heights to avoid a layout shift.
 * That mattered less in the footer (CLS counts only shifts inside the
 * viewport, and the footer is below it) and matters here, because this section
 * sits mid-page where a reader will actually be looking at it.
 */
const AgentActivityLog = dynamic(
  () => import("@/components/AgentActivityLog"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[208px] rounded-panel border border-border bg-surface-1/60" />
    ),
  }
);

const AgentStatusRail = dynamic(() => import("@/components/AgentStatusRail"), {
  ssr: false,
  loading: () => (
    <div className="h-[74px] rounded-panel border border-border bg-surface-1/60" />
  ),
});

/** The endpoints these panels actually read. Both are public and linkable. */
const SOURCES = [
  { path: "/api/agent/info", href: "/api/agent/info" },
  { path: "/api/health", href: "/api/health" },
] as const;

export default function AgentRuntime() {
  const { t } = useLocale();

  return (
    <section id="agent-runtime" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-10 text-center">
          <div className="mb-3 font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {t("runtime.eyebrow")}
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground lg:text-5xl">
            {t("runtime.title")}{" "}
            <span className="text-brand">{t("runtime.titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            {t("runtime.subtitle")}
          </p>
        </Reveal>

        {/* The precision note sits ABOVE the panels, not under them. A reader
            who sees a terminal log and scrolls on should already have been told
            what it is, and what it is not. */}
        <Reveal
          step={1}
          className="mx-auto mb-8 max-w-3xl rounded-panel border border-border bg-surface-1/40 p-5"
        >
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {t("runtime.precision")}
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {t("runtime.degraded")}
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
            <span className="text-muted-foreground/70">
              {t("runtime.sourceLabel")}:
            </span>
            {SOURCES.map((s) => (
              <a
                key={s.path}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-soft transition-colors hover:text-brand"
              >
                {s.path}
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            ))}
          </p>
        </Reveal>

        <Reveal step={2} className="mx-auto max-w-3xl space-y-4">
          <AgentActivityLog />
          <AgentStatusRail />
        </Reveal>
      </div>
    </section>
  );
}
