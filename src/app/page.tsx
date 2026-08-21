import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Industries from "@/components/Industries";
import Skills from "@/components/Skills";
import AgentEngineering from "@/components/AgentEngineering";
import Roadmap from "@/components/Roadmap";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Blog from "@/components/Blog";
import OpenSourceSection from "@/components/OpenSource";
import Testimonials from "@/components/Testimonials";
import Discord from "@/components/Discord";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TechMarquee from "@/components/TechMarquee";
import FloatingWidgets from "@/components/FloatingWidgets";

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
            {/* AI-engineering proof first; business services follow it */}
            <Hero />
            <TechMarquee />
            <About />
            <Skills />
            <AgentEngineering />
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
