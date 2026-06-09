"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

type TrackIcon =
  | { kind: "devicon"; slug: string }
  | { kind: "badge"; text: string };

type Track = {
  id: string;
  number: string;
  icon: TrackIcon;
  color: string;
  kind: "levels" | "topics";
  levels?: string[];
  topicKeys?: string[];
};

const TRACKS: Track[] = [
  {
    id: "python",
    number: "00",
    icon: { kind: "devicon", slug: "python/python-original.svg" },
    color: "#3776AB",
    kind: "levels",
    levels: ["basic", "intermediate", "advanced"],
  },
  {
    id: "docker",
    number: "01",
    icon: { kind: "devicon", slug: "docker/docker-original.svg" },
    color: "#2496ED",
    kind: "topics",
    topicKeys: ["intro", "imagesContainers", "dockerizeNode", "portMapping", "compose", "networking", "volumes"],
  },
  {
    id: "redis",
    number: "02",
    icon: { kind: "devicon", slug: "redis/redis-original.svg" },
    color: "#FF4438",
    kind: "topics",
    topicKeys: ["intro", "apiCaching", "rateLimiting", "messageQueue"],
  },
  {
    id: "systemDesign",
    number: "03",
    icon: { kind: "badge", text: "SD" },
    color: "#9CE630",
    kind: "topics",
    topicKeys: ["intro", "scaling", "nginx", "microservices", "dbScaling"],
  },
  {
    id: "cicd",
    number: "04",
    icon: { kind: "badge", text: "CD" },
    color: "#F05033",
    kind: "topics",
    topicKeys: ["pipelines", "aws", "iac"],
  },
  {
    id: "ai",
    number: "05",
    icon: { kind: "badge", text: "AI" },
    color: "#10a37f",
    kind: "topics",
    topicKeys: ["llms", "langchain", "rag", "vectorDbs"],
  },
];

export default function Roadmap() {
  const { t } = useLocale();

  return (
    <section id="roadmap" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("roadmap.title")}{" "}
            <span className="text-[#9CE630]">{t("roadmap.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-[#9CE630] mx-auto rounded-full mb-6" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            {t("roadmap.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TRACKS.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#9CE630]/30 transition-all duration-300 hover:bg-zinc-900/80"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${track.color}15`,
                    border: `1px solid ${track.color}30`,
                  }}
                >
                  {track.icon.kind === "devicon" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${DI}/${track.icon.slug}`}
                      alt={t(`roadmap.${track.id}.title`)}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: track.color }}
                    >
                      {track.icon.text}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
                  {track.number}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">
                {t(`roadmap.${track.id}.title`)}
              </h3>
              <p className="text-xs font-medium mb-4" style={{ color: track.color }}>
                {t(`roadmap.${track.id}.subtitle`)}
              </p>

              {track.kind === "levels" && track.levels ? (
                <div className="flex flex-wrap gap-2">
                  {track.levels.map((level) => (
                    <span
                      key={level}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${track.color}15`,
                        border: `1px solid ${track.color}40`,
                        color: track.color,
                      }}
                    >
                      {t(`roadmap.${track.id}.levels.${level}`)}
                    </span>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {track.topicKeys?.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#9CE630" }}
                      />
                      {t(`roadmap.${track.id}.topics.${key}`)}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
