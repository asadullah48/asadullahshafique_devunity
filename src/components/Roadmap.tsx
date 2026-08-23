"use client";

import { Reveal } from "@/components/Reveal";
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
  topicKeys: string[];
};

const TRACKS: Track[] = [
  {
    id: "python",
    number: "00",
    icon: { kind: "devicon", slug: "python/python-original.svg" },
    color: "#3776AB",
    topicKeys: ["syntax", "oop", "async", "typeHints", "testing", "fastapi"],
  },
  {
    id: "docker",
    number: "01",
    icon: { kind: "devicon", slug: "docker/docker-original.svg" },
    color: "#2496ED",
    topicKeys: ["intro", "imagesContainers", "dockerizeNode", "portMapping", "compose", "networking", "volumes"],
  },
  {
    id: "redis",
    number: "02",
    icon: { kind: "devicon", slug: "redis/redis-original.svg" },
    color: "#FF4438",
    topicKeys: ["intro", "apiCaching", "rateLimiting", "messageQueue"],
  },
  {
    id: "systemDesign",
    number: "03",
    icon: { kind: "badge", text: "SD" },
    color: "hsl(var(--brand))",
    topicKeys: ["intro", "scaling", "nginx", "microservices", "dbScaling"],
  },
  {
    id: "cicd",
    number: "04",
    icon: { kind: "badge", text: "CD" },
    color: "#F05033",
    topicKeys: ["pipelines", "aws", "iac"],
  },
  {
    id: "ai",
    number: "05",
    icon: { kind: "badge", text: "AI" },
    color: "#10a37f",
    topicKeys: ["llms", "langchain", "rag", "vectorDbs"],
  },
];

export default function Roadmap() {
  const { t } = useLocale();

  return (
    <section id="roadmap" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        <Reveal className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("roadmap.title")}{" "}
            <span className="text-brand">{t("roadmap.titleHighlight")}</span>
          </h2>
          <div className="w-20 h-1 bg-brand mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("roadmap.subtitle")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TRACKS.map((track, index) => (
            <Reveal
              key={track.id}
              step={index}
              className="group p-6 rounded-2xl bg-surface-1/50 border border-border hover:border-brand/30 transition-all duration-300 hover:bg-surface-1/80"
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
                <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-full font-mono">
                  {track.number}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {t(`roadmap.${track.id}.title`)}
              </h3>
              <p className="text-xs font-medium mb-4" style={{ color: track.color }}>
                {t(`roadmap.${track.id}.subtitle`)}
              </p>

              <ul className="space-y-1.5">
                {track.topicKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "hsl(var(--brand))" }}
                    />
                    {t(`roadmap.${track.id}.topics.${key}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
