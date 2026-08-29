"use client";

import { Quote, Linkedin } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

type Testimonial = {
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarColor: string;
  text: string;
  linkedIn?: string;
  context: string;
  // Marks the one quote promoted into <FeaturedTestimonial /> high on the page.
  // A flag rather than an index because the EN and AR arrays are ordered
  // independently and the names differ between them, so position is not a
  // stable identity across locales.
  featured?: boolean;
};

const TESTIMONIALS_EN: Testimonial[] = [
  {
    name: "Mohammed Al Rashidi",
    role: "General Manager",
    company: "Al Rashidi Real Estate, Dubai, UAE",
    avatar: "MA",
    avatarColor: "#84cc16",
    text: "Asadullah transformed how we generate leads online. The digital marketing system he built (property portals, social campaigns, and the analytics dashboard) cut our cost-per-lead by over 40% in the first quarter.",
    context: "Dubai Real Estate Digital Marketing",
    // Promoted over the Panaversity quote deliberately: a paying client
    // outranks a programme mentor for the enterprise reader, and this is the
    // only hard business number anywhere on the site (40% cost-per-lead).
    featured: true,
  },
  {
    name: "Tariq Mahmood",
    role: "Owner",
    company: "Mahmood Garments, Faisalabad",
    avatar: "TM",
    avatarColor: "#3b82f6",
    text: "The Textile ERP concept Asadullah presented is exactly what our industry needs. Our production tracking is currently all Excel and WhatsApp. This would change everything for CMT units like ours.",
    context: "Textile ERP Platform: Early Feedback",
  },
  {
    name: "Dr. Ameen Alam",
    role: "Instructor",
    company: "Panaversity",
    avatar: "AA",
    avatarColor: "#a855f7",
    text: "Asadullah has been one of the most consistent contributors in our hackathon series. His spec-first methodology and zero-defect delivery across six consecutive hackathons is a benchmark for other students.",
    context: "Panaversity Hackathon Series Mentor",
  },
];

const TESTIMONIALS_AR: Testimonial[] = [
  {
    name: "محمد الراشدي",
    role: "المدير العام",
    company: "Al Rashidi Real Estate، دبي، الإمارات",
    avatar: "MA",
    avatarColor: "#84cc16",
    text: "أسد الله غيّر طريقة توليد العملاء المحتملين عبر الإنترنت. نظام التسويق الرقمي الذي بناه (بوابات العقارات والحملات الاجتماعية ولوحة التحليلات) خفّض تكلفة الحصول على العميل بأكثر من 40% في الربع الأول.",
    context: "التسويق الرقمي للعقارات في دبي",
    featured: true,
  },
  {
    name: "طارق محمود",
    role: "المالك",
    company: "Mahmood Garments، فيصل آباد",
    avatar: "TM",
    avatarColor: "#3b82f6",
    text: "مفهوم منصة ERP للمنسوجات الذي قدّمه أسد الله هو بالضبط ما تحتاجه صناعتنا. تتبع الإنتاج لدينا حالياً كله في Excel وWhatsApp. هذا سيغيّر كل شيء لوحدات CMT مثلنا.",
    context: "منصة ERP للمنسوجات: ملاحظات مبكرة",
  },
  {
    name: "د. أمين عالم",
    role: "مدرس",
    company: "Panaversity",
    avatar: "AA",
    avatarColor: "#a855f7",
    text: "كان أسد الله من أكثر المساهمين ثباتاً في سلسلة الهاكاثونات لدينا. منهجيته Spec-First وتسليمه خالياً من الأخطاء عبر ستة هاكاثونات متتالية هو معيار يُحتذى به للطلاب الآخرين.",
    context: "مرشد سلسلة هاكاثونات Panaversity",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <Reveal
      step={index}
      className="relative bg-surface-2 border border-white/8 rounded-2xl p-6 hover:border-brand/20 transition-all duration-300 flex flex-col"
    >
      <Quote
        className="w-8 h-8 mb-4 opacity-30"
        style={{ color: testimonial.avatarColor }}
      />

      <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1 italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div
        className="text-xs px-2.5 py-1 rounded-full mb-5 w-fit"
        style={{
          backgroundColor: `${testimonial.avatarColor}15`,
          color: testimonial.avatarColor,
          border: `1px solid ${testimonial.avatarColor}30`,
        }}
      >
        {testimonial.context}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
          style={{ backgroundColor: testimonial.avatarColor }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-semibold text-sm">{testimonial.name}</span>
            {testimonial.linkedIn && (
              <a
                href={testimonial.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/60 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// One promoted quote, mounted high on the page (directly under About) so that
// third-party validation is read BEFORE the reader has scrolled past thirty-odd
// project cards. The full grid still lives at #testimonials.
//
// Deliberately NOT the py-24 + centred-header section contract: this is an
// interstitial band between two real sections, and giving it its own heading
// would make it a fourth section competing with the ones it sits between.
//
// It renders the SAME entry the grid renders further down, selected by the
// `featured` flag — never re-declared here. Copying the quote into this
// component would create a second literal free to drift from the first, which
// is the precise failure mode backend/knowledge/portfolio.json exists to end.
export function FeaturedTestimonial() {
  const { locale } = useLocale();
  const list = locale === "ar" ? TESTIMONIALS_AR : TESTIMONIALS_EN;
  const featured = list.find((x) => x.featured);
  // No flag set (someone removed it) is a content gap, not a crash: render
  // nothing rather than silently promoting whichever quote happens to be first.
  if (!featured) return null;

  return (
    <section className="py-16 bg-background" aria-label={featured.context}>
      <div className="container mx-auto px-6">
        <Reveal className="max-w-3xl mx-auto text-center">
          <Quote className="w-7 h-7 mx-auto mb-5 text-brand/40" />

          <blockquote className="text-lg lg:text-xl leading-relaxed text-foreground/90 italic">
            &ldquo;{featured.text}&rdquo;
          </blockquote>

          <div className="w-12 h-px bg-brand/40 mx-auto my-6" />

          <div className="flex items-center justify-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0"
              style={{ backgroundColor: featured.avatarColor }}
            >
              {featured.avatar}
            </div>
            <div>
              <div className="text-foreground font-semibold text-sm">
                {featured.name}
              </div>
              <div className="text-muted-foreground text-xs">
                {featured.role} · {featured.company}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { t, locale } = useLocale();
  const all = locale === "ar" ? TESTIMONIALS_AR : TESTIMONIALS_EN;
  // The promoted quote already renders in <FeaturedTestimonial /> up under
  // About, so it is excluded here rather than shown twice on one page.
  const testimonials = all.filter((x) => !x.featured);
  // Column count follows the surviving list: dropping one from three would
  // otherwise leave a gap in a hardcoded 3-up grid, and if the `featured`
  // flag is ever removed this silently returns to a full row.
  const cols =
    testimonials.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl";

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        <Reveal className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("testimonials.title")} <span className="text-brand">{t("testimonials.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </Reveal>

        <div className={`grid grid-cols-1 ${cols} gap-6 mx-auto`}>
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} />
          ))}
        </div>

        {/* step=4 trails the three cards above it, matching the old 0.4s delay. */}
        <Reveal step={4} className="text-center mt-10">
          <a
            href="https://linkedin.com/in/asadullah-shafique"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400/70 hover:text-blue-400 text-sm transition-colors duration-200"
          >
            <Linkedin className="w-4 h-4" />
            {t("testimonials.linkedInCTA")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default TestimonialsSection;
