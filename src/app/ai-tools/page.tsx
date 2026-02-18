"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Brain, BookOpen, Lightbulb, Code2, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("error-solver");

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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            AI-Powered Tools
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Leverage the power of AI to solve errors, learn new topics, and contribute knowledge
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="error-solver" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Error Solver
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="teach" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Teach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="error-solver">
            <ErrorSolver />
          </TabsContent>

          <TabsContent value="learn">
            <LearnTool />
          </TabsContent>

          <TabsContent value="teach">
            <TeachTool />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

// Error Solver Component
function ErrorSolver() {
  const [formData, setFormData] = useState({
    error_message: "",
    code_snippet: "",
    language: "python",
    context: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/agent/solve-error`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Error solving error");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          AI Error Solver
        </CardTitle>
        <CardDescription>
          Paste your error message and code to get AI-powered solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="error_message">Error Message</Label>
            <Input
              id="error_message"
              placeholder="TypeError: 'int' object is not iterable"
              value={formData.error_message}
              onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="language">Programming Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="code_snippet">Code Snippet (Optional)</Label>
            <Textarea
              id="code_snippet"
              placeholder="for i in 5:&#10;    print(i)"
              value={formData.code_snippet}
              onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
              className="bg-zinc-800 border-zinc-700 font-mono"
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="context">Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="What were you trying to accomplish?"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Solve Error
              </>
            )}
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-500" />
                Explanation
              </h3>
              <p className="text-zinc-300">{result.explanation}</p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Solution
              </h3>
              <p className="text-zinc-300">{result.solution}</p>
            </div>

            {result.corrected_code && (
              <div className="p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-500" />
                  Corrected Code
                </h3>
                <pre className="bg-zinc-900 p-3 rounded text-sm overflow-x-auto">
                  <code>{result.corrected_code}</code>
                </pre>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Confidence:</span>
              <Progress value={result.confidence * 100} className="w-32" />
              <span className="text-sm text-zinc-300">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Learn Tool Component
function LearnTool() {
  const [formData, setFormData] = useState({
    topic: "",
    level: "beginner",
    learning_style: "interactive",
    questions: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const questionsArray = formData.questions
        .split("\n")
        .filter((q) => q.trim())
        .map((q) => q.trim());

      const response = await fetch(`${API_URL}/api/learn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          questions: questionsArray.length > 0 ? questionsArray : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Error fetching lesson");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Learn Through LLM
        </CardTitle>
        <CardDescription>
          Get personalized lessons on any topic tailored to your learning style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="topic">What do you want to learn?</Label>
            <Input
              id="topic"
              placeholder="Machine Learning, FastAPI, React..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value as any })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="learning_style">Learning Style</Label>
              <Select
                value={formData.learning_style}
                onValueChange={(value) => setFormData({ ...formData, learning_style: value as any })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interactive">Interactive</SelectItem>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="theoretical">Theoretical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="questions">Specific Questions (Optional)</Label>
            <Textarea
              id="questions"
              placeholder="What is ML?&#10;How does neural network work?"
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Lesson...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">📚 Lesson Plan</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300">
                  {result.lesson_plan}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">🔗 Resources</h3>
              <ul className="space-y-2">
                {result.resources.map((resource: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {resource}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">❓ Quiz Questions</h3>
              <ul className="space-y-2">
                {result.quiz_questions.map((question: string, index: number) => (
                  <li key={index} className="text-zinc-300">
                    <Badge variant="outline" className="mr-2">Q{index + 1}</Badge>
                    {question}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg">
              <h3 className="font-semibold mb-2">🚀 Next Steps</h3>
              <p className="text-zinc-300 text-sm">{result.next_steps}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Teach Tool Component
function TeachTool() {
  const [formData, setFormData] = useState({
    topic: "",
    content: "",
    difficulty: "intermediate",
    examples: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const examplesArray = formData.examples
        .split("\n")
        .filter((ex) => ex.trim())
        .map((ex) => ex.trim());

      const response = await fetch(`${API_URL}/api/teach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          examples: examplesArray.length > 0 ? examplesArray : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Error submitting content");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Teach to LLM
        </CardTitle>
        <CardDescription>
          Contribute your knowledge to help others learn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="FastAPI Dependency Injection"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Explain the concept clearly..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="examples">Examples (Optional)</Label>
            <Textarea
              id="examples"
              placeholder="def get_db():&#10;    yield db"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              className="bg-zinc-800 border-zinc-700 font-mono"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Contribute Knowledge
              </>
            )}
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg">
              <p className="text-green-300">{result.acknowledgment}</p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">📝 Structured Content</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300">
                  {result.structured_content}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">💡 Suggested Exercises</h3>
              <ul className="space-y-2">
                {result.suggested_exercises.map((exercise: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-semibold mb-3">🔗 Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {result.related_topics.map((topic: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
