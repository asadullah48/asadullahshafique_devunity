"use client";

import { motion } from "framer-motion";
import { Quote, Linkedin } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative bg-[#111111] border border-white/8 rounded-2xl p-6 hover:border-green-500/20 transition-all duration-300 flex flex-col"
    >
      <Quote
        className="w-8 h-8 mb-4 opacity-30"
        style={{ color: testimonial.avatarColor }}
      />

      <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1 italic">
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
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
          style={{ backgroundColor: testimonial.avatarColor }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{testimonial.name}</span>
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
          <div className="text-gray-500 text-xs">
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const { t, locale } = useLocale();
  const testimonials = locale === "ar" ? TESTIMONIALS_AR : TESTIMONIALS_EN;

  return (
    <section id="testimonials" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("testimonials.title")} <span className="text-green-400">{t("testimonials.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://linkedin.com/in/asadullah-shafique"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400/70 hover:text-blue-400 text-sm transition-colors duration-200"
          >
            <Linkedin className="w-4 h-4" />
            {t("testimonials.linkedInCTA")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
