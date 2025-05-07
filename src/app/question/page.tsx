"use client";

import { useState } from "react";
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
import { MessageSquare, ThumbsUp, PenSquare } from "lucide-react";
import Link from "next/link";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to optimize React performance?",
      content:
        "I'm working on a large React application and noticed some performance issues. What are some best practices for optimizing React performance?",
      author: "habibullah",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "2024-03-15",
      votes: 5,
      answers: 2,
    },
    {
      id: 2,
      title: "Difference between useEffect and useLayoutEffect",
      content:
        "Can someone explain the key differences between useEffect and useLayoutEffect hooks in React? When should I use one over the other?",
      author: "Yoursa Khan",
      avatar: "/placeholder.svg?height=50&width=50",
      date: "2024-03-14",
      votes: 3,
      answers: 1,
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    // Add the new question to the list
    const newQuestionObj = {
      id: questions.length + 1,
      title: newQuestion.title,
      content: newQuestion.content,
      author: "Current User", // In a real app, this would be the logged-in user
      avatar: "/placeholder.svg?height=50&width=50",
      date: new Date().toISOString().split("T")[0],
      votes: 0,
      answers: 0,
    };

    setQuestions([newQuestionObj, ...questions]);
    setNewQuestion({ title: "", content: "" });
    setShowQuestionForm(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-between mt-12 md:mt-14 mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Questions
          </h1>

          <Button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="bg-[#9CE630] text-black hover:bg-[#8BD520]"
          >
            <PenSquare className="mr-2 h-4 w-4" />
            {showQuestionForm ? "Cancel" : "Post Question"}
          </Button>
        </div>

        {showQuestionForm && (
          <Card className="mb-8 bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewQuestion}>
                <input
                  className="w-full mb-4 p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                  placeholder="Question Title"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                />
                <Textarea
                  className="w-full mb-4 p-2 bg-zinc-800 border border-zinc-700 rounded text-white min-h-32"
                  placeholder="Question Details"
                  value={newQuestion.content}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, content: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  className="bg-[#9CE630] text-black hover:bg-[#8BD520]"
                  disabled={!newQuestion.title.trim() || !newQuestion.content.trim()}
                >
                  Submit Question
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {questions.map((question) => (
            <Card key={question.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Link href={`/question/${question.id}`}>
                  <CardTitle className="text-white hover:text-[#9CE630] transition-colors">{question.title}</CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">{question.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-4 mb-3">
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
                    <p className="text-sm font-medium text-white">
                      {question.author}
                    </p>
                    <p className="text-xs text-zinc-400">{question.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {question.votes}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {question.answers}
                  </Button>
                  <Link href={`/question/${question.id}`}>
                    <Button className="bg-[#9CE630] text-black hover:bg-[#8BD520]">
                      Answer
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}