/**
 * VERIFIED EVIDENCE — the single source for every quantified claim the site
 * makes about its own engineering.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE EXISTS
 * ---------------------------------------------------------------------------
 * An audit of this repository on 2026-09-10 found the portfolio presenting
 * simulation output as measured business outcome. Three examples, each
 * traced to source:
 *
 *   actionnews/core/feed_aggregator_engine.py:13
 *       "FeedAggregatorEngine: Simulates continuous multi-stream ingestion"
 *       SAMPLE_SOURCES = ["Bloomberg Terminal Feed", "Reuters Macro Wire", ...]
 *   actionnews/agents/advisor_agent.py:17    conviction_score=94.5
 *   stockai/core/demand_forecaster.py:23     confidence_interval_percent=96.4
 *
 * The site rendered those as "94.5% peak trade conviction" and "96.4% forecast
 * accuracy" — figures a reviewer would read as measured. They are literals.
 *
 * The damage is not local. A reviewer's path is: read claim -> open GitHub ->
 * read file. Once one metric is shown to be decorative, the genuinely strong
 * work (OrchestratorX's model-free routing, ProtoBridge's wire-level MCP+A2A)
 * gets discounted by association. Unverifiable numbers are not neutral
 * decoration; they are a tax levied on the real evidence.
 *
 * ---------------------------------------------------------------------------
 * THE RULE THIS FILE ENFORCES
 * ---------------------------------------------------------------------------
 * `source` is a REQUIRED field on Evidence. There is no way to add a claim here
 * without stating where a stranger can go to check it. That converts the
 * Reality Rule in CLAUDE.md from a habit into a compile error.
 *
 * Before adding an entry, ask: could a hostile reviewer verify this in under
 * a minute, without asking me for anything? If not, it does not belong here.
 * A qualitative claim that is true ("multi-agent orchestration") always beats
 * a quantitative one that cannot be checked.
 */

/** Where a claim can be independently checked. */
export type VerificationSource =
  /** A live production endpoint anyone can curl right now. Strongest form. */
  | { kind: "live"; url: string; note: string }
  /** A public repository, optionally a specific path inside it. */
  | { kind: "repo"; slug: string; path?: string }
  /** A path inside THIS repository. */
  | { kind: "local"; path: string };

export type Evidence = {
  id: string;
  /** Short label for the proof strip. */
  label: string;
  /**
   * The headline figure. Kept as a string, not a number: several of these are
   * legitimately qualitative ("MCP + A2A"), and forcing them into a numeric
   * type is what tempts an author to invent a percentage to fill the slot.
   */
  value: string;
  /** One line on why this matters to a reviewer. No marketing adjectives. */
  detail: string;
  source: VerificationSource;
  /**
   * Arabic copy, co-located rather than pushed into src/i18n/ar.json.
   *
   * Short UI chrome ("Verify", section headings) belongs in the locale files.
   * This prose does not: it is bound to `source`, and a claim whose wording
   * lives three files away from the evidence that backs it is exactly how the
   * two drift apart. Keeping the pair adjacent means editing a claim and
   * editing its translation are the same edit. The codebase already sets this
   * precedent with PROJECTS_EN / PROJECTS_AR in Projects.tsx.
   */
  ar?: { label: string; value: string; detail: string };
};

const OWNER = "asadullah48";
const THIS_REPO = "asadullahshafique_devunity";

/** Renders a source as a human-readable "where to check this" string. */
export function sourceLabel(s: VerificationSource): string {
  switch (s.kind) {
    case "live":
      return s.note;
    case "repo":
      return s.path ? `${s.slug}/${s.path}` : `github.com/${OWNER}`;
    case "local":
      return s.path;
  }
}

/** Resolves a source to a clickable URL. */
export function sourceHref(s: VerificationSource): string {
  switch (s.kind) {
    case "live":
      return s.url;
    case "repo":
      if (!s.slug) return `https://github.com/${OWNER}?tab=repositories`;
      return `https://github.com/${OWNER}/${s.slug}${
        s.path ? `/tree/main/${s.path}` : ""
      }`;
    case "local":
      return `https://github.com/${OWNER}/${THIS_REPO}/tree/main/${s.path}`;
  }
}

/**
 * THE PROOF STRIP — five claims, each independently checkable.
 *
 * Deliberately NOT here: "85% code reuse" (self-reported, nothing measures it)
 * and "149+ tests passing" (traces to ONE hackathon project, presented as a
 * career-wide total). Both were in the hero. Neither survives the question
 * "where would a stranger check that?".
 */
export const PROOF: readonly Evidence[] = [
  {
    id: "orchestration",
    label: "Orchestration",
    value: "SDK + 4 specialists",
    detail:
      "A triage orchestrator routing to four typed specialists on the OpenAI Agents SDK. The live endpoint computes on every request whether that SDK path is available.",
    // `orchestration.available` is computed per request. `specialists[]` in the
    // same response is a literal list in backend/main.py, so it is NOT cited
    // as evidence of anything running — see the note in AgentRuntime.tsx.
    source: {
      kind: "live",
      url: "https://asadullahshafique-devunity.onrender.com/api/agent/info",
      note: "GET /api/agent/info → orchestration.available",
    },
  },
  {
    id: "interop",
    label: "Interoperability",
    value: "6 MCP tools",
    detail:
      "A real FastMCP server on the official SDK over Streamable HTTP — handshake, capability negotiation, tools/call. Not a REST route named /mcp.",
    // Was the live /api/agent/info `tools[]` — but that field is a literal list
    // in main.py, not a handshake with the MCP server. The server definition
    // itself is the checkable artefact.
    source: { kind: "local", path: "backend/mcp_server.py" },
  },
  {
    id: "governance",
    label: "Governance",
    value: "5 principles",
    detail:
      "A written constitution enforced as SDK guardrails — three on input, two on output. The deterministic pattern layer needs no model, so it holds even when every provider is down.",
    source: { kind: "local", path: "backend/constitution/principles.json" },
  },
  {
    id: "evaluation",
    label: "Evaluation",
    value: "3 eval suites",
    detail:
      "Routing, constitution and portfolio suites scored on the execution trace, not only the prose — which is what catches an agent answering fluently instead of calling its tool.",
    source: { kind: "local", path: "evals/cases" },
  },
  {
    id: "open-source",
    label: "Open source",
    value: "29 public repos",
    detail:
      "Every system named on this site links to source. All 29 links were re-checked against the GitHub API on 2026-09-11 and resolve to public repositories.",
    source: { kind: "repo", slug: "" },
  },
] as const;

/**
 * ENGINEERING EVIDENCE — the deeper layer, one entry per discipline.
 *
 * Each `value` is a fact measured during the 2026-09-10 audit by reading the
 * repositories, not a figure carried over from existing marketing copy. Test
 * counts are `def test_` occurrences counted from the GitHub trees API. Where
 * the site previously claimed a different number the MEASURED one is kept —
 * including the two cases where measurement came in higher than the claim
 * (ProtoBridge claimed 41, has 61).
 */
export const ENGINEERING_EVIDENCE: readonly Evidence[] = [
  {
    id: "model-free-routing",
    label: "Deterministic routing",
    value: "39 tests · 0 API keys",
    detail:
      "OrchestratorX keeps routing in typed state and plain Python, never in a prompt. That turns “the supervisor never skips ComplianceChecker” from a README claim into a millisecond CI assertion that runs offline.",
    source: { kind: "repo", slug: "orchestratorx", path: "tests" },
    ar: {
      label: "التوجيه الحتمي",
      value: "39 اختباراً · 0 مفاتيح API",
      detail:
        "يُبقي OrchestratorX منطق التوجيه داخل حالة مُصنّفة وكود Python صريح، لا داخل موجّه نصي. هذا ما يحوّل عبارة «المنسّق لا يتخطى ComplianceChecker أبداً» من ادعاء في ملف README إلى تأكيد يُنفَّذ في أجزاء من الثانية وبدون اتصال بالشبكة.",
    },
  },
  {
    id: "protocol-wire",
    label: "Protocol interop",
    value: "61 tests · MCP + A2A",
    detail:
      "ProtoBridge implements both protocols to the wire — real JSON-RPC over stdio in a subprocess, and a real HTTP peer serving an Agent Card — rather than simulating them. Governance rides inside the envelope, because transport headers do not survive an stdio hop.",
    source: {
      kind: "repo",
      slug: "protobridge",
      path: "src/protobridge/protocols",
    },
    ar: {
      label: "التشغيل البيني للبروتوكولات",
      value: "61 اختباراً · MCP + A2A",
      detail:
        "ينفّذ ProtoBridge البروتوكولين على مستوى السلك فعلياً — JSON-RPC حقيقي عبر stdio في عملية فرعية، ونظير HTTP حقيقي يقدّم Agent Card — بدلاً من محاكاتهما. وتنتقل الحوكمة داخل الظرف نفسه، لأن ترويسات النقل لا تنجو من قفزة stdio.",
    },
  },
  {
    id: "compliance",
    label: "Deterministic guardrails",
    value: "17 tests · 3 domains",
    detail:
      "GuardrailAI screens OFAC, AML and HIPAA Safe Harbor in plain Python before a model is reached. A control a model can argue its way past is not a control.",
    source: { kind: "repo", slug: "guardrailai", path: "guardrailai/guardrails" },
    ar: {
      label: "حواجز حماية حتمية",
      value: "17 اختباراً · 3 مجالات",
      detail:
        "يفحص GuardrailAI قوائم OFAC ومكافحة غسل الأموال وHIPAA Safe Harbor بكود Python صريح قبل الوصول إلى أي نموذج. فالضابط الذي يستطيع النموذج التحايل عليه بالحجّة ليس ضابطاً.",
    },
  },
  {
    id: "backend-tests",
    label: "Service tests",
    // Measured 2026-09-11 with the SQLite override (CLAUDE.md §1): 41 collected,
    // 33 pass, 8 fail — the documented clean-tree baseline (contact x5, GitHub
    // stats x2, health x1). backend-ci.yml runs `pytest -v || echo`, so the
    // step cannot fail the build. The previous copy ("under test on every
    // push") was literally true and left both facts out; a failure count
    // stated plainly reads as engineering, one discovered by a reviewer reads
    // as concealment.
    value: "41 tests · 33 pass",
    detail:
      "The FastAPI service behind this site — agent, MCP, contact, blog, GitHub and health paths. 8 tests fail on a clean tree (contact, GitHub stats, health), and CI runs the suite without blocking the build. Both are known and stated, not rounded away.",
    source: { kind: "local", path: "backend/tests" },
    ar: {
      label: "اختبارات الخدمة",
      value: "41 اختباراً · 33 ناجحاً",
      detail:
        "خدمة FastAPI التي تشغّل هذا الموقع — مسارات الوكيل وMCP والتواصل والمدونة وGitHub والصحة. ثمانية اختبارات تفشل على شجرة نظيفة (التواصل وإحصاءات GitHub والصحة)، ويشغّل التكامل المستمر المجموعة دون أن يوقف البناء. كلا الأمرين معروف ومذكور صراحةً، لا مُقرَّب أو مُخفى.",
    },
  },
  {
    id: "degradation",
    label: "Graceful degradation",
    value: "3-rung fallback",
    detail:
      "Agents SDK, then LangGraph, then static keyword answers. A dead key or an exhausted quota drops a rung instead of returning a 500, so the deployed site never hangs on a spinner because a provider is down.",
    source: { kind: "local", path: "backend/agent.py" },
    ar: {
      label: "تدهور تدريجي آمن",
      value: "ثلاث درجات احتياطية",
      detail:
        "حزمة Agents SDK، ثم LangGraph، ثم إجابات ثابتة بالكلمات المفتاحية. المفتاح المعطّل أو الحصة المستنفدة يُنزل المستوى درجة بدلاً من إرجاع خطأ 500، فلا يعلق الموقع المنشور على مؤشر تحميل لأن مزوّداً ما متوقف.",
    },
  },
  {
    id: "observability",
    label: "Auditable runs",
    value: "route + tool_calls",
    detail:
      "Typed shared state records which specialist ran and which tools it called, so a run can be explained after the fact — and so an eval can fail an answer that was fluent but never touched its tool.",
    source: { kind: "local", path: "backend/orchestration/context.py" },
    ar: {
      label: "عمليات قابلة للتدقيق",
      value: "route + tool_calls",
      detail:
        "تسجّل الحالة المُصنّفة المشتركة أي وكيل متخصص نُفِّذ وأي أدوات استدعى، بحيث يمكن شرح أي تشغيل لاحقاً — وبحيث يستطيع التقييم أن يُرسِب إجابة بليغة لم تلمس أداتها قط.",
    },
  },
] as const;
