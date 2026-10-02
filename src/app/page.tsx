import type { Metadata } from "next";
import { ClaudeCredential } from "@/components/ClaudeCredential";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import AudiencePaths from "@/components/AudiencePaths";
import FlagshipCaseStudies from "@/components/FlagshipCaseStudies";
import About from "@/components/About";
import Services from "@/components/Services";
import AgentEngineering from "@/components/AgentEngineering";
import AgentTrace from "@/components/AgentTrace";
import EngineeringEvidence from "@/components/EngineeringEvidence";
import AgentRuntime from "@/components/AgentRuntime";
import ConnectMcp from "@/components/ConnectMcp";
import PerformanceMarketing from "@/components/PerformanceMarketing";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Blog, { type PostSummary } from "@/components/Blog";
import { listArticleMeta, type ArticleMeta } from "@/lib/content";
import OpenSourceSection from "@/components/OpenSource";
import Testimonials, { FeaturedTestimonial } from "@/components/Testimonials";
import Discord from "@/components/Discord";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";

// Page-scoped, NOT layout-scoped. In the root layout these inherit into every
// route in the app, which is how /resume ended up canonicalising itself to the
// homepage AND claiming an Arabic twin it does not have. Only "/" has a
// translation, so only "/" declares one. /ar declares the mirror image, and
// hreflang is discarded unless the pair is reciprocal.
export const metadata: Metadata = {
    alternates: {
        canonical: "/",
        languages: {
            en: "/",
            ar: "/ar",
            "x-default": "/",
        },
    },
};

// Frontmatter only — the homepage never receives article HTML. See Blog.tsx.
function toSummary(a: ArticleMeta): PostSummary {
    const { slug, title, excerpt, readTime, displayDate, tags, accentColor } = a;
    return { slug, title, excerpt, readTime, displayDate, tags, accentColor };
}

export default function Home() {
    const posts = {
        en: listArticleMeta("en").map(toSummary),
        ar: listArticleMeta("ar").map(toSummary),
    };
    return (
        // 100dvh, not 100vh — avoids the iOS Safari toolbar layout jump.
        <div className="portfolio-home min-h-[100dvh] bg-background">
            {/* Ambient substrate: two fixed, pointer-events-none paint layers —
                a masked cyan hairline grid, and an edge vignette that gives the
                flat carbon base a centre of gravity. Both are token-driven, so
                they retint with the theme instead of being pinned to a literal
                hex the way the previous #080808 grid was. */}
            <div
                className="command-field pointer-events-none fixed inset-0 -z-10 h-full w-full"
                aria-hidden="true"
            />
            <div
                className="command-vignette pointer-events-none fixed inset-0 -z-10 h-full w-full"
                aria-hidden="true"
            />

            {/* Restructured 2026-10-02 from external review feedback: one
                argument, told once. Seven sections that restated the
                methodology or listed self-reported skills left the homepage
                (TechMarquee, Skills, ForwardDeployed, ExpertiseGrid, Roadmap,
                Industries, GrowthSkills). Their components remain in
                src/components; restoring one is a one-line change here. */}
            <Hero />
            {/* The credibility layer, immediately after the hero. Every cell
                links to the artefact that verifies it — see src/lib/evidence.ts. */}
            <ProofStrip />
            <AudiencePaths />
            {/* Third-party validation beside the proof strip, not two thirds of
                the way down. Same entry as the #testimonials grid, not a copy. */}
            <FeaturedTestimonial />
            {/* The strongest agentic-AI evidence; the hero's secondary button
                and the AI-developer audience path both land here. */}
            <FlagshipCaseStudies />
            {/* The offer: three labelled tracks and the three agent-engineering
                engagements (#engagements), which the hero's primary button
                targets. */}
            <Services />
            {/* Philosophy -> trace -> evidence -> live system, read as one
                block. The order is the argument: HOW agents are built, what one
                run does (AgentTrace, labelled illustrative), the disciplines
                that make it trustworthy, then the real system running — the
                contrast between illustrative and measured is deliberate. */}
            <AgentEngineering />
            <AgentTrace />
            <EngineeringEvidence />
            <AgentRuntime />
            {/* Same endpoint and data file as the runtime panels above. */}
            <ConnectMcp />
            <Projects />
            <About />
            <section aria-label="Completed courses and certificates" className="container mx-auto px-6 py-10">
                <ClaudeCredential />
            </section>
            <Hackathons />
            {/* Track 3. Self-reported craft, shown as method: no client
                outcomes are published until one is on record. */}
            <PerformanceMarketing />
            <Blog posts={posts} />
            <OpenSourceSection />
            <Testimonials />
            <Discord />
            <Contact />
            <Footer />
            <FloatingWidgets />
        </div>
    );
}
