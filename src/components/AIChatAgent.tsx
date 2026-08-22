// AI Chat Agent Component
// Provides an AI-powered chat interface for portfolio questions

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type AgentMode = "general" | "python" | "nextjs" | "agents";

const MODES: { id: AgentMode; label: string; emoji: string; color: string }[] = [
  { id: "general", label: "Guide",   emoji: "🤖", color: "hsl(var(--brand))" },
  { id: "python",  label: "Python",  emoji: "🐍", color: "#009688" },
  { id: "nextjs",  label: "Next.js", emoji: "⚡", color: "#3178C6" },
  { id: "agents",  label: "Agents",  emoji: "🧠", color: "#CC785C" },
];

const THINKING_STEPS = [
  "Searching knowledge base...",
  "Retrieving project data...",
  "Analyzing context...",
  "Composing response...",
];

const AIChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AgentMode>("general");
  const [thinkingStep, setThinkingStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Asadullah's AI portfolio assistant. Ask me about his skills, projects, hackathons, or how to get in touch!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setThinkingStep((s) => (s + 1) % THINKING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
    setInput("");
    setIsLoading(true);
    setThinkingStep(0);
    setStreamingContent("");

    // Declared outside try so the catch block can cancel it on error (Fix 3)
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

    try {
      const response = await fetch("/api/agent/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, mode }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream unavailable");
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let done = false;

      // Persistent buffer retains incomplete SSE lines that span chunk boundaries (Fix 2)
      let buffer = "";

      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last (potentially incomplete) line for the next iteration
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.token) {
                accumulated += data.token;
                setStreamingContent(accumulated);
              }
              if (data.done) {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: accumulated, timestamp: new Date() },
                ]);
                setStreamingContent("");
                done = true;
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (error) {
      // Cancel the reader to release the underlying stream lock on error (Fix 3)
      if (reader) {
        try { await reader.cancel(); } catch {}
      }
      console.error("Chat stream error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  // Suggestions follow the active agent mode so each expert feels distinct.
  const SUGGESTIONS_BY_MODE: Record<AgentMode, string[]> = {
    general: [
      "What are Asadullah's main skills?",
      "Tell me about his projects",
      "How can I contact him?",
      "What hackathons has he participated in?",
    ],
    python: [
      "How is the FastAPI backend structured?",
      "What does his contact API pipeline do?",
      "Which Python tools does he use daily?",
      "How does the streaming SSE endpoint work?",
    ],
    nextjs: [
      "How is this portfolio built?",
      "What's his approach to App Router?",
      "Which UI stack does he prefer?",
      "How does he handle EN/AR localization?",
    ],
    agents: [
      "Explain his harness × loop × graph framework",
      "What agents has he shipped?",
      "How does he use Claude MCP?",
      "What is spec-first agent development?",
    ],
  };
  const suggestedQuestions = SUGGESTIONS_BY_MODE[mode];

  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand rounded-full shadow-lg flex items-center justify-center hover:bg-brand/90 transition-colors"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="border border-border bg-surface-1/95 backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand to-brand-dim p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">Portfolio Assistant</h3>
                      <p className="text-xs text-primary-foreground/80">
                        {activeMode.emoji} {activeMode.label} Mode
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
                    style={
                      mode === m.id
                        ? { backgroundColor: `${m.color}25`, color: m.color, border: `1px solid ${m.color}60` }
                        : { backgroundColor: "transparent", color: "#6b7280", border: "1px solid transparent" }
                    }
                  >
                    <span>{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-brand"
                          : "bg-surface-3"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.role === "user"
                          ? "bg-brand text-primary-foreground"
                          : "bg-surface-2 text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {streamingContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="max-w-[80%] p-3 rounded-lg text-sm bg-surface-2 text-foreground">
                      {streamingContent}
                      <span className="inline-block w-1 h-3 ml-0.5 bg-brand animate-pulse" />
                    </div>
                  </motion.div>
                )}
                {isLoading && !streamingContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="bg-surface-2 px-3 py-2 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin text-muted-foreground flex-shrink-0" />
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={thinkingStep}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-muted-foreground font-mono"
                        >
                          {THINKING_STEPS[thinkingStep]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Sparkles className="w-3 h-3" />
                    Suggested questions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(question)}
                        className="text-xs px-3 py-1.5 bg-surface-2 hover:bg-surface-3 text-foreground/80 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-surface-2 border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
                    disabled={isLoading}
                  />
                  {/* Same retired-lime literal as Contact.tsx had. `default`
                      is the token-driven equivalent. `thinking` handles the
                      busy state; `disabled` still guards the empty-input case,
                      which is a genuinely separate condition. */}
                  <Button
                    type="submit"
                    size="sm"
                    thinking={isLoading}
                    disabled={!input.trim()}
                    aria-label="Send message"
                  >
                    {!isLoading && <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAgent;
