"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ameen Alam",
    role: "Co-Founder & CTO",
    company: "Panaversity",
    rating: 5,
    text: "Asadullah consistently delivers beyond expectations. His spec-first approach and ability to ship production-grade systems under hackathon constraints is rare. He's exactly the kind of developer the AI-native generation needs.",
  },
  {
    name: "Textile Factory Owner",
    role: "CMT Unit Operator",
    company: "Early Access Customer",
    rating: 5,
    text: "The ERP has eliminated our billing disputes completely. Before, we'd spend hours reconciling CMT bills manually. Now it's done automatically with full traceability. We haven't had a single invoice argument since we went live.",
  },
  {
    name: "Hackathon Peer",
    role: "Full-Stack Developer",
    company: "Panaversity Cohort",
    rating: 5,
    text: "Working alongside Asadullah in the Agent Factory hackathon was a masterclass in structured AI development. His Spec-Kit Plus methodology let us iterate 3x faster than any other team. The agent shipped and actually worked.",
  },
  {
    name: "DevUnity Community Member",
    role: "Software Engineer",
    company: "DevUnity Platform",
    rating: 5,
    text: "DevUnity is the open-source developer community I've been waiting for. Clean code, great docs, and a maintainer who actually responds to issues. I've learned more from reading the source than from tutorials.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#9CE630] text-[#9CE630]" />
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.split(" ");
  const initials =
    parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
  return (
    <div className="w-12 h-12 rounded-full bg-[#9CE630]/20 border border-[#9CE630]/40 flex items-center justify-center flex-shrink-0">
      <span className="text-[#9CE630] font-bold text-sm">{initials.toUpperCase()}</span>
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9CE630]/3 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            What People <span className="text-[#9CE630]">Say</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            Feedback from clients, collaborators, and community members.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#9CE630]/20" />

                <StarRating count={testimonials[current].rating} />

                <p className="text-zinc-300 text-lg leading-relaxed my-6 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <Initials name={testimonials[current].name} />
                  <div>
                    <div className="text-white font-semibold">{testimonials[current].name}</div>
                    <div className="text-zinc-500 text-sm">
                      {testimonials[current].role} · {testimonials[current].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-zinc-700 text-zinc-400 hover:border-[#9CE630] hover:text-[#9CE630] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#9CE630] w-6" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-zinc-700 text-zinc-400 hover:border-[#9CE630] hover:text-[#9CE630] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
