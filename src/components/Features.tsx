import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Users, BookOpen } from "lucide-react";

const Features = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <MessageSquare className="h-12 w-12 text-brand" />
            <CardTitle className="text-foreground pt-4">Ask & Answer</CardTitle>
            <CardDescription className="text-muted-foreground">
              Post your questions and help others by sharing your knowledge
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <BookOpen className="h-12 w-12 text-brand" />
            <CardTitle className="text-foreground pt-4">Blog Posts</CardTitle>
            <CardDescription className="text-muted-foreground">
              Share your insights and experiences through detailed blog posts
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <Users className="h-12 w-12 text-brand" />
            <CardTitle className="text-foreground pt-4">Community</CardTitle>
            <CardDescription className="text-muted-foreground">
              Connect with like-minded developers and grow together
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};

export default Features;