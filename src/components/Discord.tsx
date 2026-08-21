"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Users, Zap, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const DISCORD_INVITE = "https://discord.gg/kXfEYVGX";
const FEATURE_ICONS = [Users, Zap, Globe];
const FEATURE_KEYS = ["f1", "f2", "f3"] as const;

const CHANNELS = [
  "# general-chat",
  "# agentic-ai",
  "# nextjs-fastapi",
  "# hackathon-teams",
  "# project-showcase",
  "# resources",
];

const Discord = () => {
  const { t } = useLocale();

  const features = FEATURE_KEYS.map((k, i) => ({
    Icon: FEATURE_ICONS[i],
    title: t(`discord.${k}Title`),
    description: t(`discord.${k}Desc`),
  }));

  return (
    <section id="discord" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5865F2]/5 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("discord.title")} <span className="text-[#5865F2]">{t("discord.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-[#5865F2] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t("discord.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#5865F2]/10 via-zinc-900/80 to-zinc-900/50 border border-[#5865F2]/20 backdrop-blur-sm">
            <div className="absolute top-4 right-4 w-20 h-20 bg-[#5865F2]/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#5865F2]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{t("discord.hubTitle")}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
                    </span>
                    {t("discord.communityGrowing")}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
                  >
                    <feature.Icon className="w-8 h-8 text-[#5865F2] mb-3" />
                    <h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mb-8 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-semibold">
                  {t("discord.channelsLabel")}
                </p>
                <div className="space-y-2">
                  {CHANNELS.map((channel) => (
                    <div
                      key={channel}
                      className="text-sm text-zinc-400 hover:text-[#5865F2] transition-colors cursor-default py-0.5"
                    >
                      {channel}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#5865F2] text-white hover:bg-[#4752C4] text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#5865F2]/20">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t("discord.joinButton")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-xs text-zinc-500 mt-3">
                  {t("discord.freeNote")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Discord;
