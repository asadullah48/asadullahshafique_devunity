"use client";

import { Reveal } from "@/components/Reveal";
import { Github } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

/* --------------------------------------------------------------------
 * The Autonomous Agent Ecosystem Matrix
 *
 * Twenty-one platforms, one row each. This is the INDEX to the project
 * grid below it, not a replacement for it: the grid argues a handful of
 * platforms in depth with a problem/solution/impact case study, which is
 * what a visitor reading top to bottom wants. This is the whole surface
 * at a glance, which is what a reviewer checking coverage against a brief
 * wants. Same evidence, different granularity — the same division of
 * labour Skills.tsx draws between MASTERY and ExpertiseGrid.
 *
 * Every row must resolve to a real public repository. A row whose repo
 * 404s is a claim the tree cannot answer for, which CLAUDE.md forbids
 * outright. All 21 below were verified against the GitHub API on
 * 2026-08-27.
 *
 * Why there is no "Live Dashboard" column, despite each platform having
 * one: those dashboards bind to 127.0.0.1 on the port shown, so a link
 * would resolve to the VISITOR's machine and fail for every reader.
 * `port` is therefore rendered as inert monospace text, never an anchor —
 * it says where the service listens once you clone and run it, which is
 * true, instead of offering a live demo that isn't.
 * ------------------------------------------------------------------ */
type EcosystemRow = {
  /** Repo slug. Doubles as the React key and the specialty lookup key. */
  id: string;
  /** Latin proper noun. Never translated, always dir="ltr". */
  name: string;
  /** Local port the FastAPI service binds to. Inert text, not a link. */
  port: string;
};

const ECOSYSTEM: EcosystemRow[] = [
  { id: "feedbackx",           name: "FeedbackX",           port: "8020" },
  { id: "stockai",             name: "StockAI",             port: "8019" },
  { id: "actionnews",          name: "ActionNews",          port: "8018" },
  { id: "legacyx",             name: "LegacyX",             port: "8017" },
  { id: "synthdata",           name: "SynthData",           port: "8016" },
  { id: "accessai",            name: "AccessAI",            port: "8015" },
  { id: "collabx",             name: "CollabX",             port: "8014" },
  { id: "docucode",            name: "DocuCode",            port: "8013" },
  { id: "privatebrain",        name: "PrivateBrain",        port: "8012" },
  { id: "researchx",           name: "ResearchX",           port: "8011" },
  { id: "graphai",             name: "GraphAI",             port: "8010" },
  { id: "loopai",              name: "LoopAI",              port: "8009" },
  { id: "harnessai",           name: "HarnessAI",           port: "8008" },
  { id: "securebridge",        name: "SecureBridge",        port: "8007" },
  { id: "workforceai-academy", name: "WorkforceAI Academy", port: "8006" },
  { id: "conciergeagent",      name: "ConciergeAgent",      port: "8005" },
  { id: "contextx",            name: "ContextX",            port: "8004" },
  { id: "guardrailai",         name: "GuardrailAI",         port: "8003" },
  { id: "marketagenthub",      name: "MarketAgentHub",      port: "8000" },
  { id: "workforceai",         name: "WorkforceAI",         port: "8001" },
  { id: "domainx",             name: "DomainX",             port: "8002" },
];

const GITHUB_OWNER = "asadullah48";

/* Only the prose is localized. Keeping name/port/slug out of the locale
   maps means a new platform is ONE row plus two strings, and the two
   locales cannot drift on the facts — only on the wording. */
const SPECIALTY_EN: Record<string, string> = {
  "feedbackx":           "Customer review mining, ABSA sentiment & RICE roadmap",
  "stockai":             "Autonomous inventory monitoring, demand forecasting & POs",
  "actionnews":          "100+ financial feed aggregator & daily alpha newsletter",
  "legacyx":             "COBOL & legacy Java to TypeScript/Python transpiler",
  "synthdata":           "Differential privacy & zero-PII synthetic test datasets",
  "accessai":            "Real-time audio description & WCAG 2.2 AAA inclusivity",
  "collabx":             "Orchestrated newsroom state graph & editorial team",
  "docucode":            "Real-time AST diff monitoring & automated docstring sync",
  "privatebrain":        "Air-gapped finance memory & zero-cloud-egress vault",
  "researchx":           "Multi-source triangulation & verified market intelligence",
  "graphai":             "DAG workflow orchestration, HITL approvals & retries",
  "loopai":              "Feedback-driven self-correction (Plan-Act-Verify)",
  "harnessai":           "Safe agent runtime, tool sandboxing & runaway circuit breakers",
  "securebridge":        "Zero-trust MCP/A2A security, tool-poisoning defence & DLP",
  "workforceai-academy": "Enterprise AI enablement, co-pilot mentorship & CI certification",
  "conciergeagent":      "White-glove VIP personalization, wealth advisory & dispute SLA",
  "contextx":            "Advanced context engineering & lost-in-the-middle layout",
  "guardrailai":         "Deterministic compliance, circuit breakers & SHA-256 audit",
  "marketagenthub":      "Multi-cloud marketplace agents (AWS, Azure, GCP, Salesforce)",
  "workforceai":         "Agent-as-a-worker automation & outcome-based billing",
  "domainx":             "Specialized vertical reasoning (legal, medical, supply chain)",
};

const SPECIALTY_AR: Record<string, string> = {
  "feedbackx":           "تعدين مراجعات العملاء، وتحليل المشاعر المرتكز على الجوانب، وخارطة طريق RICE",
  "stockai":             "مراقبة المخزون آليًا، والتنبؤ بالطلب، وصياغة أوامر الشراء",
  "actionnews":          "تجميع أكثر من مئة تدفّق مالي ونشرة الفرص اليومية",
  "legacyx":             "تحويل COBOL وJava القديمة إلى TypeScript وPython",
  "synthdata":           "الخصوصية التفاضلية وبيانات اختبار اصطناعية خالية من البيانات الشخصية",
  "accessai":            "الوصف الصوتي الآني والامتثال لمعايير WCAG 2.2 AAA",
  "collabx":             "مخطّط حالة غرفة أخبار منسّقة وفريق تحرير متكامل",
  "docucode":            "مراقبة فروق شجرة AST آنيًا ومزامنة التوثيق آليًا",
  "privatebrain":        "ذاكرة مالية معزولة تمامًا وخزنة بلا تسريب سحابي",
  "researchx":           "التثليث متعدد المصادر وذكاء سوقي موثّق",
  "graphai":             "تنسيق سير عمل DAG، وموافقات بشرية، وإعادة محاولات",
  "loopai":              "التصحيح الذاتي المدفوع بالتغذية الراجعة (خطّط-نفّذ-تحقّق)",
  "harnessai":           "بيئة تشغيل آمنة للوكلاء، وعزل الأدوات، وقواطع الجموح",
  "securebridge":        "أمن MCP/A2A بلا ثقة ضمنية، وصدّ تسميم الأدوات، ومنع تسرّب البيانات",
  "workforceai-academy": "تمكين المؤسسات، وإرشاد المساعد الرقمي، وشهادات التكامل المستمر",
  "conciergeagent":      "تخصيص فائق لكبار العملاء، واستشارات الثروة، واتفاقيات مستوى الخدمة",
  "contextx":            "هندسة السياق المتقدمة ومعالجة الضياع في منتصف السياق",
  "guardrailai":         "امتثال حتمي، وقواطع حماية، وتدقيق بتوقيع SHA-256",
  "marketagenthub":      "وكلاء أسواق متعددة السحابات (AWS وAzure وGCP وSalesforce)",
  "workforceai":         "أتمتة الوكيل كعامل رقمي وفوترة قائمة على النتائج",
  "domainx":             "استدلال رأسي متخصص (قانوني، طبي، سلاسل توريد)",
};

const COPY = {
  en: {
    eyebrow: "// agent ecosystem",
    title: "The Autonomous Agent",
    titleHighlight: "Ecosystem Matrix",
    subtitle:
      "Twenty-one production multi-agent platforms, each with its own FastAPI gateway, test suite and public repository. Every row below opens onto real source.",
    colPlatform: "Platform",
    colSpecialty: "Core specialty",
    colPort: "Local port",
    colRepo: "Repository",
    footnote:
      "Each platform serves its dashboard from localhost on the port shown, so the port is listed rather than linked — clone the repo and it comes up there.",
  },
  ar: {
    eyebrow: "// منظومة الوكلاء",
    title: "مصفوفة منظومة",
    titleHighlight: "الوكلاء المستقلين",
    subtitle:
      "إحدى وعشرون منصة إنتاجية متعددة الوكلاء، لكل منها بوابة FastAPI ومجموعة اختبارات ومستودع عام. وكل صف أدناه يفتح على شيفرة حقيقية.",
    colPlatform: "المنصة",
    colSpecialty: "التخصص الجوهري",
    colPort: "المنفذ المحلي",
    colRepo: "المستودع",
    footnote:
      "تقدّم كل منصة لوحتها من الجهاز المحلي على المنفذ المبيَّن، لذا يُذكر المنفذ ولا يُربط — استنسخ المستودع وستعمل عليه.",
  },
} as const;

export function AgentEcosystem() {
  const { locale } = useLocale();
  const copy = locale === "ar" ? COPY.ar : COPY.en;
  const specialty = locale === "ar" ? SPECIALTY_AR : SPECIALTY_EN;

  return (
    <div className="mb-20">
      <Reveal className="text-center mb-10">
        {/* dir="ltr" so Arabic bidi does not flip the leading "//" to the
            trailing edge, matching the eyebrow idiom used site-wide. */}
        <div
          dir="ltr"
          className="text-xs font-mono text-brand/60 uppercase tracking-widest mb-3"
        >
          {copy.eyebrow}
        </div>
        <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          {copy.title}{" "}
          <span className="text-brand">{copy.titleHighlight}</span>
        </h3>
        <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
        {/* brand-soft, not brand: full-saturation cyan vibrates badly in
            paragraph-length copy on near-black. */}
        <p className="text-brand-soft/80 max-w-2xl mx-auto text-sm leading-relaxed">
          {copy.subtitle}
        </p>
      </Reveal>

      {/* The matrix is genuinely wide — five columns of which one is a full
          sentence. It scrolls inside its own container rather than letting
          the page body scroll sideways on a phone. */}
      <Reveal step={1} className="glass-panel rounded-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand/20 bg-surface-1/60">
                <th className="py-3 px-4 text-eyebrow font-semibold uppercase text-brand w-12">
                  #
                </th>
                <th className="py-3 px-4 text-eyebrow font-semibold uppercase text-brand">
                  {copy.colPlatform}
                </th>
                <th className="py-3 px-4 text-eyebrow font-semibold uppercase text-brand">
                  {copy.colSpecialty}
                </th>
                <th className="py-3 px-4 text-eyebrow font-semibold uppercase text-brand">
                  {copy.colPort}
                </th>
                <th className="py-3 px-4 text-eyebrow font-semibold uppercase text-brand">
                  {copy.colRepo}
                </th>
              </tr>
            </thead>
            <tbody>
              {ECOSYSTEM.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-border/60 last:border-b-0 transition-colors duration-200 hover:bg-brand/[0.04]"
                >
                  <td
                    dir="ltr"
                    className="py-3 px-4 font-mono text-xs text-muted-foreground/60 tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td
                    dir="ltr"
                    className="py-3 px-4 font-semibold text-foreground whitespace-nowrap text-sm"
                  >
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm leading-snug">
                    {specialty[row.id]}
                  </td>
                  <td dir="ltr" className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground/80">
                      {`:${row.port}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a
                      dir="ltr"
                      href={`https://github.com/${GITHUB_OWNER}/${row.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-brand transition-colors duration-200 whitespace-nowrap"
                    >
                      <Github className="w-3.5 h-3.5 shrink-0" />
                      {`${GITHUB_OWNER}/${row.id}`}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal step={2}>
        <p className="text-xs text-muted-foreground/70 mt-4 text-center max-w-2xl mx-auto leading-relaxed">
          {copy.footnote}
        </p>
      </Reveal>
    </div>
  );
}

export default AgentEcosystem;
