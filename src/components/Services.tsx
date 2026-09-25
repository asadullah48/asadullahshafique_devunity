"use client";

// Still a client component — `useLocale()` reads a React context, which a
// server component cannot do. What changed is that it no longer pulls in
// framer-motion just to fade two elements in on scroll; see Reveal.tsx.
import React from "react";
import { TrendingUp, Bot, Factory } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/context/LocaleContext";

const Services = () => {
  const { t } = useLocale();

  // Agentic AI leads: it is the primary positioning, and the other two are
  // where that engineering is applied (an industry SaaS) or sold alongside it
  // (paid acquisition). Translation keys keep their original s1/s2/s3 names so
  // en.json and ar.json stay aligned.
  const services = [
    {
      Icon: Bot,
      title: t("services.s2Title"),
      description: t("services.s2Desc"),
      // One outcome line per service, matching the proof density of the
      // project cards. Every figure is backed: s2 by the live /mcp/server tool
      // count and the constitution's verified offline block, s3 by the module
      // list in s3Desc, s1 by the Al Rashidi testimonial. Do not add a metric
      // here that nothing can demonstrate.
      metric: t("services.s2Metric"),
      cta: t("services.s2CTA"),
      ctaHref: "#flagship-case-studies",
    },
    {
      Icon: Factory,
      title: t("services.s3Title"),
      description: t("services.s3Desc"),
      metric: t("services.s3Metric"),
      cta: t("services.s3CTA"),
      // The waitlist is collected through the contact form; this used to be an
      // unlinked span, so the CTA did nothing when clicked.
      ctaHref: "#contact",
      badge: t("services.s3Badge"),
    },
    {
      Icon: TrendingUp,
      title: t("services.s1Title"),
      description: t("services.s1Desc"),
      metric: t("services.s1Metric"),
      cta: t("services.s1CTA"),
      ctaHref: "#marketing",
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("services.title")} <span className="text-brand">{t("services.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("services.subtitle")}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              step={index}
              className="group flex flex-col p-6 rounded-xl bg-surface-1/50 border border-border hover:border-brand/30 transition-all duration-300 hover:bg-surface-1/80"
            >
              <service.Icon className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
              {service.badge && (
                <span className="self-start inline-block px-2 py-0.5 mb-3 text-xs font-semibold text-primary-foreground bg-brand rounded-full">
                  {service.badge}
                </span>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{service.description}</p>
              {/* Short mono label, so --brand rather than --brand-soft. */}
              <div
                dir="ltr"
                className="mt-4 font-mono text-[11px] leading-relaxed text-brand/75"
              >
                {"└ "}
                {service.metric}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  href={service.ctaHref}
                  className="text-brand text-sm font-medium hover:underline"
                >
                  {service.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
