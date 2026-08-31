"use client";

import {
  Clapperboard,
  Rss,
  PenTool,
  Coins,
  BadgeCheck,
  Target,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

/**
 * Beyond the Code — the seven non-engineering skills.
 *
 * THIS SECTION DELIBERATELY CARRIES NO GOLD AND NO EVIDENCE FOOTER, and that
 * absence is the whole design. Everywhere else on this page — ExpertiseGrid,
 * the Skills mastery matrix, ForwardDeployed — gold means exactly one thing:
 * *here is the path that proves it*. None of these seven can cite a path.
 * Dressing them in the same gold-edged glass would make an unbacked claim look
 * identical to a backed one, which is the precise failure CLAUDE.md's Reality
 * Rule exists to prevent.
 *
 * So they get their own section, in plain cyan, with no `└ path` line. A
 * reviewer scanning for provenance sees the difference without being told.
 *
 * Never add a gold hairline, a `glass-panel-gold`, or an evidence stamp here.
 * If a skill on this list ever DOES acquire repo evidence, it does not get a
 * gold line bolted on — it graduates into ExpertiseGrid instead.
 */

type Leverage = {
  id: string;
  Icon: LucideIcon;
  /** Bento width on lg. Six columns: 2+2+2, 2+2+2, then one full-width row. */
  span: string;
  /**
   * Optional proof link — an on-site anchor or an external profile that lets a
   * visitor check the claim themselves. Locale-agnostic by design; the label
   * lives in COPY beside the prose it belongs to.
   *
   * Only populated where something verifiable actually exists. An absent
   * `href` renders no link at all rather than a dead "learn more" — the same
   * discipline as the evidence paths elsewhere, applied to a softer claim.
   */
  href?: string;
  external?: boolean;
};

const LEVERAGE: Leverage[] = [
  // THE ONE CARD WITH NO PROOF LINK, AND IT STAYS THAT WAY UNTIL ONE EXISTS.
  // Swept the tree for a YouTube, Loom or hosted video asset and found none.
  // A "watch the pitch" link pointing at a channel that is not there would be
  // exactly the fabricated-evidence failure the file header forbids. When a
  // real pitch video ships, add `href` here and a `proof` label to both COPY
  // locales — nothing else needs to change.
  { id: "videoSales", Icon: Clapperboard, span: "lg:col-span-2" },
  {
    id: "content",
    Icon: Rss,
    span: "lg:col-span-2",
    href: "#blog",
  },
  {
    // Projects.tsx carries the case-study copy — persuasive writing a visitor
    // can judge on the spot, which is the only honest proof of copywriting
    // available on this site. Deliberately NOT #blog: that is already the
    // Content card's proof, and two cards pointing at one section proves less
    // than one card pointing at each.
    id: "copywriting",
    Icon: PenTool,
    span: "lg:col-span-2",
    href: "#projects",
  },
  {
    // The Services section IS the monetization system: three productized
    // offers, each with an outcome metric and a CTA. Not a claim about
    // revenue — a claim about packaging, which is what the card says.
    id: "monetization",
    Icon: Coins,
    span: "lg:col-span-2",
    href: "#services",
  },
  {
    id: "brand",
    Icon: BadgeCheck,
    span: "lg:col-span-2",
    href: "https://www.linkedin.com/in/asadullah-shafique-a00679325",
    external: true,
  },
  {
    // A contribution graph is the best public artifact for a habit loop:
    // self-updating, impossible to stage retroactively, and it shows the
    // plateau the card talks about rather than asserting it.
    id: "execution",
    Icon: Target,
    span: "lg:col-span-2",
    href: "#open-source",
  },
  // The multiplier gets the full-width anchor row on purpose: it is the only
  // one of the seven whose value is a function of the other six.
  //
  // Its proof is the weakest link on this page and the label is worded to
  // match: a testimonial proves a deal was CLOSED AND DELIVERED, not that it
  // was negotiated well. "See client outcomes" claims exactly that and no
  // more. Do not upgrade this label to imply the negotiation itself is on
  // display.
  {
    id: "negotiation",
    Icon: Handshake,
    span: "lg:col-span-6",
    href: "#testimonials",
  },
];

type Entry = { title: string; desc: string; proof?: string };

/** Only prose is per-locale. t() cannot carry this — it returns strings, and
 *  neither i18n JSON file contains arrays. Same split-axis shape as
 *  ExpertiseGrid, deliberately: one place to fix an href, two to translate a
 *  sentence. The _EN/_AR object duplication used by Projects and Blog is what
 *  lets a corrected link silently miss its twin. */
const COPY: Record<"en" | "ar", Record<string, Entry>> = {
  en: {
    videoSales: {
      title: "Video Sales & Pitching",
      desc: "Turning a product, a service or an idea into a video pitch that holds attention long enough to be believed. In an attention economy video is the shortest path from stranger to trust, and trust is the part that actually converts.",
    },
    content: {
      title: "Content Creation",
      desc: "Blogs, posts, podcasts, reels — the engine of visibility. Published consistently it stops being marketing and becomes the record that answers whether this person can actually do the work, before anyone thinks to ask.",
      proof: "Read the writing",
    },
    copywriting: {
      title: "Conversion Copywriting",
      desc: "Persuasion under constraint: an ad, an email, a landing page. Strong copy turns attention into action, which makes it load-bearing for everything else on this list — none of it survives weak words.",
      proof: "See the case-study copy",
    },
    monetization: {
      title: "Monetization Systems",
      desc: "Not hustle — systems. Packaging a skill into an offer, making the offer scalable, and running more than one income stream so no single client is a single point of failure. Strategy is the easy half; execution is the half that pays.",
      proof: "See the productized offers",
    },
    brand: {
      title: "Personal Brand",
      desc: "Reputation, packaged. A brand doing its job means opportunities arrive instead of being chased — clients, collaborations, and being in the room before the shortlist gets written.",
      proof: "Connect on LinkedIn",
    },
    execution: {
      title: "Execution & Discipline",
      desc: "Mindset is the input; shipped work is the only evidence. Goal-setting, resilience, and the habit loop that gets you through the plateau where most projects quietly stop.",
      proof: "See the contribution graph",
    },
    negotiation: {
      title: "Negotiation & Deal-Making",
      desc: "The multiplier on every other skill here. Closing a deal, structuring a partnership, or defusing a conflict — the value you capture is decided at the table, not in the build.",
      proof: "See client outcomes",
    },
  },
  ar: {
    videoSales: {
      title: "البيع بالفيديو والعرض التقديمي",
      desc: "تحويل منتج أو خدمة أو فكرة إلى عرض مصوّر يحتفظ بالانتباه مدة كافية ليُصدَّق. في اقتصاد الانتباه، الفيديو هو أقصر طريق من الغريب إلى الثقة، والثقة هي ما يحقّق التحويل فعلاً.",
    },
    content: {
      title: "صناعة المحتوى",
      desc: "مدوّنات ومنشورات وبودكاست ومقاطع قصيرة — محرّك الظهور. حين يُنشر بانتظام يتوقف المحتوى عن كونه تسويقاً ويصير السجل الذي يجيب عمّا إذا كان صاحبه يستطيع فعل العمل، قبل أن يخطر السؤال لأحد.",
      proof: "اقرأ المقالات",
    },
    copywriting: {
      title: "كتابة إعلانية تحويلية",
      desc: "إقناع تحت قيد: إعلان، أو بريد، أو صفحة هبوط. الكتابة القوية تحوّل الانتباه إلى فعل، وهذا ما يجعلها المهارة الحاملة لكل ما في هذه القائمة — لا شيء هنا ينجو من كلمات ضعيفة.",
      proof: "اطّلع على نصوص دراسات الحالة",
    },
    monetization: {
      title: "أنظمة تحقيق الدخل",
      desc: "ليست جهداً عشوائياً بل أنظمة. تغليف المهارة في عرض، وجعل العرض قابلاً للتوسّع، وتشغيل أكثر من مصدر دخل حتى لا يكون عميل واحد نقطة فشل وحيدة. الاستراتيجية هي النصف السهل، والتنفيذ هو النصف الذي يُدفع مقابله.",
      proof: "اطّلع على العروض المُعبَّأة",
    },
    brand: {
      title: "العلامة الشخصية",
      desc: "سمعة مُغلَّفة. حين تؤدي العلامة عملها تأتي الفرص بدل أن تُطارَد — عملاء، وشراكات، وحضور في الغرفة قبل أن تُكتب القائمة القصيرة.",
      proof: "تواصل عبر لينكدإن",
    },
    execution: {
      title: "التنفيذ والانضباط",
      desc: "العقلية مُدخَل، والعمل المنجَز هو الدليل الوحيد. وضع الأهداف، والصلابة، وحلقة العادات التي تعبر بك الهضبة التي تتوقف عندها معظم المشاريع بصمت.",
      proof: "اطّلع على سجل المساهمات",
    },
    negotiation: {
      title: "التفاوض وإبرام الصفقات",
      desc: "المُضاعِف لكل مهارة أخرى هنا. إغلاق صفقة، أو هيكلة شراكة، أو نزع فتيل خلاف — القيمة التي تحصل عليها تُحسم على الطاولة، لا أثناء البناء.",
      proof: "اطّلع على نتائج العملاء",
    },
  },
};

export default function GrowthSkills() {
  const { t, locale } = useLocale();
  const copy = COPY[locale];

  return (
    <section id="leverage" className="py-24 relative">
      <div className="container mx-auto px-6">

        <Reveal className="text-center mb-14">
          {/* dir="ltr": Arabic bidi otherwise reorders the leading "//" to the
              trailing edge, rendering "leverage //". Same fix as ExpertiseGrid.
              Cyan, not gold — gold is reserved for evidence, and this section
              cites none. See the file header. */}
          <div dir="ltr" className="text-eyebrow font-mono text-brand/70 uppercase mb-3">
            {"// leverage"}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("leverage.title")}{" "}
            <span className="text-brand">{t("leverage.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("leverage.subtitle")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {LEVERAGE.map((item, index) => {
            const entry = copy[item.id];
            const isAnchor = item.span === "lg:col-span-6";

            return (
              <Reveal
                key={item.id}
                step={index}
                className={`group relative flex flex-col overflow-hidden bg-surface-2 border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:border-brand/30 hover:bg-surface-1/80 ${item.span}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <item.Icon className="w-9 h-9 text-brand-soft transition-transform duration-300 group-hover:scale-110" />
                  {isAnchor && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-brand/25 text-brand/80">
                      {t("leverage.multiplierLabel")}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {entry.title}
                </h3>
                {/* Body copy stays on --muted-foreground. Full-saturation
                    --brand vibrates at paragraph length on near-black; the
                    icon above is short enough to carry --brand-soft. */}
                <p
                  className={`text-muted-foreground text-sm leading-relaxed flex-grow ${
                    isAnchor ? "max-w-3xl" : ""
                  }`}
                >
                  {entry.desc}
                </p>

                {item.href && entry.proof && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <Link
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-brand text-sm font-medium hover:underline"
                    >
                      {entry.proof}
                    </Link>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
