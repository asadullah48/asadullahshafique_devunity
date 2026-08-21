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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("industries.title")} <span className="text-brand">{t("industries.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
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
              className="group p-6 rounded-xl bg-surface-1/50 border border-border hover:border-brand/30 transition-all duration-300 hover:bg-surface-1/80"
            >
              <industry.Icon className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-foreground mb-1">{industry.title}</h3>
              <p className="text-brand text-xs font-medium mb-3">{industry.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
