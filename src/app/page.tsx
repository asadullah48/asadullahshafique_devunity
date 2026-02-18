import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import OpenSourceSection from "@/components/OpenSource";
import Footer from "@/components/Footer";

export default function Home() {
    return (
          <div className="min-h-screen bg-zinc-950">
                <div
                          className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem]"
                          style={{
                                      mask: "radial-gradient(circle at center, transparent, black)",
                          }}
                        />
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Hackathons />
                <OpenSourceSection />
                <Footer />
          </div>div>
        );
}</div>
