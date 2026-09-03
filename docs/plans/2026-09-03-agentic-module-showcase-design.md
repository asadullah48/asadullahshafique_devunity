# Agentic Module Showcase — Design

**Date:** 2026-09-03
**Scope:** The six-module showcase slice of the broader "elevate the portfolio into an
agentic AI demo" request. The other slices discussed and *not* built here — sitewide
ambient motion, a real live-backend interactive demo — are deliberately deferred to
later sessions; see "Not in scope" below.

## Problem

The live site's Projects section already curates six spotlight projects
(`SPOTLIGHT_IDS` in `src/components/Projects.tsx`: `orchestratorx`, `guardrailai`,
`protobridge`, `bazaar`, `agent-factory`, `devunity`) with genuinely substantive
copy — but they render as static text cards. The request asks for these to read as
"autonomous modules" / "agentic flows" rather than résumé bullet points.

**Ground-truth check (the point of this document):** four of the six
(`orchestratorx`, `guardrailai`, `protobridge`, `agent-factory`) are real multi-agent
systems with named agents in their existing `solution` copy (e.g. OrchestratorX:
RiskModeler → ComplianceChecker → ClientAdvisor → Reporter, on a LangGraph
supervisor). The other two (`bazaar`, `devunity`) are a marketplace and a community
platform — real, but not multi-agent systems. Forcing an "agent flow" label onto
them would violate CLAUDE.md's Reality Rule (§0: "Never write a capability claim
the repo cannot demonstrate on request"). The design below keeps both honest.

## Data model

New file: `src/lib/module-flows.ts`. Pure data, no JSX, no locale logic.

```ts
export type FlowKind = "agentic" | "architecture";

export type FlowNode = {
  id: string;
  label: { en: string; ar: string };
  detail: { en: string; ar: string };
};

export type FlowEdge = { from: string; to: string };

export type ModuleFlow = {
  id: string;               // matches Project.id
  kind: FlowKind;
  nodes: FlowNode[];
  edges: FlowEdge[];
  caption: { en: string; ar: string }; // Reality Rule disclaimer, worded per kind
};

export const MODULE_FLOWS: Record<string, ModuleFlow> = { /* one entry per spotlight id */ };
```

- `kind: "agentic"` → `orchestratorx`, `guardrailai`, `protobridge`, `agent-factory`.
  Node labels are lifted from each project's existing `solution` text — no new facts
  invented, only visualized.
- `kind: "architecture"` → `bazaar`, `devunity`. Same node/edge shape, different
  render (see below), never implies autonomous agents.
- A project with no entry in `MODULE_FLOWS` gets no "Inspect the system" button —
  same drop-rather-than-crash convention `SPOTLIGHT_IDS` already uses.
- Bilingual from the start, matching the existing `PROJECTS_EN`/`PROJECTS_AR`
  pattern (per explicit decision — accepted cost: two label sets can drift, same
  risk the existing locale arrays already carry).

## Visual design

Both variants are a single inline SVG (`viewBox`-scaled, no charting library — zero
new runtime dependency, consistent with the framer-motion-removal precedent of
keeping the dependency graph lean).

**Agentic variant:** circular/radial node layout (radial when the flow returns to a
supervisor, as in OrchestratorX). Edges are curved `<path>`s with an animated
`stroke-dasharray`/`stroke-dashoffset` (`@keyframes flow-dash`) — a moving-dash
"data flowing" effect. Nodes pulse once on mount via staggered `animation-delay`,
reusing the existing `animate-think-pulse` keyframe rather than adding a second
pulse animation.

**Architecture variant:** rounded rectangles in a strict top-to-bottom stack
(e.g. Storefront → API → Database), straight vertical connectors, no radial motif.
The shape difference is the point — a reader should be able to tell "agent system"
from "platform architecture" without reading the caption.

Both variants:
- Respect `prefers-reduced-motion` via the same guard block `globals.css` already
  applies to `animate-think-pulse` (drops to static, no new media-query pattern).
- Use only `--brand` / `--brand-soft` for strokes/nodes/text; `--violet` only as an
  ambient blurred glow behind the SVG, never on the diagram itself, matching
  CLAUDE.md §2's "violet is ambient-only, cyan is the only interactive color" rule.
- Render `flow.caption` beneath the diagram in `text-muted-foreground/70 text-xs` —
  not optional, not collapsible. This is the Reality Rule safeguard made visible:
  the agentic caption says these are documented, tested systems; the architecture
  caption says explicitly these are platforms, not agents.

## Interaction

New component: `ModuleFlowDialog`, wrapping the existing (currently-imported,
unused) `@/components/ui/dialog`. Props: `project: Project`, `flow: ModuleFlow`.

In `ProjectCard`, a new trigger button — `"Inspect the system"`, `Workflow`/
`GitBranch` icon from `lucide-react` — renders whenever `MODULE_FLOWS[project.id]`
exists, in *both* the Spotlight and "All Projects" views. It sits beside the
existing "View Case Study" toggle (`Projects.tsx:1486-1501`), not replacing it —
case study is prose, this is the visual diagram; both stay.

Dialog content: title + status badge → SVG diagram → caption → the existing
problem/solution/impact rows (reused, not restated) → tech chips → GitHub/demo
links (duplicated from the card footer so the dialog is self-contained). Radix's
`Dialog` already owns focus trap and Escape-to-close — no custom a11y work needed.
`DialogContent` at `max-w-2xl`, internal scroll on short viewports, SVG scales via
`viewBox` on mobile.

## i18n

Two new keys only: `projects.inspectSystem`, `projects.close`
(`src/i18n/en.json` / `ar.json`, `projects.*` namespace, matching existing keys).
Everything else in the dialog reuses labels/copy that already exist. Node labels
and captions live in `module-flows.ts` (keyed by project id), not in the i18n
files, since they're per-project facts rather than generic UI chrome.

## CSS

**Revised during implementation:** no new keyframes were needed. `globals.css`
already has a full "AI-SYSTEM MOTION PRIMITIVES" section (`animate-think-pulse`,
`animate-think-ring`, `animate-data-flow`) built for exactly this — a stroke-
dasharray/dashoffset "signal travelling" animation and a node pulse, already
covered by the existing `prefers-reduced-motion` guard, already used the same
way in `NeuralField.tsx`. `ModuleFlowDialog.tsx` reuses those classes directly.

## Interaction — one refinement made while building

Text ended up living in plain HTML `<div>`s positioned over the SVG (percentage-
based `left`/`top` + `transform: translate(...)`) rather than as SVG `<text>` —
real Arabic shaping and `dir` inheritance for free, versus SVG text's RTL/
`text-anchor` quirks. The SVG itself draws only geometry (edges, small dots).
For the radial diagram, the dot marking each node had to be its own absolutely-
positioned element pinned to the exact coordinate the edge line terminates at,
with the label positioned separately below it by a fixed pixel offset — centering
a combined dot+label block on that same coordinate pulled the dot off the line's
true endpoint and let lines visibly run through the label text (caught and fixed
during the manual browser check below).

## Verification plan — results

1. `npx tsc --noEmit` — **passed clean** (exit 0).
2. `npm run build` — **passed.** Homepage First Load JS: 218 kB → 232 kB
   (**+14 kB**). Worth stating plainly rather than burying it: this is the cost
   of `@radix-ui/react-dialog` entering the bundle for the first time — the
   `Dialog` primitives existed in `components/ui/dialog.tsx` already but had no
   caller anywhere in the app before this feature, so they were never actually
   bundled. Every other piece of this feature (the diagram, `module-flows.ts`)
   added no new dependency.
3. Manual browser check (Spotlight view, English locale): confirmed via
   screenshots — button appears on all 6 flow-mapped cards beside "View Case
   Study"; OrchestratorX's radial diagram and GuardrailAI's chain diagram both
   render correctly with the fix from the section above applied.
4. **Not yet done** (session ended before reaching it): the "All Projects" view,
   the Arabic/RTL locale, the architecture-variant diagrams (Bazaar, DevUnity)
   were not visually checked, nor was `prefers-reduced-motion`. Do this before
   calling the feature fully verified.

## Not in scope (this session)

- Sitewide ambient motion / micro-interactions beyond the Projects section.
- A backend-wired "genuinely live" interactive demo (e.g. driving the real
  orchestrator/MCP trace from the browser). Discussed as an alternative slice;
  deferred — would need its own design pass touching `backend/orchestration/`.
- Lottie/Rive integration — no animation assets exist in this repo and none were
  supplied; the diagrams here are hand-rolled SVG/CSS instead, which also avoids
  reintroducing a heavier runtime dependency after the framer-motion removal.
- Any change to `src/components/AgentEcosystem.tsx` (the existing 21-platform
  index panel) — unrelated to this per-card diagram work.
