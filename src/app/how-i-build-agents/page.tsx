import type { Metadata } from "next";
import { AgentMethodologyEvidence, METHODOLOGY_TITLES } from "@/components/AgentMethodologyEvidence";

export const metadata: Metadata = {
  title: "How I Build Agents | Asadullah Shafique",
  description: "Harness, loop, and graph: controls, tests, and routing in my synthetic-data reference projects.",
  alternates: { canonical: "/how-i-build-agents" },
};

export default function HowIBuildAgentsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
      <header className="mb-12">
        <p className="font-mono text-sm text-brand">Harness → Loop → Graph</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">How I build agents</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          I start with the controls around an agent, check its behaviour, then make routing explicit.
          These open-source reference projects use synthetic data to demonstrate each part of the build.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          The counts below are reported test runs from the linked repositories and portfolio evidence.
        </p>
      </header>
      <div className="space-y-8">
        <section aria-labelledby="harness" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="harness" className="font-display text-2xl font-semibold">{METHODOLOGY_TITLES.harness}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            GuardrailAI runs deterministic checks before the model. Its reference API has no authentication
            or authorization layer, and its hash-chained audit ledger lives in memory. ProtoBridge shows
            protocol-level tool access through MCP and agent-to-agent requests through A2A. Its bundled
            tools and Twenty CRM tests use synthetic, offline fixtures.
          </p>
          <AgentMethodologyEvidence pillar="harness" />
        </section>
        <section aria-labelledby="loop" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="loop" className="font-display text-2xl font-semibold">{METHODOLOGY_TITLES.loop}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Run a case, inspect the failure, change the code, and run it again. The portfolio eval cases
            check which tools and routes the agent used. The eval README records that model quality
            still needs a run. Each repository also has a suite for testing its code.
          </p>
          <AgentMethodologyEvidence pillar="loop" />
        </section>
        <section aria-labelledby="graph" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="graph" className="font-display text-2xl font-semibold">{METHODOLOGY_TITLES.graph}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            OrchestratorX uses a supervisor and typed state to choose which specialist runs next.
            A hop budget bounds execution, and its routing tests run offline.
          </p>
          <AgentMethodologyEvidence pillar="graph" />
        </section>
      </div>
    </div>
  );
}