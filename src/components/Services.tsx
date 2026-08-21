"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Bot, Factory } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const Icons = [TrendingUp, Bot, Factory];

const Services = () => {
  const { t } = useLocale();

  const services = [
    {
      Icon: Icons[0],
      title: t("services.s1Title"),
      description: t("services.s1Desc"),
      cta: t("services.s1CTA"),
      ctaHref: "#contact",
      external: false,
    },
    {
      Icon: Icons[1],
      title: t("services.s2Title"),
      description: t("services.s2Desc"),
      cta: t("services.s2CTA"),
      ctaHref: "https://github.com/asadullah48",
      external: true,
    },
    {
      Icon: Icons[2],
      title: t("services.s3Title"),
      description: t("services.s3Desc"),
      cta: t("services.s3CTA"),
      ctaHref: "",
      external: false,
      badge: t("services.s3Badge"),
      waitlist: true,
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("services.title")} <span className="text-brand">{t("services.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col p-6 rounded-xl bg-surface-1/50 border border-border hover:border-brand/30 transition-all duration-300 hover:bg-surface-1/80"
            >
              <service.Icon className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
              {service.badge && (
                <span className="inline-block px-2 py-0.5 mb-3 text-xs font-semibold text-primary-foreground bg-brand rounded-full">
                  {service.badge}
                </span>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{service.description}</p>
              <div className="mt-6 pt-4 border-t border-border">
                {service.waitlist ? (
                  <span className="text-brand text-sm font-medium">
                    {service.cta}
                  </span>
                ) : service.external ? (
                  <Link
                    href={service.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand text-sm font-medium hover:underline"
                  >
                    {service.cta}
                  </Link>
                ) : (
                  <Link
                    href={service.ctaHref}
                    className="text-brand text-sm font-medium hover:underline"
                  >
                    {service.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
