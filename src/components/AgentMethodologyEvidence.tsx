import { ArrowUpRight } from "lucide-react";

export const METHODOLOGY_TITLES = {
  harness: "Harness → GuardrailAI + ProtoBridge",
  loop: "Loop → evals/cases + per-repo test suites",
  graph: "Graph → OrchestratorX",
} as const;

type Pillar = keyof typeof METHODOLOGY_TITLES;

const PORTFOLIO = "https://github.com/asadullah48/asadullahshafique_devunity";

const examples = {
  harness: [
    {
      name: "GuardrailAI",
      detail: "deterministic pre-model checks",
      href: "https://github.com/asadullah48/guardrailai/tree/69dd5d9",
    },
    {
      name: "ProtoBridge",
      detail: "protocol-level tool access",
      href: "https://github.com/asadullah48/protobridge/tree/69cd28a",
    },
  ],
  loop: [
    {
      name: "evals/cases",
      detail: "trace-checked evals",
      href: `${PORTFOLIO}/tree/main/evals/cases`,
    },
  ],
  graph: [
    {
      name: "OrchestratorX",
      detail: "typed supervisor routing",
      href: "https://github.com/asadullah48/orchestratorx/tree/1ca950a",
    },
  ],
};

const testSuites = [
  { name: "OrchestratorX", detail: "41 tests · 1ca950a", href: "https://github.com/asadullah48/orchestratorx/tree/1ca950a/tests" },
  { name: "GuardrailAI", detail: "42 tests · 69dd5d9", href: "https://github.com/asadullah48/guardrailai/tree/69dd5d9" },
  { name: "ProtoBridge", detail: "74 tests · verified 3 Nov 2026 · 69cd28a", href: "https://github.com/asadullah48/protobridge/blob/69cd28a/README.md" },
  { name: "Portfolio backend", detail: "49 tests", href: `${PORTFOLIO}/tree/main/backend/tests` },
];

function Sources({ items, label }: { items: typeof testSuites; label: string }) {
  return (
    <ul aria-label={label} className="space-y-1">
      {items.map(({ name, detail, href }) => (
        <li key={name}>
          <a href={href} className="inline-flex items-center gap-1 font-mono text-brand underline-offset-4 hover:underline">
            {name}
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          <span className="text-muted-foreground"> · {detail}</span>
        </li>
      ))}
    </ul>
  );
}

export function AgentMethodologyEvidence({ pillar }: { pillar: Pillar }) {
  return (
    <div className="mt-4 text-sm">
      <Sources items={examples[pillar]} label={METHODOLOGY_TITLES[pillar]} />
      {pillar === "loop" && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Per-repo test suites · REPORTED runs</p>
          <Sources items={testSuites} label="Per-repo test suites" />
        </div>
      )}
    </div>
  );
}
