"use client";

import {
  Workflow,
  ShieldCheck,
  Boxes,
  Plug,
  Languages,
  Banknote,
  Factory,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * Two bands, and the difference between them is the point.
 *
 * Band A is capability this repository can demonstrate on request. Every card
 * closes with a gold hairline and the path that proves it, so a claim and its
 * evidence travel together.
 *
 * Band B is the business framing of that same substrate — three verticals the
 * machinery is built for. These cards are deliberately the most premium thing
 * on the page (gold-edged glass), which creates an obvious hazard: an unshipped
 * sector card out-ranking a card that has code behind it. The `substrate` field
 * is what stops that. Gold means exactly one thing across BOTH bands — here is
 * what backs this — and a Band B card points at an in-repo primitive, never at
 * a delivered client engagement.
 *
 * So: never put a customer name, a logo, or a metric on a Band B card. If the
 * work ships, it belongs under Projects. If the substrate moves, fix the path.
 */

type Capability = {
  id: string;
  Icon: LucideIcon;
  /** Bento width on lg. Spans total 6 per row: 3+3, then 2+2+2. */
  span: string;
  /** Proper nouns — never translated. */
  stack: string[];
  /** Path in this repo. Rendered dir="ltr" so Arabic bidi cannot reorder it. */
  evidence: string;
};

/**
 * Locale-agnostic fields live here exactly once. The four older bilingual
 * components (Projects, Blog, Hackathons, Testimonials) duplicate whole objects
 * into _EN/_AR pairs, which means a corrected path silently misses its twin.
 * Splitting the axes makes that drift impossible rather than merely discouraged.
 */
const CAPABILITIES: Capability[] = [
  {
    id: "orchestration",
    Icon: Workflow,
    span: "lg:col-span-3",
    stack: ["OpenAI Agents SDK", "LangGraph", "Typed handoffs"],
    evidence: "backend/orchestration/",
  },
  {
    id: "constitution",
    Icon: ShieldCheck,
    span: "lg:col-span-3",
    stack: ["Guardrails", "Deterministic screen", "LLM classifier"],
    evidence: "backend/constitution/principles.json",
  },
  {
    id: "cloud",
    Icon: Boxes,
    span: "lg:col-span-2",
    stack: ["Kubernetes", "Docker", "GitHub Actions"],
    evidence: "k8s/ · 11 manifests",
  },
  {
    id: "mcp",
    Icon: Plug,
    span: "lg:col-span-2",
    stack: ["FastMCP", "Streamable HTTP", "6 tools"],
    evidence: "/mcp/server",
  },
  {
    id: "arabic",
    Icon: Languages,
    span: "lg:col-span-2",
    stack: ["RTL", "hreflang", "Bilingual agents"],
    evidence: "src/app/ar/ · content/ar/",
  },
];

type Solution = {
  id: string;
  Icon: LucideIcon;
  /** Capability names and proper nouns — never translated. */
  tags: string[];
  /**
   * The in-repo primitive this vertical is built ON — not a delivered
   * engagement. Rendered dir="ltr" so Arabic bidi cannot reorder the path.
   */
  substrate: string;
};

const SOLUTIONS: Solution[] = [
  {
    id: "finance",
    Icon: Banknote,
    tags: ["Auditable traces", "KYC intake", "Policy guardrails"],
    substrate: "backend/constitution/principles.json",
  },
  {
    id: "industry",
    Icon: Factory,
    tags: ["Supply-chain reasoning", "Inventory reordering", "Textile ERP"],
    substrate: "backend/orchestration/",
  },
  {
    id: "government",
    Icon: Landmark,
    tags: ["MCP", "On-premise", "Read-only by default"],
    substrate: "/mcp/server",
  },
];

type Entry = { title: string; desc: string };

/** Only prose is per-locale. t() cannot carry this — it returns strings, and
 *  neither i18n JSON file contains arrays. */
const COPY: Record<"en" | "ar", Record<string, Entry>> = {
  en: {
    orchestration: {
      title: "Agentic Orchestration",
      desc: "A triage orchestrator routes each request to one of four specialists in a single hop. Shared state is typed, and every run records its route and tool calls — so any answer can be explained afterwards rather than guessed at.",
    },
    constitution: {
      title: "Constitutional AI",
      desc: "Five written principles enforced as SDK guardrails, screened deterministically before any model call. Verified blocking 4 of 4 violations with no model reachable. It fails open, so a classifier outage degrades enforcement instead of taking the site down.",
    },
    cloud: {
      title: "Cloud-Native Deployment",
      desc: "Containerised services with manifests covering autoscaling, network policy and service monitoring — the parts that matter after the first deploy.",
    },
    mcp: {
      title: "MCP-First Tooling",
      desc: "Capability is exposed as MCP tools rather than bespoke endpoints. A real FastMCP server over Streamable HTTP, read-only by default, verified against a live client.",
    },
    arabic: {
      title: "Arabic & RTL Systems",
      desc: "Bilingual from the routing layer up: a canonical Arabic URL, RTL-aware typography, and agents that answer in the language they were asked in.",
    },
    finance: {
      title: "Financial & Wealth Agents",
      desc: "Advice that has to survive an audit. Every run records its route and its tool calls, so an answer can be replayed rather than defended from memory. Suitability, disclosure and Sharia-compliance rules belong in a written constitution — screened deterministically before any model is reached — and KYC intake is the same document problem read under the same constraints.",
    },
    industry: {
      title: "Industrial ERP Agents",
      desc: "Built on years inside Pakistan's textile value chain — fabric mills, CMT stitching units, exporters — where reordering is still a spreadsheet and a phone call. The orchestration layer is what turns that into reasoning: a specialist that reads stock, lead times and open orders, proposes the reorder, and hands off instead of guessing. The ERP itself is a separate product, launching 2026.",
    },
    government: {
      title: "Government & Enterprise",
      desc: "Institutional archives that cannot be uploaded anywhere. An MCP server exposes the documents as tools and runs inside the perimeter, so the agent reads the estate in place and the data never moves. Read-only is the default; a write-capable tool needs a stated reason.",
    },
  },
  ar: {
    orchestration: {
      title: "تنظيم الوكلاء الأذكياء",
      desc: "منسّق فرز يوجّه كل طلب إلى واحد من أربعة وكلاء متخصصين في قفزة واحدة. الحالة المشتركة محدّدة النوع، وكل تشغيل يسجّل مساره واستدعاءات أدواته — فيمكن تفسير أي إجابة بعد وقوعها، لا تخمينها.",
    },
    constitution: {
      title: "الذكاء الاصطناعي الدستوري",
      desc: "خمسة مبادئ مكتوبة تُطبَّق كحواجز حماية داخل الـ SDK، وتُفحص فحصاً حتمياً قبل أي استدعاء للنموذج. جرى التحقق من حجب 4 من 4 مخالفات دون أي نموذج متاح. والدستور يفشل مفتوحاً، فانقطاع المصنّف يُضعف التطبيق بدل أن يُسقط الموقع.",
    },
    cloud: {
      title: "النشر السحابي الأصيل",
      desc: "خدمات تعمل داخل حاويات، مع ملفات تعريف تغطي التوسّع التلقائي وسياسات الشبكة ومراقبة الخدمات — الأجزاء التي تهم بعد عملية النشر الأولى.",
    },
    mcp: {
      title: "أدوات MCP أولاً",
      desc: "تُعرَض القدرات كأدوات MCP بدل نقاط نهاية مخصّصة. خادم FastMCP حقيقي عبر Streamable HTTP، للقراءة فقط افتراضياً، جرى التحقق منه بعميل حيّ.",
    },
    arabic: {
      title: "العربية وأنظمة RTL",
      desc: "ثنائي اللغة من طبقة التوجيه صعوداً: رابط عربي أساسي، وطباعة تراعي الاتجاه من اليمين إلى اليسار، ووكلاء يجيبون باللغة التي سُئلوا بها.",
    },
    finance: {
      title: "وكلاء التمويل وإدارة الثروات",
      desc: "استشارات لا بد أن تصمد أمام التدقيق. كل تشغيل يسجّل مساره واستدعاءات أدواته، فيمكن إعادة تشغيل أي إجابة بدل الدفاع عنها من الذاكرة. وقواعد الملاءمة والإفصاح والامتثال لأحكام الشريعة مكانها دستور مكتوب يُفحص فحصاً حتمياً قبل الوصول إلى أي نموذج، وإجراءات «اعرف عميلك» هي المسألة المستندية ذاتها تُقرأ تحت القيود ذاتها.",
    },
    industry: {
      title: "وكلاء أنظمة ERP الصناعية",
      desc: "مبني على سنوات داخل سلسلة قيمة المنسوجات الباكستانية — مطاحن الأقمشة، ووحدات التخييط، والمصدّرين — حيث لا تزال إعادة الطلب جدول بيانات ومكالمة هاتفية. طبقة التنظيم هي ما يحوّل ذلك إلى استدلال: وكيل متخصص يقرأ المخزون ومهل التوريد والطلبات المفتوحة، فيقترح إعادة الطلب ويسلّم المهمة بدل أن يخمّن. أما نظام ERP نفسه فمنتج منفصل يُطلق في 2026.",
    },
    government: {
      title: "الحكومة والمؤسسات",
      desc: "أرشيفات مؤسسية لا يمكن رفعها إلى أي مكان. يعرض خادم MCP المستندات كأدوات، ويعمل داخل النطاق المؤمَّن، فيقرأ الوكيل الأرشيف في مكانه ولا تغادر البيانات موضعها. والقراءة فقط هي الوضع الافتراضي؛ وأي أداة قادرة على الكتابة تحتاج سبباً معلناً.",
    },
  },
};

export default function ExpertiseGrid() {
  const { t, locale } = useLocale();
  const copy = COPY[locale];

  return (
    <section id="expertise" className="py-24 relative">
      <div className="container mx-auto px-6">

        <Reveal className="text-center mb-14">
          {/* dir="ltr": Arabic bidi otherwise reorders the leading "//" to the
              trailing edge, rendering "capabilities //". */}
          <div dir="ltr" className="text-eyebrow font-mono text-gold/70 uppercase mb-3">
            {"// capabilities"}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("expertise.title")}{" "}
            <span className="text-brand">{t("expertise.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("expertise.subtitle")}
          </p>
        </Reveal>

        {/* Band A — proven. 3+3 / 2+2+2 bento; the asymmetry ranks the cards. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {CAPABILITIES.map((cap, index) => (
            <Reveal
              key={cap.id}
              step={index}
              className={`group relative flex flex-col overflow-hidden bg-surface-2 border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:border-brand/20 ${cap.span}`}
            >
              {/* Provenance hairline. Gold never lands on anything clickable. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
              />

              <cap.Icon className="w-9 h-9 text-brand-soft mb-4 transition-transform duration-300 group-hover:scale-110" />

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {copy[cap.id].title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                {copy[cap.id].desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {cap.stack.map((chip) => (
                  <span
                    key={chip}
                    dir="ltr"
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gold/15">
                <span
                  dir="ltr"
                  className="block font-mono text-[11px] text-gold/70 truncate"
                  title={cap.evidence}
                >
                  {"└ "}
                  {cap.evidence}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Band B — Agentic Business Solutions. Gold-edged glass, and every card
            names the in-repo primitive it stands on rather than a client. */}
        <Reveal className="text-center mt-20 mb-10">
          <div dir="ltr" className="text-eyebrow font-mono text-gold/70 uppercase mb-3">
            {"// business_solutions"}
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-3">
            {t("expertise.applyTitle")}
          </h3>
          <p className="text-muted-foreground/80 text-sm max-w-xl mx-auto">
            {t("expertise.applyNote")}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {SOLUTIONS.map((sol, index) => (
            <Reveal
              key={sol.id}
              step={index}
              className="group relative flex flex-col overflow-hidden glass-panel-gold rounded-2xl p-6"
            >
              {/* Soft gold crown. Ambient only — nothing here is clickable. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.16),transparent_70%)]"
              />

              <div className="relative flex items-start justify-between gap-3 mb-4">
                <sol.Icon className="w-9 h-9 text-gold-soft transition-transform duration-300 group-hover:scale-110" />
                <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-gold/25 text-gold/80">
                  {t("expertise.targetLabel")}
                </span>
              </div>

              <h4 className="relative font-display text-lg font-semibold text-foreground mb-2">
                {copy[sol.id].title}
              </h4>
              <p className="relative text-muted-foreground text-sm leading-relaxed flex-grow">
                {copy[sol.id].desc}
              </p>

              <div className="relative flex flex-wrap gap-1.5 mt-4">
                {sol.tags.map((tag) => (
                  <span
                    key={tag}
                    dir="ltr"
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-gold/20 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Substrate, not a case study. See the file header. */}
              <div className="relative mt-5 pt-4 border-t border-gold/15">
                <span
                  dir="ltr"
                  className="block font-mono text-[11px] text-gold/70 truncate"
                  title={sol.substrate}
                >
                  {"└ "}
                  {sol.substrate}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
