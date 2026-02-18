"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Box,
  Globe,
  Github,
  Plus,
  Upload,
  Trash2,
  ExternalLink,
  Code2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Project {
  id: number;
  name: string;
  description: string;
  framework: string;
  github_url?: string;
  demo_url?: string;
  tech_stack: string[];
  features: string[];
  created_date: string;
  updated_date: string;
}

export default function BackendlessPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("all");

  return (
    <div className="min-h-screen bg-zinc-950">
      <div
        className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0d0d0d_1px,transparent_1px),linear-gradient(to_bottom,#0d0d0d_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Box className="w-12 h-12 text-purple-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Backendless Projects
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Showcase your frontend-only projects, static sites, and JAMstack applications
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <CreateProjectForm onProjectCreated={() => fetchProjects()} />
          </div>
          <div className="lg:col-span-2">
            <ProjectList
              projects={projects}
              selectedFramework={selectedFramework}
              setSelectedFramework={setSelectedFramework}
              onRefresh={() => fetchProjects()}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  async function fetchProjects() {
    try {
      const response = await fetch(`${API_URL}/api/backendless`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }
}

function CreateProjectForm({ onProjectCreated }: { onProjectCreated: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    framework: "nextjs",
    github_url: "",
    demo_url: "",
    tech_stack: "",
    features: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/backendless`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tech_stack: formData.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
          features: formData.features.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          description: "",
          framework: "nextjs",
          github_url: "",
          demo_url: "",
          tech_stack: "",
          features: "",
        });
        onProjectCreated();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-500" />
          Create Project
        </CardTitle>
        <CardDescription>
          Add your frontend-only project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Portfolio"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="framework">Framework</Label>
            <Select
              value={formData.framework}
              onValueChange={(value) => setFormData({ ...formData, framework: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextjs">Next.js</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue.js</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="static">Static HTML</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="github_url">GitHub URL (Optional)</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="demo_url">Demo URL (Optional)</Label>
            <Input
              id="demo_url"
              placeholder="https://myproject.vercel.app"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input
              id="tech_stack"
              placeholder="TypeScript, Tailwind, Framer Motion"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              placeholder="Responsive design, Dark mode, SEO optimized"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </>
            )}
          </Button>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Project created successfully!
            </motion.div>
          )}
        </form>

        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> Backendless projects are frontend-only. 
            No backend API required. Perfect for portfolios, landing pages, and static sites.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectList({
  projects,
  selectedFramework,
  setSelectedFramework,
  onRefresh,
}: {
  projects: Project[];
  selectedFramework: string;
  setSelectedFramework: (f: string) => void;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetchProjects();
  });

  async function fetchProjects() {
    try {
      const response = await fetch(`${API_URL}/api/backendless`);
      if (response.ok) {
        const data = await response.json();
        // @ts-ignore
        setProjectsLocal(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const [projectsLocal, setProjectsLocal] = useState<Project[]>([]);

  const filteredProjects = selectedFramework === "all"
    ? projectsLocal
    : projectsLocal.filter((p) => p.framework === selectedFramework);

  const handleDelete = async (projectId: number) => {
    if (!confirm("Delete this project?")) return;

    try {
      const response = await fetch(`${API_URL}/api/backendless/${projectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onRefresh();
        fetchProjects();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-zinc-600" />
          <p className="text-zinc-500 mt-4">Loading projects...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label className="text-zinc-400">Filter by framework:</Label>
        <Select value={selectedFramework} onValueChange={setSelectedFramework}>
          <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="nextjs">Next.js</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="static">Static HTML</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Code2 className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-zinc-400">
              Create your first backendless project to showcase it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge variant="secondary">{project.framework}</Badge>
                      </div>
                      <p className="text-zinc-400 text-sm mb-4">{project.description}</p>

                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tech_stack.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500 text-xs">
                          Created {new Date(project.created_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
