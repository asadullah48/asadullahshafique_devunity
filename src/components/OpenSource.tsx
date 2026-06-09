"use client";

import { motion } from "framer-motion";
import { Github, GitFork, Star, Code2, Users } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const GITHUB_USERNAME = "asadullah48";

const STAT_ICONS = [Github, GitFork, Code2, Star, Users];
const STAT_VALUES = ["467+", "6", "85%", "10+", "3"];
const STAT_COLORS = ["#84cc16", "#3b82f6", "#a855f7", "#f59e0b", "#10b981"];
const STAT_LABEL_KEYS = ["s1Label", "s2Label", "s3Label", "s4Label", "s5Label"] as const;

const VALUE_KEYS = ["v1", "v2", "v3"] as const;
const VALUE_ICONS = ["🌐", "🧪", "🤝"];

export function OpenSourceSection() {
  const { t } = useLocale();

  const stats = STAT_LABEL_KEYS.map((k, i) => ({
    Icon: STAT_ICONS[i],
    value: STAT_VALUES[i],
    label: t(`opensrc.${k}`),
    color: STAT_COLORS[i],
  }));

  const values = VALUE_KEYS.map((k, i) => ({
    icon: VALUE_ICONS[i],
    title: t(`opensrc.${k}Title`),
    desc: t(`opensrc.${k}Desc`),
  }));

  return (
    <section id="open-source" className="py-24 bg-[#0d0d0d]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-xs font-mono text-green-400/60 uppercase tracking-widest mb-3">
            // open_source
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("opensrc.title")} <span className="text-green-400">{t("opensrc.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            {t("opensrc.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex flex-col items-center justify-center p-5 bg-[#111111] border border-white/8 rounded-xl hover:border-green-500/20 transition-all duration-300"
            >
              <stat.Icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 text-center">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 overflow-hidden rounded-2xl border border-white/8 bg-[#111111] p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Github className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">{t("opensrc.githubActivity")}</h3>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-green-400/60 hover:text-green-400 transition-colors"
            >
              @{GITHUB_USERNAME} →
            </a>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-center flex-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=chartreuse-dark&bg_color=111111&border_color=ffffff15&title_color=84cc16&icon_color=84cc16&text_color=9ca3af&hide_border=false&rank_icon=github`}
              alt="GitHub Stats"
              className="rounded-xl max-w-sm w-full"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=chartreuse-dark&bg_color=111111&border_color=ffffff15&title_color=84cc16&text_color=9ca3af&hide_border=false`}
              alt="Top Languages"
              className="rounded-xl max-w-sm w-full"
              loading="lazy"
            />
          </div>

          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://github-readme-streak-stats.herokuapp.com?user=${GITHUB_USERNAME}&theme=chartreuse-dark&background=111111&border=ffffff15&stroke=84cc16&ring=84cc16&fire=84cc16&currStreakLabel=84cc16`}
              alt="GitHub Streak"
              className="rounded-xl w-full max-w-lg"
              loading="lazy"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 bg-[#111111] border border-white/8 rounded-2xl hover:border-green-500/20 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="text-white font-semibold mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Github className="w-4 h-4" /> {t("opensrc.contributeGithub")}
          </a>
          <a
            href="https://discord.gg/kXfEYVGX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/40 text-[#7289da] font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            {t("opensrc.joinDiscord")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default OpenSourceSection;
