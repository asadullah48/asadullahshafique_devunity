"use client";

import { FlaskConical } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/context/LocaleContext";

/**
 * AGENT TRACE — one request through the orchestrator, stage by stage.
 *
 * HONESTY CONTRACT
 * ----------------
 * This is the section most likely to be mistaken for live telemetry, so it
 * states what it is twice: once as a visible badge, once as a sentence under
 * the heading. The distinction drawn is precise, because a vague disclaimer is
 * worse than none —
 *
 *   REAL:         the stages, their order, and every `source` path below.
 *                 Those are the files this site's FastAPI orchestrator runs.
 *   ILLUSTRATIVE: the field VALUES. A representative request, not a captured
 *                 production run.
 *
 * If you want genuinely live agent state, it already exists in this codebase
 * and is not simulated: <AgentActivityLog />, in the Agent Runtime section
 * directly below (AgentRuntime.tsx), polls /api/agent/info and prints what
 * comes back, including [OFFLINE].
 *
 * A note on scope, because it would be easy to overclaim here: the chat widget
 * a visitor sees is the Gemini serverless path (src/app/api/agent/chat/stream).
 * The orchestrator traced below is the FastAPI path at /api/agent/chat. Both
 * are real; they are not the same path, and the `source` column makes which is
 * which checkable rather than asking the reader to trust a summary.
 *
 * ACCESSIBILITY
 * -------------
 * Built on Radix Tabs rather than hand-rolled click handlers, which is why
 * arrow-key navigation, roving tabindex, aria-selected and the tab/panel
 * association all work without being reimplemented here. `orientation` is
 * vertical at every breakpoint: a pipeline reads downward, arrow-key direction
 * then matches visual direction on every screen size, and the mobile layout
 * needs no horizontal scroll.
 */

type TraceStep = {
  id: string;
  label: string;
  state: string;
  operation: string;
  tool?: string;
  decision?: string;
  outcome: string;
  /**
   * The file that implements this stage. This column is what makes the section
   * checkable rather than decorative.
   */
  source: string;
};

const STEPS: readonly TraceStep[] = [
  {
    id: "request",
    label: "REQUEST",
    state: "inbound",
    operation: "POST /api/agent/chat",
    outcome:
      "A typed PortfolioContext is created for this run. It carries dependencies and the audit trail — never anything the model is expected to read.",
    source: "backend/main.py",
  },
  {
    id: "route",
    label: "ROUTE",
    state: "triage",
    operation: "Orchestrator selects one specialist",
    decision: "route = portfolio",
    outcome:
      "The constitutional input guardrail is attached to the orchestrator and screens the raw question. Its pattern layer needs no model at all; on this SDK version it runs alongside triage, and a tripwire ends the run as a refusal. Only the orchestrator routes; specialists hold no handoffs, so the graph stays a star and the run stays one hop.",
    source: "backend/orchestration/orchestrator.py",
  },
  {
    id: "plan",
    label: "PLAN",
    state: "specialist",
    operation: "Portfolio Specialist selects a knowledge tool",
    outcome:
      "Instructions name each tool's trigger explicitly. Answering from memory is treated as a failure even when the answer would have been right — an unsourced answer cannot be audited.",
    source: "backend/orchestration/specialists.py",
  },
  {
    id: "tool",
    label: "TOOL CALL",
    state: "acting",
    operation: "Invoke the selected tool",
    tool: "get_projects()",
    outcome:
      "The call is appended to context.tool_calls. This is the field the eval suite asserts against, which is how a fluent answer that skipped its tool gets caught.",
    source: "backend/orchestration/specialists.py",
  },
  {
    id: "observation",
    label: "OBSERVATION",
    state: "observing",
    operation: "Tool returns structured facts",
    outcome:
      "Facts come from backend/knowledge/portfolio.json — one source, three renderers. The agent, the MCP server and the frontend all read the same file, so they cannot drift apart.",
    source: "backend/knowledge/__init__.py",
  },
  {
    id: "verify",
    label: "VERIFY",
    state: "screening",
    operation: "Constitutional output guardrail",
    outcome:
      "Applied to the Portfolio Specialist specifically — the one agent emitting free prose about a real person, where a fabricated employer or client would do real damage. The other three return structured objects already constrained by their output_type.",
    source: "backend/constitution/",
  },
  {
    id: "decision",
    label: "DECISION",
    state: "resolved",
    operation: "Emit or refuse",
    decision: "pass -> answer | tripwire -> mode: refused",
    outcome:
      "A tripwire is a RESULT, not an error. It is re-raised rather than swallowed, because collapsing it to None would read as “drop a rung” and answer the refused request through the unguarded fallback path.",
    source: "backend/orchestration/orchestrator.py",
  },
  {
    id: "result",
    label: "RESULT",
    state: "emitting",
    operation: "Return answer with provenance",
    outcome:
      "The response carries the route taken and the tools called alongside the prose, so the answer arrives with its own receipt.",
    source: "backend/orchestration/orchestrator.py",
  },
  {
    id: "audit",
    label: "AUDIT",
    state: "recorded",
    operation: "context.trace()",
    outcome:
      "Route and tool calls are replayable after the fact. This is what the deterministic eval layer reads — the layer that earns its keep, because a judge scoring only prose passes a confident, plausible, unsourced answer.",
    source: "backend/orchestration/context.py",
  },
] as const;

/** One label/value row in the detail panel. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-border/60 py-3 sm:grid-cols-[130px_1fr] sm:gap-4">
      <dt className="font-mono text-eyebrow uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="font-mono text-sm text-foreground/90">{value}</dd>
    </div>
  );
}

export default function AgentTrace() {
  const { t } = useLocale();

  return (
    <section id="agent-trace" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-10 text-center">
          <div className="mb-3 font-mono text-eyebrow uppercase tracking-widest text-brand/60">
            {t("trace.eyebrow")}
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground lg:text-5xl">
            {t("trace.title")}{" "}
            <span className="text-brand">{t("trace.titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            {t("trace.subtitle")}
          </p>
        </Reveal>

        {/* The disclaimer is a peer of the content, not a footnote under it.
            Placing it above the trace means it cannot be missed by someone who
            skims the diagram and leaves. */}
        <Reveal
          step={1}
          className="mx-auto mb-10 max-w-3xl rounded-panel border border-brand/25 bg-surface-1/50 p-4"
        >
          <p className="flex items-center justify-center gap-2 text-center font-mono text-xs uppercase tracking-widest text-brand-soft">
            <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t("trace.illustrative")}
          </p>
          <p className="mt-2 text-pretty text-center text-xs leading-relaxed text-muted-foreground">
            {t("trace.illustrativeDetail")}
          </p>
        </Reveal>

        <Reveal step={2} className="mx-auto max-w-6xl">
          <Tabs
            defaultValue={STEPS[0].id}
            orientation="vertical"
            className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(200px,240px)_1fr]"
          >
            {/* The rail. Overrides the shadcn default (h-10, bg-muted,
                inline-flex) which is built for a short horizontal pill group. */}
            <TabsList className="flex h-auto w-full flex-col items-stretch justify-start gap-0 rounded-none bg-transparent p-0">
              {STEPS.map((step, i) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  className="justify-start gap-3 rounded-none border-s-2 border-border px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors data-[state=active]:border-s-brand data-[state=active]:bg-surface-1/60 data-[state=active]:text-brand-soft data-[state=active]:shadow-none"
                >
                  <span className="tabular-nums opacity-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {STEPS.map((step) => (
              <TabsContent
                key={step.id}
                value={step.id}
                className="mt-0 rounded-panel border border-border bg-surface-1/40 p-6 lg:p-8"
              >
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {step.label}
                </h3>

                <dl className="mt-5">
                  <Field label={t("trace.fieldState")} value={step.state} />
                  <Field
                    label={t("trace.fieldOperation")}
                    value={step.operation}
                  />
                  {step.tool && (
                    <Field label={t("trace.fieldTool")} value={step.tool} />
                  )}
                  {step.decision && (
                    <Field
                      label={t("trace.fieldDecision")}
                      value={step.decision}
                    />
                  )}
                </dl>

                <div className="mt-5 border-t border-border/60 pt-5">
                  <p className="font-mono text-eyebrow uppercase tracking-widest text-muted-foreground">
                    {t("trace.fieldOutcome")}
                  </p>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {step.outcome}
                  </p>
                </div>

                <p className="mt-5 font-mono text-xs text-muted-foreground/70">
                  <span className="text-brand-soft">
                    {t("trace.fieldSource")}:{" "}
                  </span>
                  {step.source}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
