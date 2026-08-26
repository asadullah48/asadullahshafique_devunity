"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

/**
 * `color` is a VENDOR IDENTITY MARK (TypeScript blue, Python blue, Anthropic
 * clay) — these are logos, not UI accents, so they stay literal. Same rule the
 * Hero's ORBIT_BADGES follow.
 *
 * `own: true` marks concepts that are ours, not a vendor's — RAG Systems,
 * SKILL.md, Agent Factory, Digital FTE. Those previously carried #84cc16 and
 * #a855f7, i.e. the RETIRED lime brand and a stray purple, which made our own
 * work the only thing on the page still wearing last season's palette. They
 * now render in brand cyan and are the visual anchor of the grid.
 */
type Skill = {
  name: string;
  icon: string;
  /** Vendor brand hex. Omitted when `own` is set. */
  color?: string;
  /** Our own concept — renders in brand tokens, not a literal. */
  own?: boolean;
  custom?: boolean;
  badge?: string;
};

const SKILL_TABS: Record<string, Skill[]> = {
  Languages: [
    { name: "TypeScript", icon: "typescript/typescript-original.svg", color: "#3178C6" },
    { name: "JavaScript", icon: "javascript/javascript-original.svg", color: "#F7DF1E" },
    { name: "Python",     icon: "python/python-original.svg",         color: "#3776AB" },
    { name: "HTML5",      icon: "html5/html5-original.svg",           color: "#E34F26" },
    { name: "CSS3",       icon: "css3/css3-original.svg",             color: "#1572B6" },
    { name: "SQL",        icon: "postgresql/postgresql-original.svg", color: "#4169E1" },
  ],
  Frameworks: [
    { name: "Next.js",      icon: "nextjs/nextjs-original.svg",           color: "#ffffff" },
    { name: "React",        icon: "react/react-original.svg",             color: "#61DAFB" },
    { name: "FastAPI",      icon: "fastapi/fastapi-original.svg",         color: "#009688" },
    { name: "Tailwind",     icon: "tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "Node.js",      icon: "nodejs/nodejs-original.svg",           color: "#339933" },
    { name: "Supabase",     custom: true, icon: "", badge: "SB",          color: "#3ECF8E" },
    { name: "Firebase",     icon: "firebase/firebase-original.svg",       color: "#FFCA28" },
    { name: "SQLAlchemy",   icon: "sqlalchemy/sqlalchemy-original.svg",   color: "#CC2927" },
    { name: "shadcn/ui",    custom: true, icon: "", badge: "UI",          color: "#ffffff" },
    { name: "Stripe",       icon: "stripe/stripe-original.svg",            color: "#635BFF" },
  ],
  "AI & Agents": [
    { name: "OpenAI API",        custom: true, icon: "", badge: "GPT",   color: "#10a37f" },
    { name: "Agents SDK",        custom: true, icon: "", badge: "AGT",   color: "#10a37f" },
    { name: "Claude / MCP",      custom: true, icon: "", badge: "MCP",   color: "#CC785C" },
    { name: "Gemini API",        custom: true, icon: "", badge: "GEM",   color: "#4285F4" },
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",   own: true },
    { name: "Constitutional AI", custom: true, icon: "", badge: "CAI",   own: true },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",   own: true },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",    own: true },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",    color: "#1C3C3C" },
    { name: "LlamaIndex",        custom: true, icon: "", badge: "LI",    color: "#fbba00" },
    { name: "n8n",               custom: true, icon: "", badge: "n8n",   color: "#ea4b71" },
    { name: "Hugging Face",      custom: true, icon: "", badge: "HF",    color: "#FFD21E" },
    { name: "A2A Protocol",      custom: true, icon: "", badge: "A2A",   color: "#4285F4" },
    { name: "Computer Use",      custom: true, icon: "", badge: "CU",    color: "#CC785C" },
  ],
  "Cloud & DevOps": [
    { name: "Kubernetes",     icon: "kubernetes/kubernetes-original.svg",   color: "#326CE5" },
    { name: "Docker",         icon: "docker/docker-original.svg",           color: "#2496ED" },
    { name: "GitHub Actions", icon: "github/github-original.svg",          color: "#ffffff" },
    { name: "Helm",           custom: true, icon: "", badge: "HLM",        color: "#0F1689" },
    { name: "Kafka",          icon: "apachekafka/apachekafka-original.svg", color: "#ffffff" },
    { name: "Dapr",           custom: true, icon: "", badge: "DPR",        color: "#0D2192" },
    { name: "Prometheus",     custom: true, icon: "", badge: "PRO",        color: "#E6522C" },
    { name: "Grafana",        icon: "grafana/grafana-original.svg",         color: "#F46800" },
    { name: "Redis",          icon: "redis/redis-original.svg",             color: "#FF4438" },
    { name: "Terraform",      icon: "terraform/terraform-original.svg",     color: "#7B42BC" },
    { name: "Jaeger",         custom: true, icon: "", badge: "OTL",         color: "#60d0e4" },
  ],
  Platforms: [
    { name: "Vercel",         icon: "vercel/vercel-original.svg",      color: "#ffffff" },
    { name: "Koyeb",          custom: true, icon: "", badge: "KYB",    color: "#121212" },
    { name: "Cloudflare",     icon: "cloudflare/cloudflare-original.svg", color: "#F38020" },
    { name: "GitHub",         icon: "github/github-original.svg",      color: "#ffffff" },
    { name: "Supabase BaaS",  custom: true, icon: "", badge: "BaaS",   color: "#3ECF8E" },
    { name: "PostgreSQL",     icon: "postgresql/postgresql-original.svg", color: "#4169E1" },
    { name: "Ubuntu WSL",     icon: "ubuntu/ubuntu-original.svg",      color: "#E95420" },
  ],
  "OpenClaw Track": [
    { name: "OpenClaw",       custom: true, icon: "", badge: "OC",    own: true },
    { name: "CLAUDE.md",      custom: true, icon: "", badge: "CLD",   color: "#CC785C" },
    { name: "Spec-First Dev", custom: true, icon: "", badge: "SFD",   own: true },
    { name: "SKILL.md Files", custom: true, icon: "", badge: "SKL",   own: true },
    { name: "Digital FTE",    custom: true, icon: "", badge: "FTE",   own: true },
    { name: "Agent Factory",  custom: true, icon: "", badge: "AF",    own: true },
  ],
};

const AGENT_ROLE_GROUPS: Record<string, Skill[]> = {
  "AI Agent Layer": [
    { name: "Claude / MCP",      custom: true, icon: "", badge: "MCP",  color: "#CC785C" },
    { name: "OpenAI Agents SDK", custom: true, icon: "", badge: "AGT",  color: "#10a37f" },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",   color: "#1C3C3C" },
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",  own: true },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",   own: true },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",  own: true },
  ],
  "Backend Runtime": [
    { name: "Python",     icon: "python/python-original.svg",           color: "#3776AB" },
    { name: "FastAPI",    icon: "fastapi/fastapi-original.svg",         color: "#009688" },
    { name: "Docker",     icon: "docker/docker-original.svg",           color: "#2496ED" },
    { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg",   color: "#4169E1" },
    { name: "Redis",      icon: "redis/redis-original.svg",             color: "#FF4438" },
    { name: "Supabase",   custom: true, icon: "", badge: "SB",          color: "#3ECF8E" },
  ],
  "Frontend Interface": [
    { name: "Next.js",    icon: "nextjs/nextjs-original.svg",           color: "#ffffff" },
    { name: "TypeScript", icon: "typescript/typescript-original.svg",   color: "#3178C6" },
    { name: "React",      icon: "react/react-original.svg",             color: "#61DAFB" },
    { name: "Tailwind",   icon: "tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "shadcn/ui",  custom: true, icon: "", badge: "UI",          color: "#ffffff" },
    { name: "Framer",     custom: true, icon: "", badge: "FM",          color: "#0055FF" },
  ],
  "Infrastructure": [
    { name: "Kubernetes",     icon: "kubernetes/kubernetes-original.svg",    color: "#326CE5" },
    { name: "GitHub Actions", icon: "github/github-original.svg",            color: "#ffffff" },
    { name: "Vercel",         icon: "vercel/vercel-original.svg",            color: "#ffffff" },
    { name: "Terraform",      icon: "terraform/terraform-original.svg",      color: "#7B42BC" },
    { name: "Kafka",          icon: "apachekafka/apachekafka-original.svg",  color: "#ffffff" },
    { name: "Grafana",        icon: "grafana/grafana-original.svg",          color: "#F46800" },
  ],
};

/* ------------------------------------------------------------------ *
 * Agentic AI Mastery Matrix
 *
 * Twelve competencies in four categories. Every row carries an `evidence`
 * path, and that is the entire discipline of this block: a competency is
 * allowed onto the matrix only once something in the tree can demonstrate
 * it on request. Rows that could not clear that bar were not softened into
 * vaguer wording — they were replaced by adjacent capability that does
 * clear it. Do not add a row you cannot cite.
 *
 * Division of labour with ExpertiseGrid, which also cites substrate:
 * ExpertiseGrid is FIVE narrative cards that argue a capability in prose,
 * for a visitor reading top to bottom. This is TWELVE terse rows in a
 * scan-first matrix, for a reviewer checking coverage against a brief.
 * Same evidence, different granularity and different reader. If the two
 * ever converge on the same sentence, cut it here and keep it there.
 *
 * "Bilingual" follows the site convention: locale-switched by route, never
 * EN/AR side by side — an Arabic reader on /ar gets Arabic prose, not a
 * column of English to skip past. The acronym chips stay Latin and
 * dir="ltr" in BOTH locales, because MAS, MCP and SDLC are proper nouns a
 * reviewer scans for regardless of the language around them.
 * ------------------------------------------------------------------ */
type Competency = {
  id: string;
  /** Latin acronym/proper noun. Never translated, always dir="ltr". */
  tag: string;
  /** Path or URL in the tree that demonstrates this. Always dir="ltr". */
  evidence: string;
};

type MasteryCategory = {
  id: string;
  /** Rendered as `// <slug>` — matches the eyebrow idiom used elsewhere. */
  slug: string;
  items: Competency[];
};

const MASTERY: MasteryCategory[] = [
  {
    id: "orchestration",
    slug: "orchestration",
    items: [
      { id: "mas",       tag: "MAS",       evidence: "backend/orchestration/orchestrator.py" },
      { id: "graph",     tag: "Graph",     evidence: "backend/agent.py" },
      { id: "sdlc",      tag: "SDLC",      evidence: "CLAUDE.md" },
    ],
  },
  {
    id: "protocols",
    slug: "protocols",
    items: [
      { id: "mcp",       tag: "MCP",       evidence: "/mcp/server" },
      { id: "contracts", tag: "Tools",     evidence: "backend/mcp_server.py" },
      { id: "fallback",  tag: "Fallback",  evidence: "backend/agent.py" },
    ],
  },
  {
    id: "enterprise",
    slug: "enterprise",
    items: [
      { id: "finance",   tag: "Finance",   evidence: "finagent-nexus · 94 tests" },
      { id: "erp",       tag: "ERP",       evidence: "cmt-stitching · live" },
      { id: "scale",     tag: "K8s",       evidence: "k8s/ · 11 manifests" },
    ],
  },
  {
    id: "reliability",
    slug: "reliability",
    items: [
      { id: "guardrails", tag: "Guardrails", evidence: "backend/constitution/principles.json" },
      { id: "evals",      tag: "Evals",      evidence: "evals/ · 3 suites" },
      { id: "context",    tag: "Context",    evidence: "backend/orchestration/context.py" },
    ],
  },
];

type MasteryEntry = { title: string; desc: string };

/** Only prose is per-locale — t() cannot carry this, it returns strings and
 *  neither i18n JSON file contains arrays. Same split-axis shape as
 *  ExpertiseGrid's COPY, deliberately: one place to fix a path, two to
 *  translate a sentence. */
const MASTERY_COPY: Record<
  "en" | "ar",
  { categories: Record<string, string>; items: Record<string, MasteryEntry> }
> = {
  en: {
    categories: {
      orchestration: "Agentic Orchestration",
      protocols: "Connectivity & Protocols",
      enterprise: "Enterprise & Scale",
      reliability: "Reliability & Safety",
    },
    items: {
      mas: {
        title: "Engineering Multi-Agent Ecosystem Design",
        desc: "A triage orchestrator routes each request to one of four specialists in a single hop. Specialists hold no handoffs, so the graph stays a star and every run stays explainable.",
      },
      graph: {
        title: "Designing Graph-Based Agent Workflows",
        desc: "An explicit state machine rather than an open conversation: plan, act, verify. No edge runs from drafting a recommendation to approving one, so verification cannot be skipped under load.",
      },
      sdlc: {
        title: "Implementing Agentic Coding & SDLC Standardization",
        desc: "A written operating spec governs every change, and its first rule is the hard one: never write a capability claim the repository cannot demonstrate on request.",
      },
      mcp: {
        title: "Engineering MCP Interoperability Layers",
        desc: "A real FastMCP server over Streamable HTTP, verified against a live client through initialize, tools/list and tools/call — not an MCP-shaped REST route.",
      },
      contracts: {
        title: "Standardizing Read-Only Agent Tool Contracts",
        desc: "New capability arrives as a tool on the server, never as another bespoke endpoint. Six tools, read-only by default; a write-capable tool needs a stated reason.",
      },
      fallback: {
        title: "Architecting Provider-Agnostic Fallback Ladders",
        desc: "Three rungs — Agents SDK, then LangGraph, then static answers. A dead key or an exhausted quota drops a rung instead of dropping the site.",
      },
      finance: {
        title: "Engineering Domain-Specific Intelligence Systems",
        desc: "Three specialists on a fixed state machine for wealth research and Shari'ah screening. A full compliance screen runs in under 2ms with zero model calls, and every run writes a hash-chained audit trail.",
      },
      erp: {
        title: "Architecting Domain-Specific ERP Intelligence",
        desc: "Order lifecycle, four auto-billing types, party ledgers and BOM inventory for Pakistan's textile chain — built from inside the industry rather than modelled from outside it.",
      },
      scale: {
        title: "Implementing Cloud-Native Scale-Out",
        desc: "Eleven manifests covering autoscaling, network policy and service monitoring — the parts that matter after the first deploy, not during it.",
      },
      guardrails: {
        title: "Implementing Deterministic Guardrails",
        desc: "Five written principles enforced as SDK guardrails, screened deterministically before any model call. Verified blocking 4 of 4 violations with no model reachable at all.",
      },
      evals: {
        title: "Designing Feedback-Driven Evaluation Loops",
        desc: "A deterministic layer reads the execution trace; a judged layer scores the prose. A case passes only if both pass, and a red case is fixed in the agent, never in the case.",
      },
      context: {
        title: "Engineering Context Integrity & Trace Auditability",
        desc: "Typed shared state records the route taken and the tools called, so any run can be explained after the fact instead of guessed at.",
      },
    },
  },
  ar: {
    categories: {
      orchestration: "تنسيق الوكلاء",
      protocols: "الاتصال والبروتوكولات",
      enterprise: "المؤسسات والتوسّع",
      reliability: "الموثوقية والأمان",
    },
    items: {
      mas: {
        title: "هندسة تنظيم الأنظمة متعددة الوكلاء",
        desc: "منسّق فرز يوجّه كل طلب إلى أحد أربعة وكلاء متخصصين في قفزة واحدة. لا يملك المتخصصون أي تحويلات، فيبقى الرسم نجميًا ويبقى كل تشغيل قابلًا للتفسير.",
      },
      graph: {
        title: "تصميم مسارات عمل قائمة على الرسوم البيانية",
        desc: "آلة حالة صريحة بدل محادثة مفتوحة: خطّط، ثم نفّذ، ثم تحقّق. لا توجد حافة من صياغة التوصية إلى اعتمادها، فلا يمكن تخطّي التحقق تحت الضغط.",
      },
      sdlc: {
        title: "توحيد معايير البرمجة الوكيلية ودورة حياة التطوير",
        desc: "مواصفة تشغيل مكتوبة تحكم كل تغيير، وقاعدتها الأولى هي الأصعب: لا يُكتب ادعاء قدرة لا يستطيع المستودع إثباتها عند الطلب.",
      },
      mcp: {
        title: "هندسة طبقات التشغيل البيني عبر MCP",
        // The Latin method names are ONE contiguous run joined by arrows, not
        // three runs joined by Arabic "و". Interleaving a conjunction between
        // Latin tokens gives the bidi algorithm neutral characters to resolve
        // against the paragraph direction, and it reorders the sequence — the
        // handshake rendered out of order in RTL. An arrow is direction-neutral
        // inside a single LTR run, so the order is fixed by construction.
        desc: "خادم FastMCP حقيقي عبر Streamable HTTP، جرى التحقق منه بعميل حيّ عبر التسلسل initialize → tools/list → tools/call، لا مسار REST بهيئة MCP.",
      },
      contracts: {
        title: "توحيد عقود أدوات الوكلاء للقراءة فقط",
        desc: "القدرة الجديدة تصل كأداة على الخادم، لا كنقطة نهاية مفصّلة أخرى. ست أدوات للقراءة افتراضيًا، وأي أداة تكتب تحتاج سببًا معلنًا.",
      },
      fallback: {
        title: "بناء سلالم بديلة مستقلة عن المزوّد",
        desc: "ثلاث درجات: Agents SDK ثم LangGraph ثم إجابات ثابتة. مفتاح معطّل أو حصة منتهية ينزل درجة واحدة بدل أن يُسقط الموقع.",
      },
      finance: {
        title: "هندسة أنظمة ذكاء متخصصة بالمجال",
        desc: "ثلاثة وكلاء متخصصين على آلة حالة ثابتة لأبحاث الثروة والفحص الشرعي. فحص امتثال كامل في أقل من ٢ ميلي ثانية دون أي استدعاء نموذج، مع سجل تدقيق مسلسل بالتجزئة لكل تشغيل.",
      },
      erp: {
        title: "بناء ذكاء تخطيط موارد متخصص بالمجال",
        desc: "دورة حياة الطلب، وأربعة أنواع فوترة آلية، ودفاتر الأطراف ومخزون قوائم المواد لسلسلة النسيج في باكستان — مبني من داخل الصناعة لا مُنمذَج من خارجها.",
      },
      scale: {
        title: "تنفيذ التوسّع السحابي الأصلي",
        desc: "أحد عشر ملف نشر تغطي التوسّع التلقائي وسياسة الشبكة ومراقبة الخدمات — الأجزاء التي تهمّ بعد أول نشر لا أثناءه.",
      },
      guardrails: {
        title: "تنفيذ ضوابط حتمية",
        desc: "خمسة مبادئ مكتوبة تُنفَّذ كحواجز على مستوى الـ SDK، تُفحص حتميًا قبل أي استدعاء نموذج. جرى التحقق من حجب ٤ مخالفات من ٤ دون أي نموذج متاح إطلاقًا.",
      },
      evals: {
        title: "تصميم حلقات تقييم قائمة على التغذية الراجعة",
        desc: "طبقة حتمية تقرأ أثر التنفيذ، وطبقة حكم تُقيّم النص. لا تنجح الحالة إلا إذا نجحت الطبقتان، والحالة الحمراء تُصلَح في الوكيل لا في الحالة.",
      },
      context: {
        title: "هندسة سلامة السياق وقابلية تدقيق الأثر",
        desc: "حالة مشتركة مكتوبة الأنواع تسجّل المسار المسلوك والأدوات المستدعاة، فيمكن تفسير أي تشغيل بعد وقوعه بدل تخمينه.",
      },
    },
  },
};

/** The financial-services system the Enterprise column cites. Linked from
 *  the matrix footer in both locales and from README.md, so the proof sits
 *  one click from the claim rather than a page away. */
const FINAGENT_REPO = "https://github.com/asadullah48/finagent-nexus";

const TAB_KEYS = Object.keys(SKILL_TABS);

function SkillCard({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);

  // Two rendering paths. Vendor marks keep their literal hex in inline styles
  // (hex+alpha suffixes like `${color}12` only work on hex, not on hsl()).
  // Our own concepts take the token path via classes, so they retint with the
  // theme and can never drift out of the palette again.
  const isOwn = !!skill.own;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-lg border transition-all duration-300 ease-spring cursor-default select-none animate-in fade-in-0 zoom-in-95 duration-200 ${
        isOwn
          ? "border-brand/20 bg-brand/[0.04] hover:border-brand/50 hover:bg-brand/10 hover:shadow-neon"
          : "border-border"
      }`}
      style={
        isOwn
          ? undefined
          : {
              backgroundColor: hovered ? `${skill.color}12` : "transparent",
              borderColor: hovered ? `${skill.color}60` : undefined,
              boxShadow: hovered ? `0 0 20px ${skill.color}20` : "none",
            }
      }
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {skill.custom ? (
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
              isOwn ? "bg-brand/15 text-brand border border-brand/40" : "border"
            }`}
            style={
              isOwn
                ? undefined
                : {
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                    borderColor: `${skill.color}40`,
                  }
            }
          >
            {skill.badge}
          </div>
        ) : (
          // Remote CDN sprites from jsdelivr. next/image would need a
          // remotePattern entry and buys nothing here — these are already
          // small, cached SVGs at a fixed 36px.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${DI}/${skill.icon}`}
            alt={`${skill.name} logo`}
            width={36}
            height={36}
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
            style={{ filter: skill.color === "#ffffff" ? "brightness(0.9)" : "none" }}
            loading="lazy"
          />
        )}
      </div>

      <span
        className={`text-xs transition-colors duration-200 text-center leading-tight ${
          isOwn ? "text-brand-soft group-hover:text-brand" : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {skill.name}
      </span>

      {/* Was layoutId="skill-glow", which made the dot fly across the grid
          from the previously hovered card. That is a shared-element animation
          and CSS has no equivalent — it needs a runtime tracking both nodes'
          positions. Traded for a local zoom-in. The dot now appears on the
          hovered card instead of travelling to it; at 8px, moving between
          cards a pointer-flick apart, the flight was rarely legible anyway. */}
      {hovered && (
        <div
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-in zoom-in-50 duration-200 ${isOwn ? "bg-brand" : ""}`}
          style={isOwn ? undefined : { backgroundColor: skill.color }}
        />
      )}
    </div>
  );
}

type SkillView = "technology" | "role" | "mastery";

/** Toggle labels. Latin in both locales on purpose: these are view names a
 *  reviewer is told to look for by name, and "Mastery" is the label used in
 *  README.md and on the résumé. Keeping one spelling across all three
 *  surfaces is worth more here than translating the chrome. */
const VIEW_LABELS: Record<SkillView, string> = {
  technology: "By Technology",
  role: "By Agent Role",
  mastery: "Agentic Mastery",
};

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const [view, setView] = useState<SkillView>("technology");
  const { t, locale } = useLocale();
  const mastery = MASTERY_COPY[locale];

  const TAB_LABELS: Record<string, string> = {
    "Languages":      t("skills.tabLanguages"),
    "Frameworks":     t("skills.tabFrameworks"),
    "AI & Agents":    t("skills.tabAI"),
    "Cloud & DevOps": t("skills.tabCloud"),
    "Platforms":      t("skills.tabPlatforms"),
    "OpenClaw Track": t("skills.tabOpenClaw"),
  };

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        <Reveal
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("skills.title")} <span className="text-brand">{t("skills.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("skills.subtitle")}
          </p>
        </Reveal>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-surface-1 border border-border rounded-full p-1 gap-1">
            {(["technology", "role", "mastery"] as SkillView[]).map((v) => (
              <button
                key={v}
                type="button"
                dir="ltr"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-spring active:scale-[0.97] ${
                  view === v
                    ? "bg-brand text-primary-foreground shadow-neon"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        {view === "technology" ? (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {TAB_KEYS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-spring active:scale-[0.97] ${
                    activeTab === tab
                      ? "bg-brand text-primary-foreground shadow-neon"
                      : "border border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* `key={activeTab}` still forces a remount on every tab change,
                which is what replays the CSS enter animation — the same
                mechanism AnimatePresence was keying off, minus the exit. */}
            <div
              key={activeTab}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              {SKILL_TABS[activeTab].map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </>
        ) : view === "role" ? (
          <div className="space-y-10">
            {Object.entries(AGENT_ROLE_GROUPS).map(([role, skills], groupIdx) => (
              <Reveal step={groupIdx}
                key={role}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-brand uppercase tracking-widest">
                    {`// ${role.toLowerCase().replace(/ /g, "_")}`}
                  </span>
                  <div className="flex-1 h-px bg-brand/15" />
                  <span className="text-xs text-muted-foreground/70">{skills.length} tools</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {skills.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          /* Four columns ARE the four categories, so this grid does not
             collapse below md — a matrix that reflows into one long column
             stops being a matrix and becomes a list, which is what the two
             other views already are. */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
              {MASTERY.map((cat, catIdx) => (
                <Reveal key={cat.id} step={catIdx} className="flex flex-col gap-3">
                  {/* dir="ltr": Arabic bidi otherwise flips the leading "//"
                      to the trailing edge — "orchestration //". */}
                  <div className="flex items-center gap-2">
                    <span
                      dir="ltr"
                      className="text-xs font-mono text-brand uppercase tracking-widest"
                    >
                      {`// ${cat.slug}`}
                    </span>
                    <div className="flex-1 h-px bg-brand/15" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {mastery.categories[cat.id]}
                  </h3>

                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col rounded-xl border border-border bg-surface-1/50 p-4 transition-colors duration-300 hover:border-brand/30"
                    >
                      <span
                        dir="ltr"
                        className="self-start text-[10px] font-mono px-2 py-0.5 rounded-full border border-brand/25 text-brand/80 mb-2"
                      >
                        {item.tag}
                      </span>
                      <p className="text-sm font-medium text-foreground leading-snug mb-1.5">
                        {mastery.items[item.id].title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                        {mastery.items[item.id].desc}
                      </p>

                      {/* Provenance hairline. Gold means exactly one thing
                          across this site — here is what backs the claim
                          above it — so it never lands on anything clickable. */}
                      <div className="mt-3 pt-2.5 border-t border-gold/15">
                        <span
                          dir="ltr"
                          className="block text-[10px] font-mono text-gold/70 break-all"
                        >
                          {item.evidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </Reveal>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground/80 max-w-2xl mx-auto pt-2 leading-relaxed">
              {locale === "ar" ? (
                <>
                  كل صف يستشهد بمسار في الشجرة يُثبته. والنظام المالي وراء عمود
                  المؤسسات هو{" "}
                  <a
                    href={FINAGENT_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-brand hover:text-brand-soft underline underline-offset-2 transition-colors"
                  >
                    FinAgent-Nexus
                  </a>{" "}
                  — ٩٤ اختبارًا تنجح دون مفتاح واجهة برمجية ودون شبكة.
                </>
              ) : (
                <>
                  Every row cites a path in the tree that demonstrates it. The
                  financial-services system behind the Enterprise column is{" "}
                  <a
                    href={FINAGENT_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand-soft underline underline-offset-2 transition-colors"
                  >
                    FinAgent-Nexus
                  </a>
                  {" "}— 94 tests passing with no API key and no network.
                </>
              )}
            </p>
          </div>
        )}

        <Reveal as="p" step={4}
          className="text-center text-muted-foreground/70 text-sm mt-10"
        >
          {t("skills.footer")}
        </Reveal>
      </div>
    </section>
  );
}

export default SkillsSection;
