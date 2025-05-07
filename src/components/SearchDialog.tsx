"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, BookOpen, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: number;
  title: string;
  type: "question" | "blog" | "user";
  url: string;
  excerpt?: string;
  author?: string;
};

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 1,
      title: "How to optimize React performance?",
      type: "question",
      url: "/question/1",
      excerpt: "I'm working on a large React application and noticed some performance issues...",
      author: "habibullah",
    },
    {
      id: 2,
      title: "Getting Started with Next.js 14",
      type: "blog",
      url: "/blogs/1",
      excerpt: "Next.js 14 introduces several new features that make development faster...",
      author: "John Doe",
    },
    {
      id: 3,
      title: "Understanding React Server Components",
      type: "blog",
      url: "/blogs/2",
      excerpt: "Server Components allow you to write UI that can be rendered and...",
      author: "Yoursa Khan",
    },
    {
      id: 4,
      title: "Difference between useEffect and useLayoutEffect",
      type: "question",
      url: "/question/2",
      excerpt: "Can someone explain the key differences between useEffect and useLayoutEffect hooks...",
      author: "Yoursa Khan",
    },
    {
      id: 5,
      title: "John Doe",
      type: "user",
      url: "/profile/johndoe",
    },
  ];

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = mockResults.filter((result) =>
        result.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle result click
  const handleResultClick = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case "question":
        return <MessageSquare className="h-4 w-4 text-[#9CE630]" />;
      case "blog":
        return <BookOpen className="h-4 w-4 text-[#9CE630]" />;
      case "user":
        return <User className="h-4 w-4 text-[#9CE630]" />;
      default:
        return <Search className="h-4 w-4 text-[#9CE630]" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 dark:border-zinc-700 dark:text-white"
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-xs font-medium opacity-100 dark:border-zinc-700 dark:bg-zinc-800 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-white">
            Search DevUnity
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            placeholder="Search for questions, blogs, users..."
            className="pl-8 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7 text-zinc-500 dark:text-zinc-400"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isSearching ? (
          <div className="py-6 text-center text-zinc-500 dark:text-zinc-400">
            Searching...
          </div>
        ) : results.length > 0 ? (
          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                onClick={() => handleResultClick(result.url)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">{getIcon(result.type)}</div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-medium text-zinc-900 dark:text-white truncate">
                      {result.title}
                    </h4>
                    {result.excerpt && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {result.excerpt}
                      </p>
                    )}
                    {result.author && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        by {result.author}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                    {result.type}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : query ? (
          <div className="py-6 text-center text-zinc-500 dark:text-zinc-400">
            No results found for "{query}"
          </div>
        ) : null}
        <div className="pt-4 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
          Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">↑</kbd>{" "}
          <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">↓</kbd> to
          navigate, <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">Enter</kbd> to
          select, and <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">Esc</kbd> to
          close
        </div>
      </DialogContent>
    </Dialog>
  );
}
