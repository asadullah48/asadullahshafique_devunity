"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

type Skill = {
  name: string;
  icon: string;
  color: string;
  custom?: boolean;
  badge?: string;
};

const SKILL_TABS: Record<string, Skill[]> = {
  Languages: [
    { name: "TypeScript", icon: "typescript/typescript-original.svg", color: "#3178C6" },
    { name: "JavaScript", icon: "javascript/javascript-original.svg", color: "#F7DF1E" },
    { name: "Python",     icon: "python/python-original.svg",         color: "#3776AB" },
    { name: "HTML5",      icon: "html5/html5-original.svg",           color: "#E34F26" },
    { name: "CSS3",       icon: "css3/css3-original.svg",             color: "#1572B6" },
    { name: "SQL",        icon: "postgresql/postgresql-original.svg", color: "#4169E1" },
  ],
  Frameworks: [
    { name: "Next.js",      icon: "nextjs/nextjs-original.svg",           color: "#ffffff" },
    { name: "React",        icon: "react/react-original.svg",             color: "#61DAFB" },
    { name: "FastAPI",      icon: "fastapi/fastapi-original.svg",         color: "#009688" },
    { name: "Tailwind",     icon: "tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "Node.js",      icon: "nodejs/nodejs-original.svg",           color: "#339933" },
    { name: "Supabase",     custom: true, icon: "", badge: "SB",          color: "#3ECF8E" },
    { name: "Firebase",     icon: "firebase/firebase-original.svg",       color: "#FFCA28" },
    { name: "SQLAlchemy",   icon: "sqlalchemy/sqlalchemy-original.svg",   color: "#CC2927" },
    { name: "shadcn/ui",    custom: true, icon: "", badge: "UI",          color: "#ffffff" },
    { name: "Stripe",       icon: "stripe/stripe-original.svg",            color: "#635BFF" },
  ],
  "AI & Agents": [
    { name: "OpenAI API",        custom: true, icon: "", badge: "GPT",   color: "#10a37f" },
    { name: "Agents SDK",        custom: true, icon: "", badge: "AGT",   color: "#10a37f" },
    { name: "Claude / MCP",      custom: true, icon: "", badge: "MCP",   color: "#CC785C" },
    { name: "Gemini API",        custom: true, icon: "", badge: "GEM",   color: "#4285F4" },
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",   color: "#84cc16" },
    { name: "Constitutional AI", custom: true, icon: "", badge: "CAI",   color: "#84cc16" },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",   color: "#84cc16" },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",    color: "#a855f7" },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",    color: "#1C3C3C" },
    { name: "LlamaIndex",        custom: true, icon: "", badge: "LI",    color: "#fbba00" },
    { name: "n8n",               custom: true, icon: "", badge: "n8n",   color: "#ea4b71" },
    { name: "Hugging Face",      custom: true, icon: "", badge: "HF",    color: "#FFD21E" },
  ],
  "Cloud & DevOps": [
    { name: "Kubernetes",     icon: "kubernetes/kubernetes-original.svg",   color: "#326CE5" },
    { name: "Docker",         icon: "docker/docker-original.svg",           color: "#2496ED" },
    { name: "GitHub Actions", icon: "github/github-original.svg",          color: "#ffffff" },
    { name: "Helm",           custom: true, icon: "", badge: "HLM",        color: "#0F1689" },
    { name: "Kafka",          icon: "apachekafka/apachekafka-original.svg", color: "#ffffff" },
    { name: "Dapr",           custom: true, icon: "", badge: "DPR",        color: "#0D2192" },
    { name: "Prometheus",     custom: true, icon: "", badge: "PRO",        color: "#E6522C" },
    { name: "Grafana",        icon: "grafana/grafana-original.svg",         color: "#F46800" },
    { name: "Redis",          icon: "redis/redis-original.svg",             color: "#FF4438" },
    { name: "Terraform",      icon: "terraform/terraform-original.svg",     color: "#7B42BC" },
    { name: "Jaeger",         custom: true, icon: "", badge: "OTL",         color: "#60d0e4" },
  ],
  Platforms: [
    { name: "Vercel",         icon: "vercel/vercel-original.svg",      color: "#ffffff" },
    { name: "Koyeb",          custom: true, icon: "", badge: "KYB",    color: "#121212" },
    { name: "Cloudflare",     icon: "cloudflare/cloudflare-original.svg", color: "#F38020" },
    { name: "GitHub",         icon: "github/github-original.svg",      color: "#ffffff" },
    { name: "Supabase BaaS",  custom: true, icon: "", badge: "BaaS",   color: "#3ECF8E" },
    { name: "PostgreSQL",     icon: "postgresql/postgresql-original.svg", color: "#4169E1" },
    { name: "Ubuntu WSL",     icon: "ubuntu/ubuntu-original.svg",      color: "#E95420" },
  ],
  "OpenClaw Track": [
    { name: "OpenClaw",       custom: true, icon: "", badge: "OC",    color: "#84cc16" },
    { name: "CLAUDE.md",      custom: true, icon: "", badge: "CLD",   color: "#CC785C" },
    { name: "Spec-First Dev", custom: true, icon: "", badge: "SFD",   color: "#84cc16" },
    { name: "SKILL.md Files", custom: true, icon: "", badge: "SKL",   color: "#84cc16" },
    { name: "Digital FTE",    custom: true, icon: "", badge: "FTE",   color: "#a855f7" },
    { name: "Agent Factory",  custom: true, icon: "", badge: "AF",    color: "#84cc16" },
  ],
};

const TAB_KEYS = Object.keys(SKILL_TABS);

function SkillCard({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all duration-300 cursor-default select-none"
      style={{
        backgroundColor: hovered ? `${skill.color}12` : "transparent",
        borderColor: hovered ? `${skill.color}60` : "rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 0 20px ${skill.color}20` : "none",
      }}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {skill.custom ? (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
            style={{
              backgroundColor: `${skill.color}20`,
              color: skill.color,
              border: `1px solid ${skill.color}40`,
            }}
          >
            {skill.badge}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${DI}/${skill.icon}`}
            alt={skill.name}
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
            style={{ filter: skill.color === "#ffffff" ? "brightness(0.9)" : "none" }}
            loading="lazy"
          />
        )}
      </div>

      <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200 text-center leading-tight">
        {skill.name}
      </span>

      {hovered && (
        <motion.div
          layoutId="skill-glow"
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: skill.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
}

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const { t } = useLocale();

  const TAB_LABELS: Record<string, string> = {
    "Languages":      t("skills.tabLanguages"),
    "Frameworks":     t("skills.tabFrameworks"),
    "AI & Agents":    t("skills.tabAI"),
    "Cloud & DevOps": t("skills.tabCloud"),
    "Platforms":      t("skills.tabPlatforms"),
    "OpenClaw Track": t("skills.tabOpenClaw"),
  };

  return (
    <section id="skills" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("skills.title")} <span className="text-green-400">{t("skills.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-green-400 mx-auto mb-5" />
          <p className="text-gray-400 max-w-xl mx-auto">
            {t("skills.subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TAB_KEYS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-green-500 text-black shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                  : "border border-white/15 text-gray-400 hover:border-green-500/40 hover:text-white"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
          >
            {SKILL_TABS[activeTab].map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 text-sm mt-10"
        >
          {t("skills.footer")}
        </motion.p>
      </div>
    </section>
  );
}

export default SkillsSection;
