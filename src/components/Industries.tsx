"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, Building2, Store } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const Icons = [Scissors, Building2, Store];
const KEYS = ["i1", "i2", "i3"] as const;

const Industries = () => {
  const { t } = useLocale();

  const industries = KEYS.map((k, i) => ({
    Icon: Icons[i],
    title: t(`industries.${k}Title`),
    subtitle: t(`industries.${k}Sub`),
    description: t(`industries.${k}Desc`),
  }));

  return (
    <section id="industries" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("industries.title")} <span className="text-[#9CE630]">{t("industries.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            {t("industries.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all duration-300 hover:bg-zinc-900/80"
            >
              <industry.Icon className="w-10 h-10 text-[#9CE630] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-1">{industry.title}</h3>
              <p className="text-[#9CE630] text-xs font-medium mb-3">{industry.subtitle}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
