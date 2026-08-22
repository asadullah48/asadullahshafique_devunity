import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code,
  Database,
  Globe,
  Layout,
  Smartphone,
  Terminal,
} from "lucide-react";

export default function ExplorePage() {
  const categories = [
    { name: "Web Development", icon: Globe },
    { name: "Mobile Development", icon: Smartphone },
    { name: "Backend Development", icon: Database },
    { name: "DevOps", icon: Terminal },
    { name: "UI/UX Design", icon: Layout },
    { name: "Data Science", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-foreground mt-14">
          Explore Topics
        </h1>
        <div className="mb-8">
          <Input
            className="bg-surface-1 border-border text-foreground placeholder-zinc-400"
            placeholder="Search topics..."
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card key={index} className="bg-surface-1 border-border">
              <CardHeader className="flex flex-row items-center space-x-4">
                <category.icon className="h-8 w-8 text-brand" />
                <CardTitle className="text-foreground">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore topics related to {category.name.toLowerCase()}.
                </p>
                <Button className="mt-4 bg-brand text-primary-foreground hover:bg-brand/90">
                  View Topics
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}