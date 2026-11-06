import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How I Build Agents | Asadullah Shafique",
  description: "Harness, loop, and graph: controls, tests, and routing in my synthetic-data reference projects.",
  alternates: { canonical: "/how-i-build-agents" },
};

// Copied from the default-branch READMEs fetched on 6 Nov 2026.
// Recorded runs in those repositories; not new runs performed by this page.
const evidence = {
  guardrailai: {
    name: "GuardrailAI",
    repo: "https://github.com/asadullah48/guardrailai",
    result: "53 tests passed on 30 Oct 2026",
    detail: "README wording: Verified locally.",
    blob: "8ed80f481d92ce2e5180f9012223343c5c6dcba5",
  },
  orchestratorx: {
    name: "OrchestratorX",
    repo: "https://github.com/asadullah48/orchestratorx",
    result: "65 passing, verified 30 Oct 2026",
    detail: "pytest -q; code commit 8bf2d86.",
    blob: "67542f627bed5e3ccc69547cdc21b3c4e9a781a1",
  },
  protobridge: {
    name: "ProtoBridge",
    repo: "https://github.com/asadullah48/protobridge",
    result: "74 tests passing, verified 3 Nov 2026",
    detail: "uv run pytest -q; commit 69cd28a.",
    blob: "7f687ff7cffdbe44f349d4c1100528cc0a87ef1b",
  },
};

function RepoEvidence({ project }: { project: keyof typeof evidence }) {
  const item = evidence[project];
  return (
    <div className="mt-6 border-t border-border pt-4 text-sm">
      <a className="font-medium text-brand underline underline-offset-4" href={item.repo}>
        {item.name} repository
      </a>
      <p className="mt-2">REPORTED — README-verified test run: {item.result}.</p>
      <p className="mt-1 text-muted-foreground">{item.detail}</p>
      <a className="mt-2 inline-block text-brand underline underline-offset-4" href={`${item.repo}/blob/main/README.md`}>
        Read the source README
      </a>
    </div>
  );
}

export default function HowIBuildAgentsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
      <header className="mb-12">
        <p className="font-mono text-sm text-brand">Harness → Loop → Graph</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">How I build agents</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          I start with the controls around an agent, check its behaviour, then make routing explicit.
          These open-source reference projects use synthetic data. They demonstrate engineering ideas;
          they do not establish production readiness.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Test counts and dates below come from each repository&apos;s README, fetched on 6 Nov 2026.
          They are reported verification records, not new test runs of those repositories.
        </p>
      </header>
      <div className="space-y-8">
        <section aria-labelledby="harness" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="harness" className="font-display text-2xl font-semibold">Harness → GuardrailAI</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The harness is the code around the agent: which tools it can use, what permissions it needs,
            and what gets recorded. GuardrailAI demonstrates explicit checks before and after processing,
            fallback routing, and a SHA-256 hash-chained audit ledger that can reveal edits.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Its current API has no authentication or authorization layer. Tool permissions would need
            to be added for a deployment. The ledger lives in memory, and its synthetic rule examples
            do not establish legal or compliance coverage.
          </p>
          <RepoEvidence project="guardrailai" />
        </section>
        <section aria-labelledby="loop" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="loop" className="font-display text-2xl font-semibold">Loop → Test suites and evals</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The loop is to run a case, inspect the failure, change the code, and run it again.
            OrchestratorX tests routing and stopping rules without a live model. Those tests check
            code behaviour; agent evals also need to check tool use and whether an answer matches its sources.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This portfolio&apos;s eval harness separates trace checks from model-judged answers.
            Its README records an unverified repair and says model quality still needs a run.
            A test count alone is not an eval score.
          </p>
          <a className="mt-4 inline-block text-brand underline underline-offset-4" href="https://github.com/asadullah48/asadullahshafique_devunity/tree/main/evals">
            Portfolio eval suites and recorded limits
          </a>
          <RepoEvidence project="orchestratorx" />
        </section>
        <section aria-labelledby="graph" className="rounded-panel border border-border bg-surface-1 p-6 sm:p-8">
          <h2 id="graph" className="font-display text-2xl font-semibold">Graph → OrchestratorX and ProtoBridge</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The graph makes the next step visible. OrchestratorX uses a supervisor and typed state to
            choose which specialist runs next, with a hop budget to bound execution. ProtoBridge explores
            protocol interoperability: an envelope selects an MCP tool call or an A2A agent request,
            with checks at entry and return.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            These are separate reference projects. ProtoBridge&apos;s bundled tools, vendors, and responses
            use synthetic fixtures; its Twenty CRM adapter is tested against offline fixtures.
          </p>
          <RepoEvidence project="orchestratorx" />
          <RepoEvidence project="protobridge" />
        </section>
      </div>
    </div>
  );
}