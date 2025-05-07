"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id;

  // Mock question data
  const [question, setQuestion] = useState({
    id: questionId,
    title: "How to optimize React performance?",
    content:
      "I'm working on a large React application and noticed some performance issues. What are some best practices for optimizing React performance? I've already tried memoization with useMemo and useCallback, but I'm looking for more advanced techniques.",
    author: "habibullah",
    avatar: "/placeholder.svg?height=50&width=50",
    date: "2024-03-15",
    votes: 5,
    answers: 2,
  });

  // Mock answers data
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content:
        "One effective way to optimize React performance is to use React.memo for functional components that render often but with the same props. Also, consider using the useCallback hook for functions passed as props to child components to prevent unnecessary re-renders.",
      author: "Yoursa Khan",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "2024-03-16",
      votes: 3,
    },
    {
      id: 2,
      content:
        "In addition to memoization, you should also consider code splitting with React.lazy and Suspense to reduce the initial bundle size. This can significantly improve the initial load time of your application. Also, make sure you're not causing unnecessary re-renders by properly structuring your state.",
      author: "Muhammad Anees",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "2024-03-17",
      votes: 2,
    },
  ]);

  // State for new answer
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle voting for question
  const handleQuestionVote = (type: "up" | "down") => {
    setQuestion((prev) => ({
      ...prev,
      votes: type === "up" ? prev.votes + 1 : prev.votes - 1,
    }));
  };

  // Handle voting for answers
  const handleAnswerVote = (id: number, type: "up" | "down") => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === id
          ? {
              ...answer,
              votes: type === "up" ? answer.votes + 1 : answer.votes - 1,
            }
          : answer
      )
    );
  };

  // Handle submitting a new answer
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const newAnswerObj = {
        id: answers.length + 1,
        content: newAnswer,
        author: "Current User", // In a real app, this would be the logged-in user
        avatar: "/placeholder.svg?height=50&width=50",
        date: new Date().toISOString().split("T")[0],
        votes: 0,
      };

      setAnswers((prev) => [...prev, newAnswerObj]);
      setNewAnswer("");
      setIsSubmitting(false);

      // Update question's answer count
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers + 1,
      }));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-12 md:mt-14 mb-6">
          <Link
            href="/question"
            className="flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Link>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-white">
                {question.title}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.avatar} alt={question.author} />
                  <AvatarFallback>
                    {question.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {question.author}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {question.date}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {question.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuestionVote("up")}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {question.votes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuestionVote("down")}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {question.answers} Answers
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          {answers.length} Answers
        </h2>

        <div className="space-y-6 mb-8">
          {answers.map((answer) => (
            <Card
              key={answer.id}
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            >
              <CardContent className="pt-6">
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {answer.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={answer.avatar} alt={answer.author} />
                    <AvatarFallback>
                      {answer.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {answer.author}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {answer.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAnswerVote(answer.id, "up")}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {answer.votes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAnswerVote(answer.id, "down")}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white">
              Your Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer}>
              <Textarea
                className="min-h-32 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <Button
                type="submit"
                className="mt-4 bg-[#9CE630] text-black hover:bg-[#8BD520]"
                disabled={isSubmitting || !newAnswer.trim()}
              >
                {isSubmitting ? "Submitting..." : "Post Answer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
