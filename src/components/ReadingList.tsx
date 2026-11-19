import { Reveal } from "@/components/Reveal";

type Item = { title: string; url?: string; desc?: string };

const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "Guides",
    items: [
      {
        title: "Building Effective Agents — Anthropic",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        desc: "The supervisor pattern in OrchestratorX matches this guide. Routing is typed state, not prompt text.",
      },
      {
        title: "Claude Code Best Practices — Anthropic",
        url: "https://code.claude.com/docs/en/best-practices",
        desc: "Close to the spec-first method I used across the Panaversity hackathons H0–H5: plan first, then build in small verified steps.",
      },
      {
        title: "A Practical Guide to Building Agents — OpenAI",
        url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
        desc: "Its layered guardrails idea matches GuardrailAI: a separate deterministic check layer that sits outside the model.",
      },
      {
        title: "Agents Whitepaper — Google (Kaggle)",
        url: "https://www.kaggle.com/whitepaper-agents",
        desc: "Its tools, memory and orchestration split maps closely to the \"harness\" in my harness × loop × graph framework.",
      },
      {
        title: "Agents Companion — Google (Kaggle)",
        url: "https://www.kaggle.com/whitepaper-agent-companion",
        desc: "Its evaluation and agent-ops sections match the approach of the Agent Failure Atlas: record the failure, make it reproducible, then fix it.",
      },
    ],
  },
  {
    heading: "Research papers",
    items: [
      {
        title: "ReAct (Yao et al., 2022)",
        url: "https://arxiv.org/abs/2210.03629",
        desc: "The think → act → observe loop. The base pattern I start from when designing agent loops.",
      },
      {
        title: "Chain-of-Thought Prompting (Wei et al., 2022)",
        url: "https://arxiv.org/abs/2201.11903",
        desc: "Step-by-step reasoning made visible. A related idea in GuardrailAI: every decision is written to a hash-chained audit ledger so it can be checked later.",
      },
      {
        title: "Toolformer (Schick et al., 2023)",
        url: "https://arxiv.org/abs/2302.04761",
        desc: "Shaped how I think about tools: small, clear interfaces that a model can call correctly, like the MCP tools in ProtoBridge.",
      },
      {
        title: "Generative Agents (Park et al., 2023)",
        url: "https://arxiv.org/abs/2304.03442",
        desc: "Memory, reflection and planning as separate parts. A useful split when designing agent memory.",
      },
    ],
  },
  {
    heading: "Reading next",
    items: [
      { title: "Understanding Deep Learning", url: "https://udlbook.github.io/udlbook/" },
      {
        title: "Build a Large Language Model (From Scratch)",
        url: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
      },
      { title: "AI Engineering (Chip Huyen, O'Reilly)" },
    ],
  },
];

function Title({ title, url, bold }: Item & { bold?: boolean }) {
  const weight = bold ? "font-bold" : "";
  if (!url) return <span className={`${weight} text-foreground`}>{title}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${weight} text-brand underline-offset-4 hover:underline focus-visible:underline`}
    >
      {title}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function ReadingList() {
  return (
    <section id="reading" className="py-24 bg-surface-1">
      <div className="container mx-auto px-6">
        <Reveal className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What shaped how I build agents
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            A short list of the guides and papers behind the patterns in my projects.
          </p>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-12 text-sm leading-relaxed">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <h3 className="mb-4 text-xl font-semibold text-foreground">{g.heading}</h3>
              <ul className="space-y-4">
                {g.items.map((item) => (
                  <li key={item.title}>
                    {/* Described items (guides, papers) get a bold title; "Reading next" is a plain link list. */}
                    <Title {...item} bold={!!item.desc} />
                    {item.desc && <p className="mt-1 text-muted-foreground">{item.desc}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
