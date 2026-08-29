import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Skills from "@/components/Skills";
import AgentEngineering from "@/components/AgentEngineering";
import ForwardDeployed from "@/components/ForwardDeployed";
import ExpertiseGrid from "@/components/ExpertiseGrid";
import Roadmap from "@/components/Roadmap";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Blog from "@/components/Blog";
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

export default function Home() {
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
            <Blog />
            <OpenSourceSection />
            <Testimonials />
            <Discord />
            <Contact />
            <Footer />
            <FloatingWidgets />
        </div>
    );
}
