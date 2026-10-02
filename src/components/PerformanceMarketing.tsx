"use client";

import { Eye, MousePointerClick, Filter, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * Performance Marketing — Track 3: twelve paid-acquisition competencies,
 * grouped by funnel stage.
 *
 * EVIDENCE POSTURE. These cards are self-reported skill, like GrowthSkills
 * was: they cite no file path, so they get plain cyan and no gold. No client
 * outcome is shown here. The illustrative funnel calculator and the link to a
 * client testimonial were removed on 2026-10-02: the calculator's presets were
 * invented numbers, and the testimonial was a scenario rather than a client
 * on record. Publish a result here only once a real client has approved it.
 */

type Stage = { id: StageId; Icon: LucideIcon; skills: SkillId[] };
type StageId = "attention" | "click" | "conversion" | "profit";
type SkillId =
  | "hook" | "ctr" | "fatigue"
  | "cpc" | "lookalike" | "retargeting"
  | "funnel" | "cvr" | "cpl" | "ab"
  | "roas" | "attribution";

const STAGES: Stage[] = [
  { id: "attention", Icon: Eye, skills: ["hook", "ctr", "fatigue"] },
  { id: "click", Icon: MousePointerClick, skills: ["cpc", "lookalike", "retargeting"] },
  { id: "conversion", Icon: Filter, skills: ["funnel", "cvr", "cpl", "ab"] },
  { id: "profit", Icon: TrendingUp, skills: ["roas", "attribution"] },
];

/** Formulas are language-neutral and render LTR in both locales. */
const FORMULA: Record<SkillId, string> = {
  hook: "3-sec plays ÷ impressions",
  ctr: "link clicks ÷ impressions",
  fatigue: "CTR ≤ 80% of peak · freq ≥ 2.5",
  cpc: "CPM ÷ (1000 × CTR)",
  lookalike: "seed = top customers by value",
  retargeting: "intent depth × recency window",
  funnel: "impr × CTR × CVR × close × value",
  cvr: "conversions ÷ visitors",
  cpl: "spend ÷ qualified leads",
  ab: "sample size fixed before launch",
  roas: "revenue ÷ spend  vs  1 ÷ margin",
  attribution: "last · first · linear · decay · 40/20/40",
};

type SkillCopy = { name: string; use: string };
type Copy = {
  stages: Record<StageId, { title: string; sub: string }>;
  skills: Record<SkillId, SkillCopy>;
};

const COPY: Record<"en" | "ar", Copy> = {
  en: {
    stages: {
      attention: { title: "Attention", sub: "Stop the scroll" },
      click: { title: "Traffic", sub: "Buy the right clicks" },
      conversion: { title: "Conversion", sub: "Turn visits into leads" },
      profit: { title: "Profit", sub: "Prove it paid" },
    },
    skills: {
      hook: { name: "Hook rate", use: "Test the first three seconds before anything else. A weak opening makes every later metric look worse than it is." },
      ctr: { name: "Click-through rate", use: "Read link CTR, not 'CTR (all)'. Rotate angles such as price, payment plan and location to find the message that earns the click." },
      fatigue: { name: "Creative fatigue", use: "Watch weekly CTR against its peak alongside frequency, and refresh the hook before cost per lead starts climbing." },
      cpc: { name: "Cost per click", use: "CPC is auction pressure divided by relevance. Raising CTR is usually the cheapest way to lower it." },
      lookalike: { name: "Lookalike audiences", use: "Seed from closed or qualified customers, not every lead. Seed quality decides audience quality." },
      retargeting: { name: "Retargeting", use: "Tier warm audiences by how far they got and answer the objection at that stage, with exclusions so no one sits in two tiers." },
      funnel: { name: "Funnel design", use: "Map every stage to a tracked event, then fix the stage whose 10% lift is cheapest to buy." },
      cvr: { name: "Conversion rate", use: "Match the landing page to the ad, keep one call to action, cut form fields and load fast on mobile." },
      cpl: { name: "Cost per lead", use: "Report cost per qualified lead next to CPL. A cheap lead that never qualifies is the most expensive kind." },
      ab: { name: "A/B testing", use: "One variable per test, sample size set before launch, full weeks only. Losing tests get logged too." },
      roas: { name: "ROAS", use: "Compare against break-even ROAS for the actual margin, and scale budget only while the gap holds." },
      attribution: { name: "Attribution models", use: "Compare models before moving budget. Last click flatters search; first click flatters prospecting social." },
    },
  },
  ar: {
    stages: {
      attention: { title: "الانتباه", sub: "إيقاف التمرير" },
      click: { title: "الزيارات", sub: "شراء النقرات الصحيحة" },
      conversion: { title: "التحويل", sub: "تحويل الزيارات إلى عملاء محتملين" },
      profit: { title: "الربحية", sub: "إثبات العائد" },
    },
    skills: {
      hook: { name: "معدل الجذب (Hook rate)", use: "اختبار الثواني الثلاث الأولى قبل أي شيء آخر؛ البداية الضعيفة تجعل كل مقياس لاحق يبدو أسوأ من حقيقته." },
      ctr: { name: "نسبة النقر (CTR)", use: "قراءة نسبة النقر على الرابط لا الإجمالية، وتدوير الزوايا مثل السعر وخطة الدفع والموقع لإيجاد الرسالة التي تستحق النقرة." },
      fatigue: { name: "إرهاق الإعلان", use: "مراقبة نسبة النقر الأسبوعية مقابل ذروتها مع معدل التكرار، وتجديد البداية قبل أن ترتفع تكلفة العميل المحتمل." },
      cpc: { name: "تكلفة النقرة (CPC)", use: "تكلفة النقرة هي ضغط المزاد مقسوماً على الملاءمة، ورفع نسبة النقر غالباً أرخص طريقة لخفضها." },
      lookalike: { name: "الجماهير المشابهة", use: "البناء على العملاء المُغلقين أو المؤهَّلين لا على كل العملاء المحتملين؛ جودة البذرة تحدد جودة الجمهور." },
      retargeting: { name: "إعادة الاستهداف", use: "تقسيم الجماهير الدافئة حسب عمق التفاعل والرد على الاعتراض في كل مرحلة، مع استثناءات تمنع التداخل." },
      funnel: { name: "تصميم مسار التحويل", use: "ربط كل مرحلة بحدث مُتتبَّع، ثم إصلاح المرحلة التي يكون تحسينها بنسبة 10% هو الأرخص." },
      cvr: { name: "معدل التحويل", use: "مطابقة صفحة الهبوط للإعلان، ودعوة واحدة لاتخاذ إجراء، وحقول أقل، وتحميل سريع على الجوال." },
      cpl: { name: "تكلفة العميل المحتمل (CPL)", use: "عرض تكلفة العميل المؤهَّل بجانب تكلفة العميل المحتمل؛ العميل الرخيص الذي لا يتأهل هو الأغلى." },
      ab: { name: "اختبارات A/B", use: "متغير واحد لكل اختبار، وحجم عينة محدد قبل الإطلاق، وأسابيع كاملة فقط، مع توثيق الاختبارات الخاسرة أيضاً." },
      roas: { name: "العائد على الإنفاق الإعلاني (ROAS)", use: "المقارنة مع نقطة التعادل وفق الهامش الفعلي، وزيادة الميزانية فقط ما دام الفارق قائماً." },
      attribution: { name: "نماذج الإسناد", use: "مقارنة النماذج قبل نقل الميزانية؛ النقرة الأخيرة تُجامل البحث، والنقرة الأولى تُجامل منصات التواصل." },
    },
  },
};

export default function PerformanceMarketing() {
  const { t, locale } = useLocale();
  const copy = COPY[locale];
  return (
    <section id="marketing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal className="text-center mb-14">
          {/* dir="ltr" keeps the leading "//" on the left in Arabic. Cyan, not
              gold: the competency cards cite no file path. See file header. */}
          <div dir="ltr" className="text-eyebrow font-mono text-brand/70 uppercase mb-3">
            {"// performance marketing"}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("marketing.title")}{" "}
            <span className="text-brand">{t("marketing.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("marketing.subtitle")}</p>
        </Reveal>

        {/* Four funnel stages, twelve competencies. The order is the funnel's
            order, so the numbering-free left-to-right read is the argument. */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STAGES.map((stage, si) => {
            const s = copy.stages[stage.id];
            return (
              <Reveal
                key={stage.id}
                step={si}
                className="flex flex-col bg-surface-2 border border-white/8 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <stage.Icon className="w-8 h-8 text-brand-soft shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs text-brand/80">{s.sub}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-4">
                  {stage.skills.map((id) => (
                    <li key={id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <p className="text-sm font-semibold text-foreground">{copy.skills[id].name}</p>
                      <p dir="ltr" className="font-mono text-[11px] text-brand-soft/80 mt-1 mb-2 break-words">
                        {FORMULA[id]}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{copy.skills[id].use}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="max-w-6xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{t("marketing.proofLead")}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#contact" className="text-brand text-sm font-medium hover:underline">
              {t("marketing.proofContact")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
