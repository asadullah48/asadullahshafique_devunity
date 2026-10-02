"use client";

// Still a client component — `useLocale()` reads a React context, which a
// server component cannot do. What changed is that it no longer pulls in
// framer-motion just to fade two elements in on scroll; see Reveal.tsx.
import React from "react";
import { TrendingUp, Bot, Factory, Clock, ExternalLink } from "lucide-react";
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
      track: t("services.track1"),
      title: t("services.s2Title"),
      description: t("services.s2Desc"),
      // One outcome line per service, matching the proof density of the
      // project cards. Every figure is backed: s2 by the live /mcp/server tool
      // count and the constitution's verified offline block, s3 by the module
      // list in s3Desc, s1 by the twelve disciplines in #marketing. Do not add a metric
      // here that nothing can demonstrate.
      metric: t("services.s2Metric"),
      cta: t("services.s2CTA"),
      ctaHref: "#flagship-case-studies",
    },
    {
      Icon: Factory,
      track: t("services.track2"),
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
      track: t("services.track3"),
      title: t("services.s1Title"),
      description: t("services.s1Desc"),
      metric: t("services.s1Metric"),
      cta: t("services.s1CTA"),
      ctaHref: "#marketing",
    },
  ];

  // Concrete agent-engineering offers. Each names its deliverables and links
  // to a repository where that work already exists (CLAUDE.md §0). No prices
  // and no client outcomes: neither can be demonstrated from this repo.
  const engagements = [1, 2, 3].map((n) => ({
    n,
    title: t(`services.e${n}Title`),
    forWhom: t(`services.e${n}For`),
    duration: t(`services.e${n}Duration`),
    deliverables: t(`services.e${n}Deliverables`).split("|"),
    proof: t(`services.e${n}Proof`),
    proofHref: [
      "https://github.com/asadullah48/asadullahshafique_devunity/tree/main/evals",
      "https://github.com/asadullah48/ai-tradeflow",
      "#flagship-case-studies",
    ][n - 1],
  }));

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
              <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-brand/80">{service.track}</p>
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

        <div id="engagements" className="max-w-5xl mx-auto mt-20 scroll-mt-24">
          <Reveal className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("services.engTitle")}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("services.engSubtitle")}</p>
          </Reveal>
          <ol className="grid gap-6 md:grid-cols-3">
            {engagements.map((e, index) => (
              <Reveal
                as="li"
                key={e.n}
                step={index}
                className="flex flex-col rounded-xl border border-brand/30 bg-surface-1/60 p-6"
              >
                <h4 className="text-lg font-semibold text-foreground">{e.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{e.forWhom}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-foreground">
                  <Clock className="h-4 w-4 text-brand" aria-hidden="true" />
                  <span className="text-muted-foreground">{t("services.engDuration")}:</span> {e.duration}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand">{t("services.engDeliverables")}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground list-disc ps-5 flex-grow">
                  {e.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  {t("services.engProof")}:{" "}
                  <a
                    href={e.proofHref}
                    {...(e.proofHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-1 text-brand underline underline-offset-4"
                  >
                    {e.proof}
                    {e.proofHref.startsWith("http") && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
                  </a>
                </p>
                <div className="mt-5 pt-4 border-t border-border">
                  <Link href="#contact" className="inline-flex min-h-[44px] items-center text-brand text-sm font-medium hover:underline">
                    {t("services.engCta")}
                  </Link>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Services;
