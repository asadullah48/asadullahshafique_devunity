"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain, Factory, TrendingUp, Trophy, GraduationCap, Terminal,
  Github, Linkedin, Twitter, MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const HIGHLIGHT_ICONS = [Brain, Factory, TrendingUp, Trophy, GraduationCap, Terminal];
const HIGHLIGHT_KEYS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/asadullah48",
    icon: <Github className="w-5 h-5" />,
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/asadullah-shafique-a00679325/",
    icon: <Linkedin className="w-5 h-5" />,
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/texcotembroide1",
    icon: <Twitter className="w-5 h-5" />,
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/asadullahshafique",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/shafiqueasadullah",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "Medium",
    href: "https://medium.com/@texcotembroiderysourcinghouse",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13 12a5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5zm9.5 0c0 2.5-.7 4.5-1.5 4.5s-1.5-2-1.5-4.5.7-4.5 1.5-4.5 1.5 2 1.5 4.5zm2.5 0c0 2.5-.4 4.5-1 4.5s-1-2-1-4.5.4-4.5 1-4.5 1 2 1 4.5z" />
      </svg>
    ),
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "Discord",
    href: "https://discord.gg/kXfEYVGX",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    className: "text-muted-foreground hover:bg-brand/10 hover:text-brand",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923213771445",
    icon: <MessageCircle className="w-5 h-5" />,
    className: "text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]",
  },
];

const About = () => {
  const { t } = useLocale();

  const highlights = HIGHLIGHT_KEYS.map((k, i) => ({
    Icon: HIGHLIGHT_ICONS[i],
    title: t(`about.${k}Title`),
    description: t(`about.${k}Desc`),
  }));

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("about.title")} <span className="text-brand">{t("about.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("about.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start mb-8">

          {/* LEFT — Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-full lg:max-w-sm lg:shrink-0"
          >
            <Card className="bg-surface-1/50 border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">{t("about.bioName")}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-brand border-brand/40 text-xs">
                    {t("about.badgeAI")}
                  </Badge>
                  <Badge variant="outline" className="text-brand border-brand/40 text-xs">
                    {t("about.badgeCMT")}
                  </Badge>
                  <Badge variant="outline" className="text-brand border-brand/40 text-xs">
                    {t("about.badgeMarketing")}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                  {t("about.bio")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className={`rounded-lg p-2.5 bg-surface-2 transition-all ${link.className}`}
                    >
                      {link.icon}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT — Highlight Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 content-start">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group bg-surface-1/50 border-border hover:border-brand/30 transition-all duration-300 hover:bg-surface-1/80 h-full">
                  <CardContent className="p-6">
                    <item.Icon className="w-10 h-10 text-brand mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
