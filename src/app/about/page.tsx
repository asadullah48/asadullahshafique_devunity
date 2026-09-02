import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, BookOpen, Code, ArrowRight } from "lucide-react";

// Legacy DevUnity community page — pitches "Vibrant Community," which
// contradicts the agentic-engineer positioning on `/` (see CLAUDE.md §2).
// Not in sitemap.ts by design; noindex finishes that call so it stops
// sharing the homepage's title/description as a duplicate in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-pattern.png"
          alt="Background Pattern"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="animate-fade-in-up">
          <h1 className="mb-8 text-4xl font-bold text-foreground text-center mt-12 md:mt-14 lg:text-6xl">
            About <span className="text-brand">DevUnity</span>
          </h1>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-lg text-foreground/80 leading-relaxed">
              DevUnity is a thriving community platform designed to bring
              developers together, foster collaboration, and promote knowledge
              sharing. Our mission is to create an inclusive space where
              developers of all levels can learn, grow, and connect with
              like-minded individuals.
            </p>
          </div>
        </div>

        <h2 className="sr-only">Community Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-300">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-surface-1/80 border-border backdrop-blur-sm hover:bg-surface-2/80 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <feature.icon className="h-8 w-8 text-brand" />
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up animation-delay-600">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Join Our Community Today
          </h2>
          <Button className="bg-brand text-primary-foreground hover:bg-brand/90 text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-brand/20">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}