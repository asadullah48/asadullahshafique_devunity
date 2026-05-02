"use client";

import { motion } from "framer-motion";
import { Quote, Linkedin } from "lucide-react";

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

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mohammed Al Rashidi",
    role: "General Manager",
    company: "Al Rashidi Real Estate — Dubai, UAE",
    avatar: "MA",
    avatarColor: "#84cc16",
    text: "Asadullah transformed how we generate leads online. The digital marketing system he built — property portals, social campaigns, and the analytics dashboard — cut our cost-per-lead by over 40% in the first quarter.",
    context: "Dubai Real Estate Digital Marketing",
  },
  {
    name: "Tariq Mahmood",
    role: "Owner",
    company: "Mahmood Garments — Faisalabad",
    avatar: "TM",
    avatarColor: "#3b82f6",
    text: "The Textile ERP concept Asadullah presented is exactly what our industry needs. Our production tracking is currently all Excel and WhatsApp — this would change everything for CMT units like ours.",
    context: "Textile ERP Platform — Early Feedback",
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

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
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
        style={{ color: t.avatarColor }}
      />

      <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1 italic">
        &ldquo;{t.text}&rdquo;
      </p>

      <div
        className="text-xs px-2.5 py-1 rounded-full mb-5 w-fit"
        style={{
          backgroundColor: `${t.avatarColor}15`,
          color: t.avatarColor,
          border: `1px solid ${t.avatarColor}30`,
        }}
      >
        {t.context}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
          style={{ backgroundColor: t.avatarColor }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{t.name}</span>
            {t.linkedIn && (
              <a
                href={t.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/60 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="text-gray-500 text-xs">
            {t.role} · {t.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
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
            What People <span className="text-green-400">Say</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            From Dubai real estate to Faisalabad garment factories — feedback from the
            people I&apos;ve worked with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
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
            View LinkedIn Recommendations
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
