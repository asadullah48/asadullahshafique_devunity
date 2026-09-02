import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin } from "lucide-react";

// Legacy DevUnity community directory. Not in sitemap.ts by design; noindex
// finishes that call so it stops sharing the homepage's title/description
// as a duplicate in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CommunityPage() {
  const members = [
    {
      name: "Habibullah",
      role: "Frontend Developer",
      description:
        "Passionate about creating beautiful and accessible user interfaces.",
      avatar: "/placeholder.svg?height=100&width=100",
      github: "",
      linkedin: "",
    },
    {
      name: "Yoursa Khan",
      role: "Backend Engineer",
      description: "Experienced in building scalable server-side applications.",
      avatar: "/placeholder.svg?height=100&width=100",
      github: "",
      linkedin: "",
    },
    {
      name: "Muhammad Anees",
      role: "Full Stack Developer",
      description:
        "Loves working on end-to-end solutions and learning new technologies.",
      avatar: "/placeholder.svg?height=100&width=100",
      github: "https://github.com/asadullah48/asadullahshafique_devunity.git",
      linkedin: "https://www.linkedin.com/in/asadullah-shafique-a00679325",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="mb-8 text-4xl font-bold text-foreground mt-14">
          Our Community
        </h1>
        <h2 className="sr-only">Community Members</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card key={index} className="bg-surface-1 border-border">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-foreground">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4 text-muted-foreground">{member.description}</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href={member.github}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href={member.linkedin}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}