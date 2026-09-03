/**
 * Per-project flow data for the "Inspect the system" dialog on the six
 * Projects.tsx spotlight cards (see docs/plans/2026-09-03-agentic-module-
 * showcase-design.md for the full design).
 *
 * Every node/edge here is lifted from copy that already exists in
 * Projects.tsx's `solution` fields — nothing here introduces a new claim
 * about what a system does. This file only decides how to DRAW facts that
 * are already written down.
 *
 * `kind` is the Reality Rule guard: "agentic" is reserved for projects whose
 * existing copy names real, separate agents with a routing relationship
 * (OrchestratorX, GuardrailAI, ProtoBridge, Agent Factory). "architecture"
 * is for real systems that are NOT multi-agent (Bazaar, DevUnity) — giving
 * them an agent-shaped diagram would be exactly the overclaim CLAUDE.md §0
 * forbids. The two kinds render with different node shapes (circles vs.
 * rounded rectangles) so the distinction is visible without reading the
 * caption, and `caption` states it in words too, for the reader who is
 * scanning rather than looking closely.
 *
 * `layout` is a rendering choice, independent of `kind`:
 *   - "radial": a supervisor/hub in the center with satellites around it.
 *     Reserved for OrchestratorX, because that IS its real topology —
 *     "Specialist agents ... return only to the supervisor and never to
 *     each other" is a literal star graph, not an artistic choice.
 *   - "chain": a straight vertical sequence. Used for everything else,
 *     including both architecture cards. Vertical (not left-to-right) is
 *     deliberate: a top-to-bottom stack reads identically in LTR and RTL,
 *     so the diagram needs no mirroring logic for the Arabic locale — the
 *     same reason NeuralField.tsx's ambient graph never had to worry about
 *     `dir`. A chain generally simplifies a real pipeline (e.g. ProtoBridge
 *     actually branches between MCPConnector and A2AGateway); `caption`
 *     already labels every diagram here as a static illustration rather
 *     than a literal call graph, so the simplification is not a hidden one.
 *
 * Agent/service names (RiskModeler, MCPConnector, PostgreSQL, ...) are kept
 * in Latin script for both locales, matching the precedent already set in
 * AgentEcosystem.tsx ("Only the prose is localized... name/slug... Never
 * translated"). Only `detail` — the one-line elaboration — is real Arabic
 * prose, so the Arabic reader gets translated substance, not a transliterated
 * class name.
 */

export type FlowKind = "agentic" | "architecture";
export type FlowLayout = "radial" | "chain";

export type FlowNode = {
  id: string;
  label: { en: string; ar: string };
  detail: { en: string; ar: string };
};

export type FlowEdge = { from: string; to: string };

export type ModuleFlow = {
  id: string;
  kind: FlowKind;
  layout: FlowLayout;
  nodes: FlowNode[];
  edges: FlowEdge[];
  caption: { en: string; ar: string };
};

const AGENTIC_CAPTION = {
  en: "A static diagram of the documented multi-agent design above — illustrating the real, tested architecture, not a live execution trace.",
  ar: "رسم تخطيطي ثابت للتصميم المتعدد الوكلاء الموثّق أعلاه — يوضّح البنية الحقيقية والمختبرة، لا أثر تنفيذ حي.",
} as const;

const ARCHITECTURE_CAPTION = {
  en: "A static diagram of this platform's real architecture — a system, not a multi-agent framework.",
  ar: "رسم تخطيطي ثابت للبنية الحقيقية لهذه المنصة — نظام وليس إطار عمل متعدد الوكلاء.",
} as const;

export const MODULE_FLOWS: Record<string, ModuleFlow> = {
  orchestratorx: {
    id: "orchestratorx",
    kind: "agentic",
    layout: "radial",
    nodes: [
      { id: "supervisor", label: { en: "Supervisor", ar: "Supervisor" }, detail: { en: "The only node that routes — every hop starts here.", ar: "العقدة الوحيدة التي توجّه — كل قفزة تبدأ منها." } },
      { id: "riskmodeler", label: { en: "RiskModeler", ar: "RiskModeler" }, detail: { en: "Quantifies exposure before a report can ship.", ar: "يقيس حجم المخاطر قبل إصدار أي تقرير." } },
      { id: "compliancechecker", label: { en: "ComplianceChecker", ar: "ComplianceChecker" }, detail: { en: "Runs before every report; never skipped.", ar: "يعمل قبل كل تقرير؛ لا يُتخطّى أبدًا." } },
      { id: "clientadvisor", label: { en: "ClientAdvisor", ar: "ClientAdvisor" }, detail: { en: "Drafts client-facing guidance from verified state.", ar: "يصوغ التوجيه الموجّه للعميل من حالة موثّقة." } },
      { id: "reporter", label: { en: "Reporter", ar: "Reporter" }, detail: { en: "Assembles the final, audit-traceable output.", ar: "يجمّع المُخرج النهائي القابل للتدقيق." } },
    ],
    edges: [
      { from: "supervisor", to: "riskmodeler" },
      { from: "supervisor", to: "compliancechecker" },
      { from: "supervisor", to: "clientadvisor" },
      { from: "supervisor", to: "reporter" },
    ],
    caption: AGENTIC_CAPTION,
  },

  guardrailai: {
    id: "guardrailai",
    kind: "agentic",
    layout: "chain",
    nodes: [
      { id: "interceptor", label: { en: "Pre-Flight Interceptor", ar: "Pre-Flight Interceptor" }, detail: { en: "Blocks a request against AML/OFAC/HIPAA before any agent runs.", ar: "يمنع الطلب أمام قواعد AML وOFAC وHIPAA قبل تشغيل أي وكيل." } },
      { id: "processagent", label: { en: "ProcessAgent", ar: "ProcessAgent" }, detail: { en: "Executes within enforced, bounded limits.", ar: "يُنفَّذ ضمن حدود مفروضة ومقيّدة." } },
      { id: "complianceagent", label: { en: "ComplianceAgent", ar: "ComplianceAgent" }, detail: { en: "Checks the result against every regulatory threshold.", ar: "يفحص النتيجة أمام كل عتبة تنظيمية." } },
      { id: "circuitbreaker", label: { en: "Circuit Breaker", ar: "Circuit Breaker" }, detail: { en: "Trips to a safe fallback on any threshold breach.", ar: "يتوقف إلى بديل آمن عند أي خرق للعتبة." } },
      { id: "ledger", label: { en: "SHA-256 Audit Ledger", ar: "SHA-256 Audit Ledger" }, detail: { en: "Hash-chains every hop into a non-repudiable record.", ar: "يسلسل كل قفزة تشفيريًا في سجل غير قابل للإنكار." } },
    ],
    edges: [
      { from: "interceptor", to: "processagent" },
      { from: "processagent", to: "complianceagent" },
      { from: "complianceagent", to: "circuitbreaker" },
      { from: "circuitbreaker", to: "ledger" },
    ],
    caption: AGENTIC_CAPTION,
  },

  protobridge: {
    id: "protobridge",
    kind: "agentic",
    layout: "chain",
    nodes: [
      { id: "envelope", label: { en: "ProtocolEnvelope", ar: "ProtocolEnvelope" }, detail: { en: "Normalizes every message so governance survives the hop.", ar: "يوحّد كل رسالة كي تبقى معلومات الحوكمة قائمة عبر القفزة." } },
      { id: "mcp", label: { en: "MCPConnector", ar: "MCPConnector" }, detail: { en: "Binds external tools over real JSON-RPC/stdio.", ar: "يربط الأدوات الخارجية عبر JSON-RPC/stdio حقيقي." } },
      { id: "a2a", label: { en: "A2AGateway", ar: "A2AGateway" }, detail: { en: "Delegates to vendor agents over a real HTTP peer.", ar: "يفوّض إلى وكلاء الموردين عبر نظير HTTP حقيقي." } },
      { id: "audit", label: { en: "AuditAgent", ar: "AuditAgent" }, detail: { en: "Inspects twice per hop — before dispatch, after response.", ar: "يفحص مرّتين في كل قفزة — قبل الإرسال وبعد الاستجابة." } },
      { id: "ledger", label: { en: "Hash-Chained Ledger", ar: "Hash-Chained Ledger" }, detail: { en: "Records a payload digest, not the payload itself.", ar: "يسجّل بصمة الحمولة لا الحمولة نفسها." } },
    ],
    edges: [
      { from: "envelope", to: "mcp" },
      { from: "mcp", to: "a2a" },
      { from: "a2a", to: "audit" },
      { from: "audit", to: "ledger" },
    ],
    caption: AGENTIC_CAPTION,
  },

  "agent-factory": {
    id: "agent-factory",
    kind: "agentic",
    layout: "chain",
    nodes: [
      { id: "general", label: { en: "General Agent (Claude Code)", ar: "General Agent (Claude Code)" }, detail: { en: "Builds and reviews the specialist agent's own code.", ar: "يبني ويراجع كود الوكيل المتخصص بنفسه." } },
      { id: "custom", label: { en: "Custom Agent (OpenAI Agents SDK)", ar: "Custom Agent (OpenAI Agents SDK)" }, detail: { en: "The deployed, task-specific agent it produces.", ar: "الوكيل المنشور والمخصص للمهمة الذي ينتجه." } },
      { id: "skill", label: { en: "SKILL.md Unit", ar: "SKILL.md Unit" }, detail: { en: "Portable, monetizable capability the agent ships with.", ar: "قدرة محمولة وقابلة للتسييل يُشحن بها الوكيل." } },
    ],
    edges: [
      { from: "general", to: "custom" },
      { from: "custom", to: "skill" },
    ],
    caption: AGENTIC_CAPTION,
  },

  bazaar: {
    id: "bazaar",
    kind: "architecture",
    layout: "chain",
    nodes: [
      { id: "storefront", label: { en: "Storefront (Next.js 15)", ar: "Storefront (Next.js 15)" }, detail: { en: "B2C browse, cart, and checkout.", ar: "تصفّح وسلة وإتمام شراء للبيع بالتجزئة." } },
      { id: "api", label: { en: "FastAPI Services", ar: "FastAPI Services" }, detail: { en: "RFQ engine, vendor analytics, tiered pricing.", ar: "محرك طلبات الأسعار، تحليلات الموردين، والتسعير المتدرّج." } },
      { id: "data", label: { en: "Supabase (Auth + Postgres)", ar: "Supabase (Auth + Postgres)" }, detail: { en: "Realtime data and identity for every tenant.", ar: "بيانات لحظية وهوية لكل مستأجر." } },
      { id: "payments", label: { en: "Payment Gateways", ar: "Payment Gateways" }, detail: { en: "JazzCash, Easypaisa, and card settlement.", ar: "تسوية عبر JazzCash وEasypaisa والبطاقات." } },
    ],
    edges: [
      { from: "storefront", to: "api" },
      { from: "api", to: "data" },
      { from: "data", to: "payments" },
    ],
    caption: ARCHITECTURE_CAPTION,
  },

  devunity: {
    id: "devunity",
    kind: "architecture",
    layout: "chain",
    nodes: [
      { id: "ui", label: { en: "Next.js App Router (UI)", ar: "Next.js App Router (UI)" }, detail: { en: "Threaded Q&A, blogs, and collaboration surfaces.", ar: "واجهات الأسئلة والأجوبة والمدوّنات والتعاون." } },
      { id: "engine", label: { en: "Community Engine", ar: "Community Engine" }, detail: { en: "Handles posts, threads, and project collaboration.", ar: "يدير المنشورات والمواضيع والتعاون على المشاريع." } },
      { id: "db", label: { en: "PostgreSQL", ar: "PostgreSQL" }, detail: { en: "Persists every thread, answer, and profile.", ar: "يخزّن كل موضوع وإجابة وملف شخصي." } },
      { id: "ai", label: { en: "AI Answer Suggestions", ar: "AI Answer Suggestions" }, detail: { en: "Surfaces likely answers drawn from prior threads.", ar: "يقترح إجابات مرجّحة من مواضيع سابقة." } },
    ],
    edges: [
      { from: "ui", to: "engine" },
      { from: "engine", to: "db" },
      { from: "db", to: "ai" },
    ],
    caption: ARCHITECTURE_CAPTION,
  },
};
