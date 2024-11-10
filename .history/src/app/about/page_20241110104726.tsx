import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@";
import { Users, MessageSquare, BookOpen, Code, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      title: "Vibrant Community",
      description: "Connect with developers from around the world",
      icon: Users,
    },
    {
      title: "Knowledge Sharing",
      description: "Ask questions and share your expertise",
      icon: MessageSquare,
    },
    {
      title: "Blog Platform",
      description: "Write and read insightful tech articles",
      icon: BookOpen,
    },
    {
      title: "Code Collaboration",
      description: "Work together on exciting projects",
      icon: Code,
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-pattern.png"
          alt="Background Pattern"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="animate-fade-in-up">
          <h1 className="mb-8 text-4xl font-bold text-white text-center mt-12 md:mt-14 lg:text-6xl">
            About <span className="text-[#9CE630]">DevUnity</span>
          </h1>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-lg text-zinc-300 leading-relaxed">
              DevUnity is a thriving community platform designed to bring
              developers together, foster collaboration, and promote knowledge
              sharing. Our mission is to create an inclusive space where
              developers of all levels can learn, grow, and connect with
              like-minded individuals.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-300">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm hover:bg-zinc-800/80 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <feature.icon className="h-8 w-8 text-[#9CE630]" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up animation-delay-600">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Join Our Community Today
          </h2>
          <Button className="bg-[#9CE630] text-black hover:bg-[#8BD520] text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#9CE630]/20">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}