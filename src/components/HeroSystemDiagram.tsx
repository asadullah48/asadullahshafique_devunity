/**
 * HERO SYSTEM DIAGRAM — the agent execution topology, drawn to match the code.
 *
 * NO "use client". Pure SVG plus one existing CSS animation class, so this
 * ships zero JavaScript. It replaces three client components that between them
 * ran a perpetual setTimeout chain (TerminalCard re-armed itself every 900ms
 * forever) and a 20s infinite rotation. A hero that animates on the main thread
 * for the entire session is a strange thing to put under the claim "I engineer
 * reliable systems".
 *
 * WHAT THIS DRAWS, AND WHERE EACH PART LIVES
 * ------------------------------------------
 *   ORCHESTRATOR · INPUT GUARD  backend/orchestration/orchestrator.py — the only
 *                               agent holding handoffs. The constitutional input
 *                               guardrail is attached to THIS agent.
 *   four specialists            backend/orchestration/specialists.py
 *   6 TOOLS                     Portfolio Specialist only (PORTFOLIO_TOOLS).
 *   OUTPUT GUARD                Portfolio Specialist only — the one agent that
 *                               writes free prose about a real person.
 *   TYPED OUTPUT                the other three: ErrorSolution / Lesson /
 *                               TeachingResult, constrained by output_type.
 *   RESULT · TRACE              run_orchestrated_chat returns the answer with
 *                               ctx.trace() — route and tool_calls.
 *
 * CORRECTED 2026-09-11. The previous version drew three specialists (the code
 * has four), fanned every specialist into a shared "TOOLS · MCP" layer (only one
 * specialist has tools, and they are in-process function tools that mirror the
 * MCP server's results from the same source, not MCP calls), and put GUARDRAILS
 * and a VERIFY stage on every result (the output guardrail sits on one
 * specialist, and there is no runtime VERIFY stage — verification is evals/,
 * run offline). It was tidier, and wrong on three counts.
 *
 * The input guard is drawn INSIDE the orchestrator node, not as a gate above
 * it, on purpose: openai-agents 0.10's @input_guardrail defaults to
 * run_in_parallel=True, so the screen runs alongside triage rather than before
 * it. A separate upstream box would assert an ordering the code does not have.
 * CLAUDE.md's Reality Rule applies to pictures as much as to prose.
 *
 * MOTION
 * ------
 * The only animation is `animate-data-flow`, an existing primitive
 * (globals.css) that marches a stroke-dash along each edge. It is listed in the
 * authoritative prefers-reduced-motion block, so it disables itself with no
 * extra work here — and because the edges are painted solid underneath, the
 * diagram is fully legible with motion off. Nothing is conveyed by movement
 * alone.
 */

/** A node in the pipeline. `w` is width in viewBox units; `y` is the top edge. */
type DiagramNode = {
  id: string;
  label: string;
  y: number;
  w: number;
  /** Horizontal centre. Defaults to the spine. */
  cx?: number;
  /** Emphasised nodes carry the brand edge; the rest stay neutral. */
  accent?: boolean;
};

const SPINE = 170;
const NODE_H = 32;
const VB_W = 340;
const VB_H = 428;

/** Four specialist columns, 85 units apart, centred in the 340-unit viewBox. */
const COL = [42.5, 127.5, 212.5, 297.5] as const;

/**
 * Row geometry, kept as data rather than hand-placed markup so the layout is
 * checkable against the code at a glance: one orchestrator, four specialists,
 * and the tools/guard column sitting under the Portfolio Specialist ONLY.
 */
const NODES: readonly DiagramNode[] = [
  { id: "request", label: "REQUEST", y: 16, w: 120 },
  { id: "orchestrator", label: "ORCHESTRATOR · INPUT GUARD", y: 84, w: 236, accent: true },
  { id: "portfolio", label: "PORTFOLIO", y: 160, w: 78, cx: COL[0] },
  { id: "errors", label: "ERROR SOLVER", y: 160, w: 78, cx: COL[1] },
  { id: "learning", label: "LEARNING", y: 160, w: 78, cx: COL[2] },
  { id: "teaching", label: "TEACHING", y: 160, w: 78, cx: COL[3] },
  { id: "tools", label: "6 TOOLS", y: 236, w: 78, cx: COL[0], accent: true },
  { id: "typed", label: "TYPED OUTPUT", y: 236, w: 160, cx: 255 },
  { id: "outguard", label: "OUTPUT GUARD", y: 304, w: 78, cx: COL[0], accent: true },
  { id: "result", label: "RESULT · TRACE", y: 380, w: 200 },
] as const;

function byId(id: string): DiagramNode {
  const found = NODES.find((n) => n.id === id);
  if (!found) throw new Error(`HeroSystemDiagram: unknown node "${id}"`);
  return found;
}

const cxOf = (n: DiagramNode) => n.cx ?? SPINE;

/** Straight vertical connector between two stacked nodes. */
function spineEdge(fromId: string, toId: string): string {
  const a = byId(fromId);
  const b = byId(toId);
  return `M ${cxOf(a)} ${a.y + NODE_H} L ${cxOf(b)} ${b.y}`;
}

/** Curved connector from the bottom of one node to the top of another. */
function branchEdge(fromId: string, toId: string): string {
  const a = byId(fromId);
  const b = byId(toId);
  const fromX = cxOf(a);
  const fromY = a.y + NODE_H;
  const toX = cxOf(b);
  const toY = b.y;
  const midY = (fromY + toY) / 2;
  return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
}

const EDGES: readonly string[] = [
  spineEdge("request", "orchestrator"),
  // Fan out: the orchestrator hands off to exactly one specialist per run.
  // No specialist-to-specialist edge exists, because none exists in the code.
  ...["portfolio", "errors", "learning", "teaching"].map((s) =>
    branchEdge("orchestrator", s)
  ),
  // The Portfolio Specialist's column: tools, then the output guardrail.
  spineEdge("portfolio", "tools"),
  spineEdge("tools", "outguard"),
  // The other three return structured objects instead.
  ...["errors", "learning", "teaching"].map((s) => branchEdge(s, "typed")),
  branchEdge("outguard", "result"),
  branchEdge("typed", "result"),
];

export default function HeroSystemDiagram() {
  return (
    <figure className="w-full max-w-[340px]">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="sysdiag-title sysdiag-desc"
        className="h-auto w-full"
      >
        <title id="sysdiag-title">Agent execution topology</title>
        {/* The description is the accessible equivalent of the picture, not a
            restatement of its caption. A screen reader user should come away
            with the same architectural understanding a sighted user does. */}
        <desc id="sysdiag-desc">
          A request enters the orchestrator, which carries a constitutional
          input guardrail and hands off to exactly one of four specialists:
          Portfolio, Error Solver, Learning or Teaching. Specialists never hand
          off to each other. Only the Portfolio Specialist calls tools, six
          read-only knowledge tools, and its free-text answer passes a
          constitutional output guardrail. The other three return typed,
          structured output. Every run returns its answer with a trace of the
          route taken and the tools called.
        </desc>

        {/* Edges first, so nodes paint over their endpoints. Two passes: a
            solid low-opacity path that is always visible, and a dashed animated
            path on top that reads as signal propagation. Splitting them is what
            makes reduced-motion safe — cancelling the animation leaves the
            solid path intact rather than a gapped, half-drawn diagram. */}
        <g fill="none" strokeLinecap="round">
          {EDGES.map((d, i) => (
            <g key={d}>
              <path d={d} className="stroke-border" strokeWidth={1} />
              <path
                d={d}
                className="animate-data-flow stroke-brand/70"
                strokeWidth={1.25}
                // Staggered so the pulse reads as travelling down the pipeline
                // rather than every edge blinking in unison.
                style={{ animationDelay: `${i * 140}ms` }}
              />
            </g>
          ))}
        </g>

        <g>
          {NODES.map((n) => {
            const cx = cxOf(n);
            return (
              <g key={n.id}>
                <rect
                  x={cx - n.w / 2}
                  y={n.y}
                  width={n.w}
                  height={NODE_H}
                  rx={6}
                  className={
                    n.accent
                      ? "fill-surface-2 stroke-brand/45"
                      : "fill-surface-1 stroke-border"
                  }
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={n.y + NODE_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  // The diagram is capped by max-w rather than allowed to scale
                  // down indefinitely: below roughly 8 units these mono labels
                  // start to fill in and stop being readable. The narrow
                  // specialist boxes sit exactly at that floor.
                  fontSize={n.w < 110 ? 8 : 9.5}
                  className={`font-mono ${
                    n.accent ? "fill-brand-soft" : "fill-muted-foreground"
                  }`}
                  style={{ letterSpacing: "0.08em" }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <figcaption className="mt-4 text-center font-mono text-[11px] leading-relaxed text-muted-foreground/70">
        Star topology — only the orchestrator routes.
        <br />
        Tools and the output guard sit on the one specialist that writes prose.
      </figcaption>
    </figure>
  );
}
