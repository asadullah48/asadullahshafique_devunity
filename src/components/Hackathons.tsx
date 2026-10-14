"use client";

import React from "react";
import { Reveal } from "@/components/Reveal";
import { Trophy, Calendar, MapPin, Award } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type HackathonTier = "Agent Factory" | "Platinum" | "Gold" | "Silver" | "Bronze";

/**
 * One row of portfolio.json `hackathons.results` — the same record the MCP
 * get_hackathons tool returns. Tier and completion status are read from it
 * (passed in by the server page) instead of being typed out here, so the
 * card cannot drift from the canonical record again. H4 once read
 * "Platinum (in progress)" here while portfolio.json said "Platinum".
 */
export type HackathonResult = { id: string; result: string; status?: string };

const TIERS: readonly HackathonTier[] = ["Agent Factory", "Platinum", "Gold", "Silver", "Bronze"];
const isTier = (value: string): value is HackathonTier =>
  (TIERS as readonly string[]).includes(value);

type HackathonEntry = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  description: string;
  technologies: string[];
  highlight: boolean;
};

const tierStyles: Record<HackathonTier, string> = {
  "Agent Factory": "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  "Platinum":      "bg-sky-500/20    text-sky-400    border border-sky-500/30",
  "Gold":          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "Silver":        "bg-muted/20   text-foreground/80   border border-border/30",
  "Bronze":        "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

const HACKATHONS_EN: HackathonEntry[] = [
  {
    id: "H5",
    title: "H5: Agent Factory",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    description: "Two-tier architecture: General Agent (Claude Code) builds Custom Agent (OpenAI Agents SDK). SKILL.md files as portable, monetizable intelligence units. Digital FTE model priced and deployed on Kubernetes + Dapr. Distribution targets OpenAI Apps ecosystem (800M users). 117-slide presentation mastered.",
    technologies: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    highlight: true,
  },
  {
    id: "H4",
    title: "H4: Cloud-Native Deployment",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    description: "Containerized H3 with multi-stage Docker builds. Kubernetes manifests: namespace, ConfigMap, Secrets, Deployments, StatefulSets, PVCs. Dapr service mesh, Kafka event-driven pub/sub, Prometheus + Grafana + Jaeger observability stack, Helm charts, GitHub Actions CI/CD.",
    technologies: ["Kubernetes", "Docker", "Dapr", "Kafka", "Prometheus", "Grafana", "Helm"],
    highlight: true,
  },
  {
    id: "H3",
    title: "H3: Advanced Todo",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    description: "149 tests passing. Recurring todos, templates, team collaboration, AI suggestions, calendar integration. Triple-layer Constitutional AI: 7 BLOCK patterns (academic dishonesty, illegal activity, harmful content), 5 FLAG patterns. 85% code reuse from H2.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Constitutional AI", "TypeScript"],
    highlight: true,
  },
  {
    id: "H2",
    title: "H2: AI-Powered Todo",
    organizer: "Panaversity Hackathon Series",
    date: "2025",
    location: "Online",
    description: "89 tests passing. Full-stack AI-powered todo with Constitutional AI integration. 70% code reuse from H1. Spec-first four-session methodology.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Constitutional AI"],
    highlight: false,
  },
  {
    id: "H1",
    title: "H1: Course Companion FTE",
    organizer: "Panaversity Hackathon Series",
    date: "2024",
    location: "Online",
    description: "Zero-Backend-LLM architecture. Course companion built as a Digital Full-Time Employee (FTE) model. 70% code reuse from H0.",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Zero-Backend Architecture"],
    highlight: false,
  },
  {
    id: "H0",
    title: "H0: Personal AI CTO",
    organizer: "Panaversity Hackathon Series",
    date: "2024",
    location: "Online",
    description: "Constitutional AI foundation. Established the spec-first methodology and constitutional constraint patterns that persist across all 6 subsequent hackathons.",
    technologies: ["TypeScript", "Constitutional AI", "LLMs"],
    highlight: false,
  },
];

const HACKATHONS_AR: HackathonEntry[] = [
  {
    id: "H5",
    title: "H5: مصنع الوكلاء",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2025",
    location: "عبر الإنترنت",
    description: "هندسة من طبقتين: الوكيل العام (Claude Code) يصنع الوكيل المخصص (OpenAI Agents SDK). ملفات SKILL.md كوحدات ذكاء قابلة للنقل والتسييل. نموذج الموظف الرقمي مُسعَّر ومنشور على Kubernetes + Dapr. يستهدف نظام OpenAI Apps البيئي (800 مليون مستخدم). 117 شريحة عرض مُتقنة.",
    technologies: ["Claude Code", "OpenAI Agents SDK", "SKILL.md", "MCP", "Kubernetes", "Dapr"],
    highlight: true,
  },
  {
    id: "H4",
    title: "H4: النشر السحابي الأصيل",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2025",
    location: "عبر الإنترنت",
    description: "حاويات H3 مع Docker متعدد المراحل. مانيفيستات Kubernetes: namespace وConfigMap وSecrets وDeployments وStatefulSets وPVCs. شبكة خدمات Dapr وKafka، مجموعة Prometheus + Grafana + Jaeger، مخططات Helm، وCI/CD بـ GitHub Actions.",
    technologies: ["Kubernetes", "Docker", "Dapr", "Kafka", "Prometheus", "Grafana", "Helm"],
    highlight: true,
  },
  {
    id: "H3",
    title: "H3: مهام متقدمة",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2025",
    location: "عبر الإنترنت",
    description: "149 اختباراً ناجحاً. مهام متكررة وقوالب وتعاون جماعي واقتراحات ذكاء اصطناعي وتكامل التقويم. ذكاء اصطناعي دستوري ثلاثي الطبقات: 7 أنماط BLOCK (غش أكاديمي، نشاط غير قانوني، محتوى ضار)، 5 أنماط FLAG. 85% إعادة استخدام كود من H2.",
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "Constitutional AI", "TypeScript"],
    highlight: true,
  },
  {
    id: "H2",
    title: "H2: مهام مدعومة بالذكاء الاصطناعي",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2025",
    location: "عبر الإنترنت",
    description: "89 اختباراً ناجحاً. مهام كاملة الحزمة مدعومة بالذكاء الاصطناعي مع تكامل الذكاء الاصطناعي الدستوري. 70% إعادة استخدام كود من H1. منهجية Spec-First المكونة من أربع جلسات.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Constitutional AI"],
    highlight: false,
  },
  {
    id: "H1",
    title: "H1: زميل الدورة الموظف الرقمي",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2024",
    location: "عبر الإنترنت",
    description: "هندسة Zero-Backend-LLM. مساعد دورة مبني كنموذج موظف رقمي متفرغ (FTE). 70% إعادة استخدام كود من H0.",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Zero-Backend Architecture"],
    highlight: false,
  },
  {
    id: "H0",
    title: "H0: المدير التقني الشخصي بالذكاء الاصطناعي",
    organizer: "سلسلة هاكاثونات Panaversity",
    date: "2024",
    location: "عبر الإنترنت",
    description: "أساس الذكاء الاصطناعي الدستوري. رسّخ منهجية Spec-First وأنماط القيود الدستورية التي استمرت عبر جميع الهاكاثونات الـ6 اللاحقة.",
    technologies: ["TypeScript", "Constitutional AI", "LLMs"],
    highlight: false,
  },
];

const Hackathons = ({ results }: { results: HackathonResult[] }) => {
  const { t, locale } = useLocale();
  const byId = new Map(results.map((r) => [r.id, r]));
  // An entry with no canonical result, or an unknown tier, is not rendered:
  // showing a card without its verified result is the drift this guards against.
  const hackathons = (locale === "ar" ? HACKATHONS_AR : HACKATHONS_EN).flatMap((entry) => {
    const record = byId.get(entry.id);
    if (!record || !isTier(record.result)) return [];
    return [{ ...entry, tier: record.result, completed: record.status === "completed" }];
  });

  const tierLabels: Record<HackathonTier, string> = {
    "Agent Factory": t("hackathons.agentFactory"),
    "Platinum":      t("hackathons.platinum"),
    "Gold":          t("hackathons.gold"),
    "Silver":        t("hackathons.silver"),
    "Bronze":        t("hackathons.bronze"),
  };

  return (
    <section id="hackathons" className="py-24 relative">
      <div className="container mx-auto px-4">
        <Reveal
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t("hackathons.title")} <span className="text-brand">{t("hackathons.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("hackathons.subtitle")}
          </p>
        </Reveal>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-surface-2 hidden md:block" />
          <div className="space-y-8">
            {hackathons.map((hackathon, index) => (
              <Reveal step={index}
                key={hackathon.title}
                className="reveal-x relative"
              >
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full border-2 border-brand bg-background hidden md:block z-10" />
                <div className={`md:ml-20 p-6 rounded-xl border transition-all duration-300 ${
                  hackathon.highlight
                    ? "bg-surface-1/70 border-brand/30 hover:border-brand/60"
                    : "bg-surface-1/50 border-border hover:border-border"
                }`}>
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        {hackathon.highlight && <Trophy className="w-5 h-5 text-brand" />}
                        {hackathon.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{hackathon.organizer}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tierStyles[hackathon.tier] ?? ""}`}>
                        {tierLabels[hackathon.tier]}
                      </span>
                      {hackathon.highlight && hackathon.completed && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium">
                          <Award className="w-3 h-3" />
                          {t("hackathons.completed")}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{hackathon.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {hackathon.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {hackathon.location}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hackathon.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs bg-surface-2 text-muted-foreground rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hackathons;
