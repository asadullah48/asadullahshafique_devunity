"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowDown, Github, ExternalLink, MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const TERMINAL_LINES = [
  { text: "$ claude code --spec-first", color: "#84cc16" },
  { text: "> Booting SKILL.md agent...", color: "#9ca3af" },
  { text: "> Spawning OpenAI Custom Agent", color: "#9ca3af" },
  { text: "> Deploying → Kubernetes cluster", color: "#9ca3af" },
  { text: "✓ Zero failures. 6/6 hackathons.", color: "#84cc16" },
];

const ORBIT_BADGES = [
  { label: "Next.js",     color: "#ffffff", angle: 0   },
  { label: "Kubernetes",  color: "#326CE5", angle: 60  },
  { label: "FastAPI",     color: "#009688", angle: 120 },
  { label: "OpenAI SDK",  color: "#10a37f", angle: 180 },
  { label: "Claude MCP",  color: "#CC785C", angle: 240 },
  { label: "TypeScript",  color: "#3178C6", angle: 300 },
];

function MonogramAvatar() {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-green-500/10 blur-3xl" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-green-500/20"
      />
      <div className="absolute inset-4 rounded-full border border-green-500/30" />

      {ORBIT_BADGES.map((badge, i) => {
        const rad = (badge.angle * Math.PI) / 180;
        const r = 128;
        const x = Math.round(Math.cos(rad) * r);
        const y = Math.round(Math.sin(rad) * r);
        return (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="absolute text-xs font-mono px-2 py-0.5 rounded-full border"
            suppressHydrationWarning
            style={{
              left: `calc(50% + ${x}px)`,
              top:  `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              backgroundColor: `${badge.color}15`,
              borderColor: `${badge.color}50`,
              color: badge.color,
              whiteSpace: "nowrap",
            }}
          >
            {badge.label}
          </motion.div>
        );
      })}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-36 h-36 rounded-full border-2 border-green-500/60 overflow-hidden shadow-[0_0_40px_rgba(132,204,22,0.25)] bg-[#111111]"
      >
        <Image
          src="/images/asadullah-vector.png"
          alt="Asadullah Shafique"
          fill
          priority
          className="object-cover object-top scale-110"
        />
        <div className="absolute inset-0 bg-green-500/5 rounded-full" />
      </motion.div>
    </div>
  );
}

function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState(1);

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) {
      const reset = setTimeout(() => setVisibleLines(1), 3000);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), 900);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="w-full max-w-xs bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#111111] border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-gray-600 font-mono">agent-factory ~ asadullah</span>
      </div>
      <div className="p-4 font-mono text-xs space-y-1.5 min-h-[120px]">
        <AnimatePresence>
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`${i}-${visibleLines}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: line.color }}
            >
              {line.text}
              {i === visibleLines - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  style={{ color: "#84cc16" }}
                >█</motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const AGENT_MODES = [
  { id: "general", label: "Portfolio Guide", color: "#9CE630" },
  { id: "python",  label: "Backend Expert",  color: "#009688" },
  { id: "nextjs",  label: "Frontend Arch",   color: "#3178C6" },
  { id: "agents",  label: "Agent Builder",   color: "#CC785C" },
] as const;

function AgentModeStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="w-full max-w-xs"
    >
      <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-2 px-1">
        // available_agents
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {AGENT_MODES.map((mode) => (
          <div
            key={mode.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
            style={{
              borderColor: `${mode.color}30`,
              backgroundColor: `${mode.color}08`,
              color: mode.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: mode.color }}
            />
            {mode.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function useCountUp(target: number, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}

function StatCounter({ target, suffix, label, inView }: {
  target: number; suffix: string; label: string; inView: boolean;
}) {
  const count = useCountUp(target, 1600, inView);
  return (
    <div className="text-center lg:text-left">
      <div className="text-2xl font-bold text-white tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLocale();

  const ROLES = useMemo(() => [
    t("hero.role1"),
    t("hero.role2"),
    t("hero.role3"),
    t("hero.role4"),
  ], [t]);

  const [roleIndex, setRoleIndex]   = useState(0);
  const [displayed, setDisplayed]   = useState("");
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDeleting(false);
    setRoleIndex(0);
  }, [ROLES]);

  useEffect(() => {
    const role  = ROLES[roleIndex];
    const speed = deleting ? 35 : 65;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < role.length) {
          setDisplayed(role.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 2200);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setDeleting(false);
          setRoleIndex((p) => (p + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, deleting, roleIndex, ROLES]);

  const STATS = useMemo(() => [
    { target: 467, suffix: "+", label: t("hero.stats.repos")     },
    { target: 6,   suffix: "",  label: t("hero.stats.hackathons") },
    { target: 85,  suffix: "%", label: t("hero.stats.codeReuse")  },
    { target: 149, suffix: "+", label: t("hero.stats.tests")      },
  ], [t]);

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(132,204,22,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.035)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(132,204,22,0.06),transparent)]" />

      <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16 relative z-10">

        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-green-400 text-sm font-medium">{t("hero.badge")}</span>
            <MapPin className="w-3 h-3 text-green-400/60" />
            <span className="text-green-400/60 text-xs">{t("hero.location")}</span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-5 leading-tight">
            {t("hero.greeting")}{" "}
            <span className="text-green-400 relative">
              {t("hero.name")}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-green-400/40" />
            </span>
          </h1>

          <div className="h-9 mb-6 flex items-center justify-center lg:justify-start">
            <span className="text-xl lg:text-2xl text-gray-300 font-mono">
              {displayed}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="text-green-400"
              >|</motion.span>
            </span>
          </div>

          <p className="text-gray-400 text-base lg:text-lg mb-8 max-w-xl leading-relaxed">
            {t("hero.descPre")}{" "}
            <span className="text-white font-semibold">{t("hero.descBold1")}</span>{" "}
            {t("hero.descMid1")}{" "}
            <span className="text-green-400 font-semibold">{t("hero.descBold2")}</span>{" "}
            {t("hero.descMid2")}{" "}
            <span className="text-green-400 font-semibold">{t("hero.descBold3")}</span>
            {t("hero.descSuffix")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
            <Link
              href="#projects"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-[0_0_24px_rgba(132,204,22,0.35)]"
            >
              {t("hero.viewWork")} <ArrowDown className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/asadullah48"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 hover:border-green-500/50 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              <Github className="w-4 h-4" /> {t("hero.githubProfile")}
            </a>
            <a
              href="/resume.pdf"
              download="Asadullah_Shafique_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 hover:border-green-500/50 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" /> {t("hero.downloadResume")}
            </a>
          </div>

          <div ref={statsRef} className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                <StatCounter {...s} inView={statsInView} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex-shrink-0 flex flex-col items-center gap-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <MonogramAvatar />
          <TerminalCard />
          <AgentModeStrip />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">{t("hero.scroll")}</span>
        <ArrowDown className="w-4 h-4 text-green-400/40" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
