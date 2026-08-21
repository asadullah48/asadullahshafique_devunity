"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

/**
 * `color` is a VENDOR IDENTITY MARK (TypeScript blue, Python blue, Anthropic
 * clay) — these are logos, not UI accents, so they stay literal. Same rule the
 * Hero's ORBIT_BADGES follow.
 *
 * `own: true` marks concepts that are ours, not a vendor's — RAG Systems,
 * SKILL.md, Agent Factory, Digital FTE. Those previously carried #84cc16 and
 * #a855f7, i.e. the RETIRED lime brand and a stray purple, which made our own
 * work the only thing on the page still wearing last season's palette. They
 * now render in brand cyan and are the visual anchor of the grid.
 */
type Skill = {
  name: string;
  icon: string;
  /** Vendor brand hex. Omitted when `own` is set. */
  color?: string;
  /** Our own concept — renders in brand tokens, not a literal. */
  own?: boolean;
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
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",   own: true },
    { name: "Constitutional AI", custom: true, icon: "", badge: "CAI",   own: true },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",   own: true },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",    own: true },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",    color: "#1C3C3C" },
    { name: "LlamaIndex",        custom: true, icon: "", badge: "LI",    color: "#fbba00" },
    { name: "n8n",               custom: true, icon: "", badge: "n8n",   color: "#ea4b71" },
    { name: "Hugging Face",      custom: true, icon: "", badge: "HF",    color: "#FFD21E" },
    { name: "A2A Protocol",      custom: true, icon: "", badge: "A2A",   color: "#4285F4" },
    { name: "Computer Use",      custom: true, icon: "", badge: "CU",    color: "#CC785C" },
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
    { name: "OpenClaw",       custom: true, icon: "", badge: "OC",    own: true },
    { name: "CLAUDE.md",      custom: true, icon: "", badge: "CLD",   color: "#CC785C" },
    { name: "Spec-First Dev", custom: true, icon: "", badge: "SFD",   own: true },
    { name: "SKILL.md Files", custom: true, icon: "", badge: "SKL",   own: true },
    { name: "Digital FTE",    custom: true, icon: "", badge: "FTE",   own: true },
    { name: "Agent Factory",  custom: true, icon: "", badge: "AF",    own: true },
  ],
};

const AGENT_ROLE_GROUPS: Record<string, Skill[]> = {
  "AI Agent Layer": [
    { name: "Claude / MCP",      custom: true, icon: "", badge: "MCP",  color: "#CC785C" },
    { name: "OpenAI Agents SDK", custom: true, icon: "", badge: "AGT",  color: "#10a37f" },
    { name: "LangChain",         custom: true, icon: "", badge: "LC",   color: "#1C3C3C" },
    { name: "RAG Systems",       custom: true, icon: "", badge: "RAG",  own: true },
    { name: "Prompt Eng.",       custom: true, icon: "", badge: "PE",   own: true },
    { name: "SKILL.md",          custom: true, icon: "", badge: "SKL",  own: true },
  ],
  "Backend Runtime": [
    { name: "Python",     icon: "python/python-original.svg",           color: "#3776AB" },
    { name: "FastAPI",    icon: "fastapi/fastapi-original.svg",         color: "#009688" },
    { name: "Docker",     icon: "docker/docker-original.svg",           color: "#2496ED" },
    { name: "PostgreSQL", icon: "postgresql/postgresql-original.svg",   color: "#4169E1" },
    { name: "Redis",      icon: "redis/redis-original.svg",             color: "#FF4438" },
    { name: "Supabase",   custom: true, icon: "", badge: "SB",          color: "#3ECF8E" },
  ],
  "Frontend Interface": [
    { name: "Next.js",    icon: "nextjs/nextjs-original.svg",           color: "#ffffff" },
    { name: "TypeScript", icon: "typescript/typescript-original.svg",   color: "#3178C6" },
    { name: "React",      icon: "react/react-original.svg",             color: "#61DAFB" },
    { name: "Tailwind",   icon: "tailwindcss/tailwindcss-original.svg", color: "#06B6D4" },
    { name: "shadcn/ui",  custom: true, icon: "", badge: "UI",          color: "#ffffff" },
    { name: "Framer",     custom: true, icon: "", badge: "FM",          color: "#0055FF" },
  ],
  "Infrastructure": [
    { name: "Kubernetes",     icon: "kubernetes/kubernetes-original.svg",    color: "#326CE5" },
    { name: "GitHub Actions", icon: "github/github-original.svg",            color: "#ffffff" },
    { name: "Vercel",         icon: "vercel/vercel-original.svg",            color: "#ffffff" },
    { name: "Terraform",      icon: "terraform/terraform-original.svg",      color: "#7B42BC" },
    { name: "Kafka",          icon: "apachekafka/apachekafka-original.svg",  color: "#ffffff" },
    { name: "Grafana",        icon: "grafana/grafana-original.svg",          color: "#F46800" },
  ],
};

const TAB_KEYS = Object.keys(SKILL_TABS);

function SkillCard({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);

  // Two rendering paths. Vendor marks keep their literal hex in inline styles
  // (hex+alpha suffixes like `${color}12` only work on hex, not on hsl()).
  // Our own concepts take the token path via classes, so they retint with the
  // theme and can never drift out of the palette again.
  const isOwn = !!skill.own;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-lg border transition-all duration-300 ease-spring cursor-default select-none ${
        isOwn
          ? "border-brand/20 bg-brand/[0.04] hover:border-brand/50 hover:bg-brand/10 hover:shadow-neon"
          : "border-border"
      }`}
      style={
        isOwn
          ? undefined
          : {
              backgroundColor: hovered ? `${skill.color}12` : "transparent",
              borderColor: hovered ? `${skill.color}60` : undefined,
              boxShadow: hovered ? `0 0 20px ${skill.color}20` : "none",
            }
      }
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {skill.custom ? (
          <div
            className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
              isOwn ? "bg-brand/15 text-brand border border-brand/40" : "border"
            }`}
            style={
              isOwn
                ? undefined
                : {
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                    borderColor: `${skill.color}40`,
                  }
            }
          >
            {skill.badge}
          </div>
        ) : (
          // Remote CDN sprites from jsdelivr. next/image would need a
          // remotePattern entry and buys nothing here — these are already
          // small, cached SVGs at a fixed 36px.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${DI}/${skill.icon}`}
            alt={`${skill.name} logo`}
            width={36}
            height={36}
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
            style={{ filter: skill.color === "#ffffff" ? "brightness(0.9)" : "none" }}
            loading="lazy"
          />
        )}
      </div>

      <span
        className={`text-xs transition-colors duration-200 text-center leading-tight ${
          isOwn ? "text-brand-soft group-hover:text-brand" : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {skill.name}
      </span>

      {hovered && (
        <motion.div
          layoutId="skill-glow"
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isOwn ? "bg-brand" : ""}`}
          style={isOwn ? undefined : { backgroundColor: skill.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.div>
  );
}

type SkillView = "technology" | "role";

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const [view, setView] = useState<SkillView>("technology");
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
    <section id="skills" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("skills.title")} <span className="text-brand">{t("skills.titleHighlight")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-brand mx-auto mb-5" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("skills.subtitle")}
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-surface-1 border border-border rounded-full p-1 gap-1">
            {(["technology", "role"] as SkillView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-spring active:scale-[0.97] ${
                  view === v
                    ? "bg-brand text-primary-foreground shadow-neon"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "technology" ? "By Technology" : "By Agent Role"}
              </button>
            ))}
          </div>
        </div>

        {view === "technology" ? (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {TAB_KEYS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-spring active:scale-[0.97] ${
                    activeTab === tab
                      ? "bg-brand text-primary-foreground shadow-neon"
                      : "border border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
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
          </>
        ) : (
          <div className="space-y-10">
            {Object.entries(AGENT_ROLE_GROUPS).map(([role, skills], groupIdx) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIdx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-brand uppercase tracking-widest">
                    {`// ${role.toLowerCase().replace(/ /g, "_")}`}
                  </span>
                  <div className="flex-1 h-px bg-brand/15" />
                  <span className="text-xs text-muted-foreground/70">{skills.length} tools</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {skills.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground/70 text-sm mt-10"
        >
          {t("skills.footer")}
        </motion.p>
      </div>
    </section>
  );
}

export default SkillsSection;
