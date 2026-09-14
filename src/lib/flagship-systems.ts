export type FlagshipSystem = {
  slug: "orchestratorx" | "protobridge" | "guardrailai";
  name: string;
  thesis: string;
  summary: string;
  problem: string;
  decision: string;
  architecture: string[];
  invariants: string[];
  verification: { label: string; href: string; detail: string }[];
  limitations: string[];
  enterpriseNext: string[];
  stack: string[];
  repository: string;
  accent: string;
};

export const FLAGSHIP_SYSTEMS: readonly FlagshipSystem[] = [
  {
    slug: "orchestratorx",
    name: "OrchestratorX",
    thesis: "Routing as a testable invariant, not a prompt.",
    summary: "A supervisor-pattern multi-agent framework that keeps routing in typed state and plain Python so execution order can be tested without a model or API key.",
    problem: "When routing, retry behaviour, and completion rules live inside prompts, the most important system behaviour becomes probabilistic and difficult to explain after a run.",
    decision: "A single supervisor owns every transition. Specialists return to the supervisor, never directly to one another, and every hop is written to an audit trace.",
    architecture: ["Request", "Supervisor", "Specialist", "Verification", "Recorded result"],
    invariants: [
      "Only the supervisor selects the next node.",
      "Required specialists run before reporting.",
      "A hop budget guarantees termination.",
      "Failures remain visible in the ordered trace.",
      "Concurrent runs isolate breaker state by run identifier."
    ],
    verification: [
      { label: "Routing tests", href: "https://github.com/asadullah48/orchestratorx/tree/main/tests", detail: "Model-free assertions for routing and termination behaviour." },
      { label: "Source repository", href: "https://github.com/asadullah48/orchestratorx", detail: "Framework, API service, CLI, Docker configuration, and CI." }
    ],
    limitations: [
      "Reference architecture, not evidence of a customer production deployment.",
      "Business-specific escalation policy must be supplied by the adopting organisation.",
      "Operational SLOs require measurement in the target environment."
    ],
    enterpriseNext: ["Connect organisation-specific tools.", "Define escalation and approval policy.", "Add production telemetry and service objectives."],
    stack: ["LangGraph", "Python", "Pydantic", "FastAPI", "Docker", "pytest"],
    repository: "https://github.com/asadullah48/orchestratorx",
    accent: "Orchestration"
  },
  {
    slug: "protobridge",
    name: "ProtoBridge",
    thesis: "Governance that survives a protocol boundary.",
    summary: "An interoperability layer that normalises MCP and A2A messages into one governed envelope before dispatch and inspects the result again on return.",
    problem: "MCP connects agents to tools while A2A connects agents to other agents. Ad-hoc translation loses identity, sensitivity, and correlation context at exactly the boundary an auditor needs to inspect.",
    decision: "Every message is lifted into one ProtocolEnvelope. Governance travels inside the message, while codec pairs handle wire-level MCP and A2A transport.",
    architecture: ["Inbound protocol", "Normalised envelope", "Policy inspection", "MCP or A2A dispatch", "Egress inspection"],
    invariants: [
      "Protocol translation does not discard governance context.",
      "Ingress and egress are inspected separately.",
      "The audit ledger stores payload digests rather than sensitive payloads.",
      "Adding a protocol requires one codec pair, not pairwise translators."
    ],
    verification: [
      { label: "Protocol implementation", href: "https://github.com/asadullah48/protobridge/tree/main/src/protobridge/protocols", detail: "MCP and A2A codecs and transport implementations." },
      { label: "Interactive verification", href: "https://asadullah48.github.io/protobridge/", detail: "Browser-side replay and digest verification for published traces." }
    ],
    limitations: [
      "Published demonstrations use controlled traces rather than a customer's private traffic.",
      "Policy rules are seams for adoption, not a universal compliance programme.",
      "Cross-company identity and key management remain deployment responsibilities."
    ],
    enterpriseNext: ["Integrate enterprise identity.", "Map data classifications to policy.", "Connect production MCP servers and A2A peers."],
    stack: ["MCP", "A2A", "JSON-RPC 2.0", "LangGraph", "Python", "Pydantic"],
    repository: "https://github.com/asadullah48/protobridge",
    accent: "Interoperability"
  },
  {
    slug: "guardrailai",
    name: "GuardrailAI",
    thesis: "Controls the model cannot negotiate away.",
    summary: "A compliance-oriented reference framework that places deterministic checks, execution bounds, circuit breakers, and a hash-chained audit ledger around probabilistic agents.",
    problem: "Prompt-only safety instructions are not hard controls. High-consequence workflows need explicit ceilings, refusal paths, bounded execution, and records that can be examined after the model responds.",
    decision: "Deterministic pre-flight and post-flight checks sit outside the model. Circuit breakers select safe fallbacks, while each transition contributes to a tamper-evident ledger.",
    architecture: ["Request", "Pre-flight controls", "Bounded agent work", "Post-flight controls", "Audit certificate"],
    invariants: [
      "Deterministic rules run before model execution.",
      "Agent work has explicit mathematical bounds.",
      "Post-flight thresholds can refuse unsafe output.",
      "Circuit breakers degrade to defined fallbacks.",
      "Audit entries are linked by cryptographic hashes."
    ],
    verification: [
      { label: "Guardrail source", href: "https://github.com/asadullah48/guardrailai/tree/main/guardrailai/guardrails", detail: "Deterministic policy implementations and enforcement boundaries." },
      { label: "Source repository", href: "https://github.com/asadullah48/guardrailai", detail: "Framework, tests, deployment assets, and documentation." }
    ],
    limitations: [
      "A technical reference is not a certification or legal compliance determination.",
      "Rules must be reviewed and maintained by qualified domain owners.",
      "Hash chaining supports tamper evidence; it does not replace access control or retention policy."
    ],
    enterpriseNext: ["Validate rules with domain counsel.", "Integrate authoritative policy sources.", "Add access control, retention, monitoring, and incident procedures."],
    stack: ["FastAPI", "Python", "LangGraph", "SHA-256", "Circuit Breakers", "Docker"],
    repository: "https://github.com/asadullah48/guardrailai",
    accent: "Governance"
  }
] as const;

export function getFlagshipSystem(slug: string) {
  return FLAGSHIP_SYSTEMS.find((system) => system.slug === slug);
}
