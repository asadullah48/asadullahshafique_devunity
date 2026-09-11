import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import About from "@/components/About";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Skills from "@/components/Skills";
import AgentEngineering from "@/components/AgentEngineering";
import AgentTrace from "@/components/AgentTrace";
import EngineeringEvidence from "@/components/EngineeringEvidence";
import AgentRuntime from "@/components/AgentRuntime";
import ForwardDeployed from "@/components/ForwardDeployed";
import ExpertiseGrid from "@/components/ExpertiseGrid";
import GrowthSkills from "@/components/GrowthSkills";
import Roadmap from "@/components/Roadmap";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Blog, { type PostSummary } from "@/components/Blog";
import { listArticleMeta, type ArticleMeta } from "@/lib/content";
import OpenSourceSection from "@/components/OpenSource";
import Testimonials, { FeaturedTestimonial } from "@/components/Testimonials";
import Discord from "@/components/Discord";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TechMarquee from "@/components/TechMarquee";
import FloatingWidgets from "@/components/FloatingWidgets";
import NeuralField from "@/components/NeuralField";

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
        <div className="min-h-[100dvh] bg-background">
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
            {/* Third substrate layer: a node/signal graph revealed around the
                cursor. Sits above the grid and vignette but still behind all
                content (-z-10), and deploys the data-flow / think-ring
                primitives that had been shipped but never called. */}
            <NeuralField />
            {/* AI-engineering proof first; business services follow it */}
            <Hero />
            {/* The credibility layer, immediately after the hero and before
                anything decorative. Every cell links to the artefact that
                verifies it — a live endpoint, a repo path, or a directory in
                this tree. It replaces the four count-up counters that used to
                sit inside the hero, two of which a stranger could not check.
                See src/lib/evidence.ts for the provenance of each. */}
            <ProofStrip />
            <TechMarquee />
            <About />
            {/* One promoted quote, immediately after About. Third-party
                validation was previously unreachable until position 13 of 17,
                below every project card — read by almost nobody. The full
                grid still renders at #testimonials further down; this is the
                same entry, not a copy. */}
            <FeaturedTestimonial />
            <Skills />
            <AgentEngineering />
            {/* Philosophy -> trace -> evidence, read as one block. The order is
                the argument: HOW I think about agents, then what one actual run
                does stage by stage, then the disciplines that make the run
                trustworthy. Splitting these across the page would leave the
                methodology section asserting things the reader cannot yet
                check. AgentTrace is labelled illustrative in two places; the
                file paths in its source column are real. */}
            <AgentTrace />
            <EngineeringEvidence />
            {/* The argument closes with the system actually running. AgentTrace
                above is explicitly illustrative; this is not — both panels here
                read live endpoints and print the outage when the free-tier
                backend is asleep. Putting the labelled-illustrative section
                immediately before the measured one is deliberate: the contrast
                is the point, and a reader just told "representative values"
                then meets real ones and can tell which is which. */}
            <AgentRuntime />
            {/* The FDE model sits directly after the harness/loop/graph
                framework: that section argues HOW agents are built, this one
                argues how they reach a customer and get paid for. Each of its
                seven steps cites the directory that proves it. */}
            <ForwardDeployed />
            {/* Applied capability follows the methodology that produced it. */}
            <ExpertiseGrid />
            <Roadmap />
            <Projects />
            <Hackathons />
            <Services />
            <Industries />
            {/* Non-engineering leverage, deliberately AFTER the services and
                verticals block and immediately BEFORE Blog: its "Read the
                writing" proof link points at #blog, so the evidence sits one
                scroll below the claim. It cites no file paths and carries no
                gold — see the header of GrowthSkills.tsx for why that matters. */}
            <GrowthSkills />
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
