"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Bot, Factory } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description:
      "Full-spectrum digital marketing for Dubai real estate, UAE construction, and Pakistani businesses. Strategy, social media, paid ads, property portals, and monthly reporting.",
    cta: "See Marketing Plan →",
    ctaHref: "#contact",
    external: false,
  },
  {
    icon: Bot,
    title: "AI-Powered SaaS Development",
    description:
      "Production-grade agentic systems, cloud-native deployment, MCP servers, and custom AI agents. Built and deployed — not just prototyped.",
    cta: "View GitHub →",
    ctaHref: "https://github.com/asadullah48",
    external: true,
  },
  {
    icon: Factory,
    title: "Textile ERP Platform — Pakistan",
    description:
      "A full-spectrum ERP for Pakistan's textile industry — from Fabric Mills to garment exporters. Module 1: Fabric Mill — roll/lot management, weaving and knitting stage tracking, Yarn inventory, and Imported Fabric. Further modules: CMT order lifecycle, auto-billing, production sessions, dispatch, party ledgers, and financial accounts. Targeting Faisalabad, Sialkot, Gujranwala, Karachi, and Lahore.",
    cta: "Join Waitlist →",
    ctaHref: "",
    external: false,
    badge: "Launching 2026",
    waitlist: true,
  },
];

const Services = () => {
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            What I <span className="text-[#9CE630]">Offer</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            AI development, digital marketing, and industry-specific SaaS — built for real businesses.
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
              className="group flex flex-col p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all duration-300 hover:bg-zinc-900/80"
            >
              <service.icon className="w-10 h-10 text-[#9CE630] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              {(service as { badge?: string }).badge && (
                <span className="inline-block px-2 py-0.5 mb-3 text-xs font-semibold text-black bg-[#9CE630] rounded-full">
                  {(service as { badge?: string }).badge}
                </span>
              )}
              <p className="text-zinc-400 text-sm leading-relaxed flex-grow">{service.description}</p>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                {(service as { waitlist?: boolean }).waitlist ? (
                  <span className="text-[#9CE630] text-sm font-medium">
                    {service.cta}
                  </span>
                ) : service.external ? (
                  <Link
                    href={service.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CE630] text-sm font-medium hover:underline"
                  >
                    {service.cta}
                  </Link>
                ) : (
                  <Link
                    href={service.ctaHref}
                    className="text-[#9CE630] text-sm font-medium hover:underline"
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
