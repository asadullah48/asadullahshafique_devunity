"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

type Pillar = {
  id: string;
  number: string;
  color: string;
  chips: string[];
};

const PILLARS: Pillar[] = [
  {
    id: "harness",
    number: "01",
    color: "#9CE630",
    chips: ["MCP Servers", "Memory", "Permissions", "Hooks", "Observability"],
  },
  {
    id: "loop",
    number: "02",
    color: "#60d0e4",
    chips: ["TDD", "Eval Harness", "Verification", "Self-Correction"],
  },
  {
    id: "graph",
    number: "03",
    color: "#a855f7",
    chips: ["LangGraph", "Human-in-the-Loop", "Retries", "Parallel Agents"],
  },
];

export default function AgentEngineering() {
  const { t } = useLocale();

  return (
    <section id="agent-engineering" className="py-24">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-xs font-mono text-green-400/60 uppercase tracking-widest mb-3">
            {"// agent_engineering"}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("agentEngineering.title")}{" "}
            <span className="text-[#9CE630]">{t("agentEngineering.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {t("agentEngineering.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group flex flex-col p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 transition-all duration-300 hover:bg-zinc-900/80"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${pillar.color}4d`;
                e.currentTarget.style.boxShadow = `0 0 24px ${pillar.color}14`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="text-sm font-bold font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    color: pillar.color,
                    backgroundColor: `${pillar.color}14`,
                    border: `1px solid ${pillar.color}33`,
                  }}
                >
                  {pillar.number}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                  {t(`agentEngineering.${pillar.id}.tag`)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {t(`agentEngineering.${pillar.id}.title`)}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                {t(`agentEngineering.${pillar.id}.desc`)}
              </p>

              <div
                className="text-xs font-mono leading-relaxed rounded-lg px-3 py-2.5 mb-5 border-l-2 bg-black/40 text-zinc-400"
                style={{ borderLeftColor: pillar.color }}
              >
                <span style={{ color: pillar.color }}>&gt; </span>
                {t(`agentEngineering.${pillar.id}.callout`)}
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5">
                {pillar.chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-500 group-hover:text-zinc-300 group-hover:border-zinc-700 transition-colors duration-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-zinc-600 text-sm mt-10 font-mono"
        >
          {t("agentEngineering.footer")}
        </motion.p>
      </div>
    </section>
  );
}
