"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Github, Workflow } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { FlowKind, FlowNode, ModuleFlow } from "@/lib/module-flows";

/**
 * "Inspect the system" — the per-card flow diagram for the six spotlight
 * projects. See docs/plans/2026-09-03-agentic-module-showcase-design.md.
 *
 * Deliberately takes plain primitives (title/problem/solution/impact/...)
 * rather than importing the `Project` type from Projects.tsx: that file
 * already imports THIS component, and a value-level circular import between
 * the two is worth avoiding even though a type-only one would compile away.
 * Projects.tsx is the only real caller; this shape is its `Project` fields,
 * copied rather than imported.
 */
type ModuleFlowDialogProps = {
  flow: ModuleFlow;
  title: string;
  statusBadge: React.ReactNode;
  problem?: string;
  solution?: string;
  impact?: string;
  tech: string[];
  github?: string;
  demo?: string;
  labels: {
    inspectSystem: string;
    problem: string;
    solution: string;
    impact: string;
    viewCode: string;
    viewDemo: string;
  };
};

export function ModuleFlowDialog({
  flow,
  title,
  statusBadge,
  problem,
  solution,
  impact,
  tech,
  github,
  demo,
  labels,
}: ModuleFlowDialogProps) {
  const { locale } = useLocale();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors duration-200 w-fit hover:text-brand"
        >
          <Workflow className="w-3.5 h-3.5" /> {labels.inspectSystem}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          {/* pe-8 reserves the close button's corner. Project titles here run
              long enough to reach it in either direction once wrapped. */}
          <div className="flex flex-wrap items-center gap-3 pe-8">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {statusBadge}
          </div>
        </DialogHeader>

        <FlowDiagram flow={flow} locale={locale} />

        <p className="text-muted-foreground/70 text-xs leading-relaxed -mt-2">
          {flow.caption[locale]}
        </p>

        {(problem || solution || impact) && (
          <div className="border border-border rounded-lg p-5 space-y-4 bg-surface-1/60">
            {[
              { label: labels.problem, dot: "bg-muted-foreground/50", text: "text-muted-foreground", body: problem },
              { label: labels.solution, dot: "bg-brand/50", text: "text-brand-soft", body: solution },
              { label: labels.impact, dot: "bg-brand", text: "text-brand", body: impact },
            ]
              .filter((row) => row.body)
              .map((row) => (
                <div key={row.label}>
                  <div className={cn("text-eyebrow font-semibold uppercase mb-2 flex items-center gap-2", row.text)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full inline-block", row.dot)} />
                    {row.label}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{row.body}</p>
                </div>
              ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="px-2.5 py-1 bg-surface-3/60 border border-border text-muted-foreground text-xs rounded-md font-mono">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm border border-border hover:border-brand/30 px-4 py-2 rounded-md transition-all duration-200 ease-spring active:scale-[0.97]">
              <Github className="w-4 h-4" /> {labels.viewCode}
            </a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-brand text-sm border border-border hover:border-brand/40 px-4 py-2 rounded-md transition-all duration-200 ease-spring active:scale-[0.97]">
              <ExternalLink className="w-4 h-4" /> {labels.viewDemo}
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------------------------
 * The diagram itself.
 *
 * "radial" needs real 2D placement (a hub with satellites around it), so it
 * gets an aspect-square container and an SVG whose 0-100 viewBox matches
 * that square exactly — no distortion. "chain" is a plain vertical flexbox
 * of HTML node cards with a tiny dedicated connector SVG between each pair;
 * this deliberately avoids a shared coordinate system, which sidesteps any
 * non-uniform-stretch distortion and lets each card size to its own text,
 * in either locale, without a layout pass computing positions.
 *
 * Text lives in normal HTML, not <text> in the SVG: real Arabic shaping and
 * `dir` inheritance for free, versus SVG text's RTL/`text-anchor` quirks.
 * The SVG here draws only geometry (edges, small pulse dots).
 * ------------------------------------------------------------------ */
function FlowDiagram({ flow, locale }: { flow: ModuleFlow; locale: "en" | "ar" }) {
  return flow.layout === "radial" ? (
    <RadialFlow flow={flow} locale={locale} />
  ) : (
    <ChainFlow flow={flow} locale={locale} />
  );
}

function NodeIndicator({ kind, delay }: { kind: FlowKind; delay: number }) {
  return (
    <span
      className={cn(
        "h-2.5 w-2.5 shrink-0 bg-brand animate-think-pulse",
        kind === "agentic" ? "rounded-full" : "rounded-[2px]"
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function NodeCard({ node, kind, locale, delay }: { node: FlowNode; kind: FlowKind; locale: "en" | "ar"; delay: number }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-1/60 px-3.5 py-2.5 text-start">
      <NodeIndicator kind={kind} delay={delay} />
      <div>
        <div dir="ltr" className="font-mono text-sm font-semibold text-foreground text-start">
          {node.label[locale]}
        </div>
        <p className="text-muted-foreground/80 text-xs leading-snug mt-0.5">{node.detail[locale]}</p>
      </div>
    </div>
  );
}

/** A short, straight connector between two stacked node cards in a chain. */
function ChainConnector() {
  return (
    <svg
      width="2"
      height="24"
      className="mx-auto shrink-0"
      aria-hidden
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="24"
        stroke="hsl(var(--brand) / 0.5)"
        strokeWidth={2}
        className="animate-data-flow"
      />
    </svg>
  );
}

function ChainFlow({ flow, locale }: { flow: ModuleFlow; locale: "en" | "ar" }) {
  return (
    <div className="flex flex-col items-stretch">
      {flow.nodes.map((node, i) => (
        <Fragment key={node.id}>
          <NodeCard node={node} kind={flow.kind} locale={locale} delay={i * 0.3} />
          {i < flow.nodes.length - 1 && <ChainConnector />}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * The one radial diagram in the set (OrchestratorX). `flow.nodes[0]` is the
 * hub by convention — module-flows.ts always lists the supervisor/root
 * first for a radial flow. Positions are plain trigonometry on a 0-100
 * viewBox that matches the aspect-square container 1:1.
 */
function RadialFlow({ flow, locale }: { flow: ModuleFlow; locale: "en" | "ar" }) {
  const [hub, ...satellites] = flow.nodes;
  const cx = 50;
  const cy = 50;
  const radius = 36;
  // Edges start this far out from the centre instead of at the exact centre.
  // The hub's own label sits directly under the hub dot, so a spoke drawn from
  // (cx, cy) runs straight down through that text. Starting every spoke
  // outside the label's box clears it without moving the label off the node —
  // and all four spokes are trimmed identically, so the gap reads as a hub
  // rather than as one broken line. 12 units = 36px at the 300px max width,
  // which clears a one-line label plus its 14px offset. A hub label that
  // wrapped to two lines would need more.
  const hubClearance = 12;
  const angleStep = (2 * Math.PI) / satellites.length;

  const positions = satellites.map((node, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    return {
      node,
      x: cx + radius * ux,
      y: cy + radius * uy,
      x0: cx + hubClearance * ux,
      y0: cy + hubClearance * uy,
      // A label always sits on the side of its dot AWAY from the hub. Below is
      // the natural reading position, but for a satellite in the upper half
      // "below" points back at the centre, so the label lands on top of its own
      // incoming edge — the bug this rule exists to prevent.
      above: uy < -0.01,
    };
  });

  return (
    // mt-8/mb-12: labels sit outside the aspect-square box itself (see the
    // split-position comment above), so the box needs reserved space on both
    // sides — beneath for the bottom node's two-line detail text, above for
    // the top node's, which would otherwise ride up into the dialog title.
    <div className="relative mx-auto aspect-square w-full max-w-[300px] mt-8 mb-12">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {positions.map(({ node, x, y, x0, y0 }, i) => (
          <line
            key={node.id}
            x1={x0}
            y1={y0}
            x2={x}
            y2={y}
            stroke="hsl(var(--brand) / 0.45)"
            strokeWidth={0.6}
            className="animate-data-flow"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      {/* Hub dot — centered EXACTLY on (cx, cy), the same point the SVG
          lines above terminate at. Kept in its own element rather than the
          first child of the label block below: a flex column centered via
          translate(-50%, -50%) centers the whole block, which pulls the dot
          itself off the line's real endpoint and lets the line run into the
          text instead of stopping at the node. */}
      <div
        className="absolute"
        style={{ left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="h-3 w-3 rounded-full bg-brand animate-think-ring absolute" />
        <span className="h-3 w-3 rounded-full bg-brand animate-think-pulse block" />
      </div>
      <div
        className="absolute text-center"
        style={{ left: `${cx}%`, top: `calc(${cy}% + 14px)`, transform: "translate(-50%, 0)" }}
      >
        <div dir="ltr" className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
          {hub.label[locale]}
        </div>
      </div>

      {/* Satellites — same split: a dot pinned to the exact (x, y) the edge
          terminates at, and a label block offset off it by a fixed pixel gap,
          on the side facing away from the hub, so it never overlaps the line.
          `above` flips both the anchor edge and the translate: -100% pins the
          block's BOTTOM to the offset point, 0 pins its top. */}
      {positions.map(({ node, x, y, above }, i) => (
        <Fragment key={node.id}>
          <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
            <span className="h-2 w-2 rounded-full bg-brand animate-think-pulse block" style={{ animationDelay: `${i * 0.28}s` }} />
          </div>
          <div
            className="absolute flex flex-col items-center text-center w-24"
            style={{
              left: `${x}%`,
              top: above ? `calc(${y}% - 10px)` : `calc(${y}% + 10px)`,
              transform: above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            }}
          >
            <div dir="ltr" className="font-mono text-[11px] font-semibold text-foreground leading-tight">
              {node.label[locale]}
            </div>
            <p className="text-muted-foreground/70 text-[10px] leading-tight mt-0.5">{node.detail[locale]}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default ModuleFlowDialog;
