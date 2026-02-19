import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Blog from "@/components/Blog";
import OpenSourceSection from "@/components/OpenSource";
import Discord from "@/components/Discord";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AIChatAgent from "@/components/AIChatAgent";

export default function Home() {
    return (
        <div className="min-h-screen bg-zinc-950">
            <div
                className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem]"
                style={{
                    mask: "radial-gradient(circle at center, transparent, black)",
                }}
            />
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Hackathons />
            <Blog />
            <OpenSourceSection />
            <Discord />
            <Contact />
            <Footer />
            <AIChatAgent />
        </div>
    );
}
