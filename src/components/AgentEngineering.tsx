"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * HARNESS × LOOP × GRAPH — the signature methodology section.
 *
 * WHAT CHANGED IN THE 2026-09-10 PASS
 * -----------------------------------
 * 1. LAYOUT. This was three equal cards in a `md:grid-cols-3`. That is the
 *    single most generic arrangement on the modern web, and it flattened the
 *    argument: three cards side by side say "here are three things", when the
 *    claim is actually a progression — the harness bounds what an agent CAN do,
 *    the loop decides when it is DONE, the graph decides what runs NEXT.
 *    Full-width rows separated by hairlines give the section reading order and
 *    let each pillar carry its callout at a legible measure.
 *
 * 2. COLOUR. Each pillar carried a literal hex: "hsl(var(--brand))", "#60d0e4"
 *    and "#a855f7". The third is violet, painted on a card that changed border
 *    and shadow on hover — CLAUDE.md is explicit that violet is ambient only
 *    and "never on a clickable control". The pillars are now differentiated by
 *    WEIGHT rather than hue (the numeral's opacity steps 01 -> 03), which keeps
 *    the single-accent rule intact and still separates them.
 *
 * 3. HOVER. The old card mutated `style.borderColor` and `style.boxShadow`
 *    imperatively in onMouseEnter/onMouseLeave. That is a DOM write on every
 *    pointer cross, it cannot be triggered by keyboard, and it leaves nothing
 *    for a touch device. Replaced with CSS group-hover / focus-within.
 *
 * 4. THE THESIS. The section previously had no single quotable line. It now
 *    leads with one, set as the largest type in the section.
 */

type Pillar = {
  id: "harness" | "loop" | "graph";
  number: string;
  chips: string[];
  /**
   * The system that demonstrates this pillar, and where to check it. This is
   * what turns three abstractions into an argument: a reader who doubts "loop
   * engineering" can open the eval cases and read them. A methodology section
   * with no exhibit is a manifesto.
   */
  exemplar: { name: string; note: string; href: string };
};

const PILLARS: readonly Pillar[] = [
  {
    id: "harness",
    number: "01",
    // Was ["MCP Servers", "Memory", "Permissions", "Hooks", "Observability"].
    // Memory and observability do not exist in this codebase (tracing is
    // disabled on purpose, CLAUDE.md §5), and nothing linked demonstrates
    // hooks. Chips name only what the exemplar or this repo can show.
    chips: ["MCP Servers", "Read-only Tools", "Guardrails", "Typed State"],
    exemplar: {
      name: "ProtoBridge",
      note: "MCP and A2A implemented to the wire, governance inside the envelope",
      href: "https://github.com/asadullah48/protobridge/tree/main/src/protobridge/protocols",
    },
  },
  {
    id: "loop",
    number: "02",
    // "Self-Correction" removed: no agent here revises its own output. The
    // loop is external — trace assertions plus a rubric judge (evals/judge.py).
    chips: ["Eval Harness", "Trace Assertions", "LLM Judge", "Regression Cases"],
    exemplar: {
      name: "evals/cases",
      note: "scored on the execution trace, not only on the prose",
      href: "https://github.com/asadullah48/asadullahshafique_devunity/tree/main/evals/cases",
    },
  },
  {
    id: "graph",
    number: "03",
    // Was ["LangGraph", "Human-in-the-Loop", "Retries", "Parallel Agents"].
    // The orchestrator is a one-hop star: no approval gate, no parallel
    // branches, and the fallback ladder degrades rather than retries.
    chips: ["Typed Routing", "Handoffs", "LangGraph", "Fallback Ladder"],
    exemplar: {
      name: "OrchestratorX",
      note: "routing as typed state, asserted offline with no API key",
      href: "https://github.com/asadullah48/orchestratorx/tree/main/tests",
    },
  },
] as const;

/**
 * The layer stack, bottom to top.
 *
 * The point this whole section exists to make is that the model is the BOTTOM
 * of the stack, not the product — everything above it is engineering, and that
 * is what decides whether the output can be trusted.
 *
 * Rendered as an ordered list rather than a picture: it is a sequence of eight
 * short labels, and a diagram would add pixels without adding meaning. Every
 * layer named here is one this repository can show — tools and protocols at
 * /mcp/server, guardrails in backend/constitution/, evaluation in evals/,
 * observability as route + tool_calls on PortfolioContext.
 */
const STACK: readonly string[] = [
  "MODEL",
  "HARNESS",
  "LOOP",
  "GRAPH",
  "TOOLS · PROTOCOLS",
  "GUARDRAILS",
  "EVALUATION",
  "OBSERVABILITY",
] as const;

export default function AgentEngineering() {
  const { t } = useLocale();

  return (
    <section id="agent-engineering" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-14 text-center">
          <div className="mb-3 font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {"// agent_engineering"}
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground lg:text-5xl">
            {t("agentEngineering.title")}{" "}
            <span className="text-brand">
              {t("agentEngineering.titleHighlight")}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            {t("agentEngineering.subtitle")}
          </p>
        </Reveal>

        {/* ------------------------------------------------------------------
            THE THESIS. Deliberately the largest type in the section — larger
            than the <h2> above it. A heading names a topic; this sentence makes
            the argument, so it gets the emphasis. Marked up as a <blockquote>
            because it is a stated position, not a section label, and that keeps
            the document outline honest: promoting it to a heading would put a
            full sentence into the page's heading tree for no navigational gain.
            ------------------------------------------------------------------ */}
        <Reveal step={1} className="mx-auto mb-16 max-w-4xl">
          <blockquote className="border-y border-brand/25 px-4 py-10 text-center sm:px-10">
            <p className="text-balance font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl lg:text-4xl">
              {t("agentEngineering.thesis")}
            </p>
          </blockquote>
        </Reveal>

        {/* ------------------------------------------------------------------
            THE THREE PILLARS, as rows. A 12-column grid on lg:
            3 cols identity | 6 cols argument | 3 cols vocabulary.
            The asymmetry is the point — an even 4/4/4 split would reproduce
            the three-equal-cards problem in a different orientation.
            ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-6xl">
          {PILLARS.map((pillar, index) => (
            <Reveal
              key={pillar.id}
              step={index + 2}
              className="group grid grid-cols-1 gap-6 border-t border-border py-10 transition-colors duration-300 last:border-b focus-within:border-brand/30 hover:border-brand/30 lg:grid-cols-12 lg:gap-10"
            >
              {/* Identity */}
              <div className="lg:col-span-3">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-display text-4xl font-bold tabular-nums text-brand"
                    // Weight, not hue, separates the three. 01 is the most
                    // present because it is the precondition for the other two.
                    style={{ opacity: 1 - index * 0.22 }}
                    aria-hidden="true"
                  >
                    {pillar.number}
                  </span>
                  <span className="font-mono text-eyebrow uppercase tracking-widest text-muted-foreground">
                    {t(`agentEngineering.${pillar.id}.tag`)}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {t(`agentEngineering.${pillar.id}.title`)}
                </h3>
              </div>

              {/* Argument */}
              <div className="lg:col-span-6">
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {t(`agentEngineering.${pillar.id}.desc`)}
                </p>
                <p className="mt-4 border-s-2 border-brand/40 bg-surface-1/50 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  <span className="text-brand-soft">&gt; </span>
                  {t(`agentEngineering.${pillar.id}.callout`)}
                </p>

                {/* The exhibit. Each pillar names the thing that demonstrates
                    it and links straight to that code, so the three concepts
                    are checkable rather than merely asserted. */}
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
                  <span className="font-mono uppercase tracking-widest text-muted-foreground/70">
                    {t("agentEngineering.seenIn")}
                  </span>
                  <a
                    href={pillar.exemplar.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-brand-soft transition-colors hover:text-brand"
                  >
                    {pillar.exemplar.name}
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                  <span className="text-muted-foreground">
                    {pillar.exemplar.note}
                  </span>
                </p>
              </div>

              {/* Vocabulary */}
              <ul className="flex flex-wrap content-start gap-1.5 lg:col-span-3">
                {pillar.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors duration-200 group-hover:border-brand/25 group-hover:text-foreground/80"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* ------------------------------------------------------------------
            THE STACK. The section's closing move, and the reason it is a
            signature rather than three cards: it places the MODEL at the
            bottom and names the seven engineered layers above it.

            Deliberately typographic. The brief that asked for this also said
            "do NOT add more gradients, particles, glassmorphism, cards" — so
            this is an ordered list, a hairline and a sentence.
            ------------------------------------------------------------------ */}
        <Reveal step={5} className="mx-auto mt-20 max-w-4xl">
          <p className="mb-5 text-center font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {t("agentEngineering.stackLabel")}
          </p>

          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            {STACK.map((layer, i) => (
              <li key={layer} className="flex items-center gap-2">
                <span
                  className={`rounded border px-2.5 py-1 font-mono text-[11px] tracking-wide ${
                    // The model is the one layer that is NOT engineered here,
                    // so it is the one layer painted as neutral. Everything
                    // above it carries the brand edge, because everything above
                    // it is the work.
                    i === 0
                      ? "border-border bg-surface-1 text-muted-foreground"
                      : "border-brand/25 bg-brand/[0.06] text-brand-soft"
                  }`}
                >
                  {layer}
                </span>
                {i < STACK.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-muted-foreground/40"
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-10 max-w-2xl text-balance border-t border-brand/25 pt-8 text-center font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
            {t("agentEngineering.closing")}
          </p>

          <p className="mt-6 text-center font-mono text-sm text-muted-foreground/70">
            {t("agentEngineering.footer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
