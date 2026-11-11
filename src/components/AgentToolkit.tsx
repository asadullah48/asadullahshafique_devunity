const source = "https://github.com/asadullah48/asadullahshafique_devunity/blob/2dcd8a6";

const tools = [
  {
    name: "OpenAI Agents SDK",
    use: "I use a triage agent to hand a request to one specialist, with typed shared context and a fallback when the SDK or model is unavailable.",
    path: "backend/orchestration/orchestrator.py",
  },
  {
    name: "MCP · FastMCP",
    use: "I expose portfolio data as tools through a FastMCP server over Streamable HTTP. The older REST endpoints are a separate compatibility layer.",
    path: "backend/mcp_server.py",
  },
  {
    name: "Guardrails",
    use: "I check requests against written rules before a model call. These deterministic checks have limits; they do not guarantee that every answer is safe or correct.",
    path: "backend/constitution/__init__.py",
  },
  {
    name: "Evals and regression tests",
    use: "I check routing, tool calls and answer content, with a separate model judge for response quality. Model-based evals need a configured provider; source code alone is not a passing result.",
    path: "evals/README.md",
  },
];

export default function AgentToolkit() {
  return (
    <section id="agent-toolkit" aria-labelledby="agent-toolkit-title" className="container mx-auto scroll-mt-24 px-6 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-brand">Tools with source evidence</p>
      <h2 id="agent-toolkit-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">My agent toolkit</h2>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        These are tools I use in this portfolio’s backend. Each link shows the implementation and what I use it for.
      </p>
      <dl className="mt-8 divide-y divide-border border-y border-border">
        {tools.map((tool) => (
          <div key={tool.name} className="grid gap-3 py-6 md:grid-cols-[15rem_1fr] md:gap-8">
            <dt className="font-semibold">{tool.name}</dt>
            <dd className="min-w-0">
              <p className="max-w-3xl text-muted-foreground">{tool.use}</p>
              <a href={`${source}/${tool.path}`} className="mt-3 inline-block rounded-sm text-sm text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                View {tool.name} source →
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
        My open-source multi-agent reference projects use synthetic data. They are learning and engineering examples, not evidence of production customers or paid client results.
      </p>
      <a href="/how-i-build-agents" className="mt-4 inline-block rounded-sm text-sm text-brand underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        See my approach and project evidence →
      </a>
    </section>
  );
}
