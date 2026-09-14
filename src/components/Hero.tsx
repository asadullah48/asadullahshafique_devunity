"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, Download, Github, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/LocaleContext";
import HeroSystemDiagram from "@/components/HeroSystemDiagram";

/**
 * HERO — identity, thesis, proof path.
 *
 * WHAT WAS REMOVED, AND WHY
 * -------------------------
 * 1. THE ROTATING JOB TITLE. The typewriter cycled four roles, the last of
 *    which was "Digital Marketing Strategist". A visitor who landed mid-cycle
 *    read that as the headline claim. A rotating title cannot establish a
 *    primary identity — it establishes four competing ones and lets timing
 *    decide which the reader gets. The role is now a single static line.
 *
 * 2. THE FOUR COUNT-UP STATISTICS. Two did not survive the question "where
 *    would a stranger check this?":
 *      - "85% Code Reuse Rate" — self-reported; nothing measures it.
 *      - "149+ Tests Passing" — traces to ONE hackathon project
 *        (Hackathons.tsx:60), presented as a career-wide figure.
 *    A third, "Hackathons Won", overclaimed: the six entries' own `achievement`
 *    fields read Bronze / Silver / Silver / Gold / Platinum (in progress) /
 *    Completed. That is a progression ladder, not six competitive wins, and one
 *    is explicitly still in progress.
 *    Proof now lives one screen down in <ProofStrip />, where every figure is a
 *    link to the thing that verifies it.
 *
 * 3. THE ORBITING LOGO AVATAR, THE FAKE TERMINAL, THE AGENT CHIP STRIP.
 *    Between them: a 20s infinite rotation and a setTimeout chain that re-armed
 *    itself every 900ms for the lifetime of the tab. Replaced by
 *    <HeroSystemDiagram />, a server-rendered SVG of the topology the backend
 *    actually implements. The terminal in particular was a prop — it printed a
 *    scripted transcript ending "✓ Zero failures. 6/6 hackathons." A simulated
 *    console on a site arguing for engineering rigour is the wrong first
 *    impression.
 *
 * This stays a client component only because useLocale() is one. It now holds
 * no state, no effects and no timers.
 */
export function HeroSection() {
  const { t } = useLocale();

  return (
    <section
      id="home"
      // 100dvh, not 100vh — avoids the iOS Safari toolbar layout jump.
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background"
    >
      <div className="neural-grid absolute inset-0" aria-hidden="true" />
      {/* One ambient wash, down from three overlapping layers (radial plus two
          animated aurora blobs). Restraint is the brief. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,hsl(var(--brand)/0.06),transparent)]"
      />

      <div className="container relative z-raised flex flex-col items-center gap-14 py-24 lg:flex-row lg:gap-20">
        {/* ---------------------------------------------------------------
            COPY COLUMN — hierarchy reads top to bottom:
            identity -> role -> thesis -> supporting -> capabilities -> action.
            --------------------------------------------------------------- */}
        <Reveal className="reveal-x flex-1 text-center lg:text-start">
          <Reveal
            step={2}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-sm font-medium text-brand-soft">
              {t("hero.badge")}
            </span>
            <MapPin className="h-3 w-3 text-brand/60" aria-hidden="true" />
            <span className="text-xs text-brand/60">{t("hero.location")}</span>
          </Reveal>

          {/* The only <h1> on the page. */}
          <h1 className="mb-3 font-display text-display-md font-bold tracking-tight text-foreground lg:text-display-lg">
            Asadullah Shafique
          </h1>

          {/* The role, stated once and held still. */}
          <p className="mb-7 font-mono text-sm uppercase tracking-[0.2em] text-brand-soft lg:text-base">
            {t("hero.title")}
          </p>

          {/* The thesis. Sized between the name and the body so the eye lands
              here second — this is the sentence the visitor should leave with. */}
          <p className="mb-5 max-w-[24ch] text-balance text-2xl font-semibold leading-snug text-foreground lg:max-w-[26ch] lg:text-3xl">
            {t("hero.headline")}
          </p>

          <p className="mb-8 max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
            {t("hero.supporting")}
          </p>

          {/* Names the "watch it operate" frame before the visitor scrolls,
              without repeating the per-system pitch Projects.tsx and
              ProofStrip already make with citations — this line points at
              the mechanism (source-linked claims), not the systems. */}
          <p className="mb-8 max-w-[62ch] text-pretty text-sm leading-relaxed text-muted-foreground/80">
            {t("hero.ecosystemNote")}
          </p>

          {/* Capability line. Every term is backed by something in the repo:
              orchestration (backend/orchestration), MCP (a live FastMCP server
              at /mcp/server), A2A (protobridge/protocols/a2a.py), guardrails
              (backend/constitution), evaluation (evals/), Kubernetes (11
              manifests in k8s/). "Memory" appeared in the brief's suggested
              copy and is deliberately absent: no conversation or episodic
              memory exists in this codebase, and claiming an agentic capability
              the system does not have is the exact failure the rest of this
              pass is correcting. */}
          <p className="mb-10 border-s-2 border-brand/30 ps-4 font-mono text-xs leading-relaxed text-muted-foreground/80">
            {t("hero.capabilities")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button asChild variant="neon" size="lg">
              {/* #projects, not #systems: the anchor is referenced by the
                  Navbar, the Footer and several in-page links, so the id stays
                  put and only the LABEL changes to the brief's wording. */}
              <Link href="#projects">
                {t("hero.viewWork")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/asadullah48"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {t("hero.sourceCta")}
              </a>
            </Button>

            {/* Tertiary, not a third button — the one-primary rule in
                CLAUDE.md, extended: three equal-weight buttons is no
                hierarchy at all. */}
            <Button asChild variant="ghost" size="lg">
              <a
                href="/resume.pdf"
                download="Asadullah_Shafique_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("hero.downloadResume")}
              </a>
            </Button>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------
            SYSTEM COLUMN — architecture, not decoration.
            --------------------------------------------------------------- */}
        <Reveal
          step={1}
          className="reveal-x flex flex-shrink-0 flex-col items-center gap-8"
        >
          {/* The portrait stays, at a fraction of its former size. Identity
              belongs on a personal site; six orbiting vendor logos do not. */}
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-brand/40 bg-surface-2">
            <Image
              src="/images/asadullah-vector.png"
              alt="Asadullah Shafique"
              fill
              priority
              sizes="64px"
              className="scale-110 object-cover object-top"
            />
          </div>

          <HeroSystemDiagram />
        </Reveal>
      </div>
    </section>
  );
}

export default HeroSection;
