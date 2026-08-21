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
        <div className="min-h-screen bg-background">
            <div
                className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem]"
                style={{
                    mask: "radial-gradient(circle at center, transparent, black)",
                }}
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
