"use client";

import {
  Workflow,
  ShieldCheck,
  Boxes,
  Plug,
  Languages,
  Banknote,
  Landmark,
  Ship,
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
 * Band B is target sectors. Those cards carry a dashed border and deliberately
 * carry NO evidence stamp — the absence is the honest signal that nothing has
 * shipped there yet. Do not add a stamp to a Band B card to make it look
 * stronger; move the card up to Band A once the code exists, or leave it.
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

const VERTICALS: { id: string; Icon: LucideIcon }[] = [
  { id: "finance", Icon: Banknote },
  { id: "government", Icon: Landmark },
  { id: "logistics", Icon: Ship },
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
      title: "Finance & Wealth",
      desc: "Policy-constrained advisory, document-heavy onboarding, and decisions that stay auditable. The guardrail layer above is the substrate this sector actually requires.",
    },
    government: {
      title: "Government & Enterprise",
      desc: "Large document estates served through an MCP server, so an agent reads institutional data in place without it leaving the perimeter.",
    },
    logistics: {
      title: "Logistics & Procurement",
      desc: "Sourcing, inspection and supplier workflows — the domain I ran by hand as a buying agent before there was anything to automate it with.",
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
      title: "التمويل والثروات",
      desc: "استشارات مقيّدة بالسياسات، وإجراءات تعريف كثيفة المستندات، وقرارات تبقى قابلة للتدقيق. طبقة الحواجز أعلاه هي الأساس الذي يتطلبه هذا القطاع فعلاً.",
    },
    government: {
      title: "الحكومة والمؤسسات",
      desc: "أرشيفات مستندية ضخمة تُقدَّم عبر خادم MCP، فيقرأ الوكيل البيانات المؤسسية في مكانها دون أن تغادر النطاق المؤمَّن.",
    },
    logistics: {
      title: "اللوجستيات والمشتريات",
      desc: "سير عمل التوريد والتفتيش والموردين — المجال الذي أدرته يدوياً كوكيل شراء قبل أن يوجد ما يؤتمته.",
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

        {/* Band B — target sectors. No stamp, dashed edge: nothing has shipped
            here yet, and the card is built to say so at a glance. */}
        <Reveal className="text-center mt-20 mb-10">
          <div dir="ltr" className="text-eyebrow font-mono text-muted-foreground/60 uppercase mb-3">
            {"// where_this_applies"}
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-3">
            {t("expertise.applyTitle")}
          </h3>
          <p className="text-muted-foreground/80 text-sm max-w-xl mx-auto">
            {t("expertise.applyNote")}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {VERTICALS.map((v, index) => (
            <Reveal
              key={v.id}
              step={index}
              className="group p-6 rounded-2xl bg-surface-1/50 border border-dashed border-border transition-all duration-300 hover:border-brand/30 hover:bg-surface-1/80"
            >
              <v.Icon className="w-8 h-8 text-muted-foreground mb-4 transition-colors duration-300 group-hover:text-brand-soft" />
              <h4 className="font-display text-base font-semibold text-foreground mb-2">
                {copy[v.id].title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {copy[v.id].desc}
              </p>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
