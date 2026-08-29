"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowDown, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";

// Terminal palette is token-driven so the transcript retints with the theme
// instead of staying lime on a carbon background.
const BRAND = "hsl(var(--brand))";
const DIM = "hsl(var(--muted-foreground))";

const TERMINAL_LINES = [
  { text: "$ claude code --spec-first", color: BRAND },
  { text: "> Booting SKILL.md agent...", color: DIM },
  { text: "> Spawning OpenAI Custom Agent", color: DIM },
  { text: "> Deploying → Kubernetes cluster", color: DIM },
  { text: "✓ Zero failures. 6/6 hackathons.", color: BRAND },
];

// Official vendor colors — these are identity marks, not UI accents, so they
// stay literal. The brand-cyan rule applies to interactive elements only.
const ORBIT_BADGES = [
  { label: "Next.js", color: "#ffffff", angle: 0 },
  { label: "Kubernetes", color: "#326CE5", angle: 60 },
  { label: "FastAPI", color: "#009688", angle: 120 },
  { label: "OpenAI SDK", color: "#10a37f", angle: 180 },
  { label: "Claude MCP", color: "#CC785C", angle: 240 },
  { label: "TypeScript", color: "#3178C6", angle: 300 },
];

function MonogramAvatar() {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-brand/10 blur-3xl" />
      {/* A 20s infinite rotate is the worst possible thing to run through a JS
          animation runtime: it never settles, so the main thread does work on
          every frame forever. As CSS it is handed to the compositor once. */}
      <div className="animate-orbit absolute inset-0 rounded-full border border-dashed border-brand/20" />
      <div className="absolute inset-4 rounded-full border border-brand/30" />

      {ORBIT_BADGES.map((badge, i) => {
        const rad = (badge.angle * Math.PI) / 180;
        const r = 128;
        const x = Math.round(Math.cos(rad) * r);
        const y = Math.round(Math.sin(rad) * r);
        return (
          <div
            key={badge.label}
            // The badge is positioned by a translate, and tailwindcss-animate's
            // zoom utilities animate `transform` too — they would fight, and
            // the badge would fly in from the container's centre. Animating
            // opacity only keeps the placement transform untouched.
            className="absolute text-xs font-mono px-2 py-0.5 rounded-full border animate-in fade-in-0 duration-500 fill-mode-backwards"
            suppressHydrationWarning
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${400 + i * 100}ms`,
              backgroundColor: `${badge.color}15`,
              borderColor: `${badge.color}50`,
              color: badge.color,
              whiteSpace: "nowrap",
            }}
          >
            {badge.label}
          </div>
        );
      })}

      {/* The spring is gone. This wraps the LCP image, so it must not start at
          opacity 0 — `zoom-in-95` alone scales it in from very nearly full
          size, leaving the image painted and measurable from the first frame
          rather than waiting on hydration. */}
      <div className="relative z-raised w-36 h-36 rounded-full border-2 border-brand/60 overflow-hidden shadow-neon-lg bg-surface-2 animate-in zoom-in-95 duration-500">
        <Image
          src="/images/asadullah-vector.png"
          alt="Asadullah Shafique"
          fill
          priority
          className="object-cover object-top scale-110"
        />
        <div className="absolute inset-0 bg-brand/5 rounded-full" />
      </div>
    </div>
  );
}

function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState(1);
  const done = visibleLines >= TERMINAL_LINES.length;

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) {
      const reset = setTimeout(() => setVisibleLines(1), 3000);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), 900);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="relative w-full max-w-xs bg-surface-1 border border-border rounded-panel overflow-hidden shadow-panel">
      {/* Scanline sweep — reads as the agent indexing its own output. */}
      {!done && (
        <div
          aria-hidden="true"
          className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-brand/[0.07] to-transparent"
        />
      )}

      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-2 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
        <div className="w-2.5 h-2.5 rounded-full bg-brand/60" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">
          agent-factory ~ asadullah
        </span>
      </div>

      <div className="p-4 font-mono text-xs space-y-1.5 min-h-[120px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={`${i}-${visibleLines}`}
            className="animate-in fade-in-0 slide-in-from-left-1 duration-200"
            style={{ color: line.color }}
          >
            {line.text}
            {i === visibleLines - 1 && (
              <span className="animate-caret" style={{ color: BRAND }}>
                █
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Vendor identity colors again — the lead agent now carries brand cyan.
const AGENT_MODES = [
  { id: "general", label: "Portfolio Guide", color: "#22D3EE" },
  { id: "python", label: "Backend Expert", color: "#009688" },
  { id: "nextjs", label: "Frontend Arch", color: "#3178C6" },
  { id: "agents", label: "Agent Builder", color: "#CC785C" },
] as const;

function AgentModeStrip() {
  return (
    <Reveal step={8}
      className="w-full max-w-xs"
    >
      <div className="text-eyebrow text-muted-foreground font-mono uppercase mb-2 px-1">
        {"// available_agents"}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {AGENT_MODES.map((mode) => (
          <div
            key={mode.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-mono transition-transform duration-200 ease-spring hover:-translate-y-0.5"
            style={{
              borderColor: `${mode.color}30`,
              backgroundColor: `${mode.color}08`,
              color: mode.color,
            }}
          >
            <span
              className="animate-think-pulse w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: mode.color }}
            />
            {mode.label}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/**
 * Replaces framer-motion's `useInView`.
 *
 * This is the one place in the file that genuinely needed JS: the count-up
 * animates a NUMBER's text content, which CSS cannot do. It is ~15 lines of
 * IntersectionObserver against the ~33 kB runtime it replaces.
 *
 * `once` is implicit — the observer disconnects on the first intersection, so
 * it cannot re-trigger and cannot leak.
 */
function useInViewOnce(ref: React.RefObject<Element>, rootMargin = "-100px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Guard for jsdom/older browsers: without IO, show the final state rather
    // than leaving the counters stuck at their initial value.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

// Initial state is the real value so server HTML (crawlers, link previews,
// no-JS readers) shows true numbers; the count-up runs only on the client
// and is skipped for prefers-reduced-motion.
function useCountUp(target: number, duration = 1800, inView = false) {
  const [count, setCount] = useState(target);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    started.current = true;
    let start = 0;
    setCount(0);
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}

function StatCounter({
  target,
  suffix,
  label,
  inView,
}: {
  target: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const count = useCountUp(target, 1600, inView);
  // The settled figure is carried by a real text node, not only the animating
  // one. useCountUp already initialises to `target` so no-JS crawlers read the
  // truth — but an agent that RUNS the JS and reads within the 1.6s tween
  // samples a partial value. One such review reported 1 / 15% / 26+ against
  // real targets of 6 / 85% / 149+: a single frame 288ms in, mistaken for four
  // separate typos. sr-only rather than aria-label because a bare <div> has no
  // ARIA role and is not guaranteed to expose an accessible name; a text node
  // always is — and it reaches text scrapers too, which aria-label would not.
  return (
    <div className="text-center lg:text-left">
      <div className="font-display text-2xl font-bold text-foreground tabular-nums">
        <span className="sr-only">
          {target}
          {suffix} {label}
        </span>
        <span aria-hidden="true">
          {count}
          {suffix}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-0.5" aria-hidden="true">
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLocale();

  const ROLES = useMemo(
    () => [t("hero.role1"), t("hero.role2"), t("hero.role3"), t("hero.role4")],
    [t]
  );

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDeleting(false);
    setRoleIndex(0);
  }, [ROLES]);

  useEffect(() => {
    const role = ROLES[roleIndex];
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

  const STATS = useMemo(
    () => [
      // 507 public repos measured 2026-08-27; shown as 507+ so the figure
      // stays true as the count grows rather than going stale downward.
      { target: 507, suffix: "+", label: t("hero.stats.repos") },
      { target: 6, suffix: "", label: t("hero.stats.hackathons") },
      { target: 85, suffix: "%", label: t("hero.stats.codeReuse") },
      { target: 149, suffix: "+", label: t("hero.stats.tests") },
    ],
    [t]
  );

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInViewOnce(statsRef);

  return (
    <section
      id="home"
      // 100dvh, not 100vh — avoids the iOS Safari toolbar layout jump.
      className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-background"
    >
      <div className="neural-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--brand)/0.07),transparent)]"
        aria-hidden="true"
      />

      {/* Aurora blobs. Cyan leads; violet is ambient-only and never sits
          under an interactive element. */}
      <div
        aria-hidden="true"
        className="animate-aurora-1 absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-brand/[0.07] blur-[130px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="animate-aurora-2 absolute -bottom-32 -right-24 w-[440px] h-[440px] rounded-full bg-violet/[0.08] blur-[110px] pointer-events-none"
      />

      <div className="container flex flex-col lg:flex-row items-center gap-16 relative z-raised py-24">
        <Reveal
          className="reveal-x flex-1 text-center lg:text-left"
        >
          <Reveal step={2}
            className="inline-flex items-center gap-2 bg-brand/10 border border-brand/25 rounded-full px-4 py-1.5 mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
            </span>
            <span className="text-brand text-sm font-medium">{t("hero.badge")}</span>
            <MapPin className="w-3 h-3 text-brand/60" />
            <span className="text-brand/60 text-xs">{t("hero.location")}</span>
          </Reveal>

          <h1 className="font-display text-display-lg lg:text-display-xl font-bold text-foreground mb-5">
            {t("hero.greeting")}{" "}
            <span className="text-brand relative">
              {t("hero.name")}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-brand/40" />
            </span>
          </h1>

          <div className="h-9 mb-6 flex items-center justify-center lg:justify-start">
            <span className="text-xl lg:text-2xl text-foreground/70 font-mono">
              {displayed}
              <Reveal as="span"
                className="text-brand"
              >
                |
              </Reveal>
            </span>
          </div>

          <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-[62ch] leading-relaxed">
            {t("hero.descPre")}{" "}
            <span className="text-foreground font-semibold">{t("hero.descBold1")}</span>{" "}
            {t("hero.descMid1")}{" "}
            <span className="text-brand font-semibold">{t("hero.descBold2")}</span>{" "}
            {t("hero.descMid2")}{" "}
            <span className="text-brand font-semibold">{t("hero.descBold3")}</span>
            {t("hero.descSuffix")}
          </p>

          {/* One `neon` per viewport — the resume download is deliberately
              quieter so the primary path stays unambiguous. */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
            <Button asChild variant="neon" size="lg">
              <Link href="#projects">
                {t("hero.viewWork")} <ArrowDown className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="/resume.pdf"
                download="Asadullah_Shafique_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" /> {t("hero.downloadResume")}
              </a>
            </Button>
          </div>

          <div
            ref={statsRef}
            className="flex flex-wrap items-center gap-6 justify-center lg:justify-start"
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-border" />}
                <StatCounter {...s} inView={statsInView} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal step={1}
          className="reveal-x flex-shrink-0 flex flex-col items-center gap-6"
        >
          <MonogramAvatar />
          <TerminalCard />
          <AgentModeStrip />
        </Reveal>
      </div>
    </section>
  );
}

export default HeroSection;
