"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  BookOpen,
  Award,
  User,
  Settings,
  LogOut,
  Edit,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock user data
  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2024",
    reputation: 450,
    badges: {
      gold: 1,
      silver: 3,
      bronze: 7,
    },
    stats: {
      questions: 8,
      answers: 15,
      blogs: 3,
      acceptedAnswers: 10,
    },
  });

  // Mock questions data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to implement authentication in Next.js?",
      votes: 5,
      answers: 2,
      date: "2024-03-10",
    },
    {
      id: 2,
      title: "Best practices for state management in React",
      votes: 8,
      answers: 4,
      date: "2024-02-25",
    },
  ]);

  // Mock answers data
  const [answers, setAnswers] = useState([
    {
      id: 1,
      questionTitle: "How to optimize React performance?",
      questionId: 1,
      votes: 12,
      accepted: true,
      date: "2024-03-15",
    },
    {
      id: 2,
      questionTitle: "Difference between useEffect and useLayoutEffect",
      questionId: 2,
      votes: 7,
      accepted: false,
      date: "2024-03-05",
    },
    {
      id: 3,
      questionTitle: "How to use TypeScript with React?",
      questionId: 3,
      votes: 9,
      accepted: true,
      date: "2024-02-20",
    },
  ]);

  // Mock blogs data
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      views: 230,
      likes: 45,
      date: "2024-03-01",
    },
    {
      id: 2,
      title: "Understanding React Server Components",
      views: 180,
      likes: 32,
      date: "2024-02-15",
    },
    {
      id: 3,
      title: "The Future of Web Development",
      views: 320,
      likes: 67,
      date: "2024-01-20",
    },
  ]);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-zinc-900 dark:text-white">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  @{user.username}
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {user.badges.gold}
                  </span>
                  <Award className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {user.badges.silver}
                  </span>
                  <Award className="h-5 w-5 text-amber-700" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {user.badges.bronze}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Reputation
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-zinc-900 dark:text-white">
                        {user.reputation}
                      </p>
                      <Progress value={user.reputation / 10} className="w-1/2" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                      Member since
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {user.joinDate}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start dark:border-zinc-700 dark:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start dark:border-zinc-700 dark:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start dark:border-zinc-700 dark:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-zinc-900 dark:text-white text-lg">
                        Activity Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Questions</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{user.stats.questions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Answers</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{user.stats.answers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Blogs</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{user.stats.blogs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 dark:text-zinc-400">Accepted Answers</span>
                          <span className="font-medium text-zinc-900 dark:text-white">{user.stats.acceptedAnswers}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-zinc-900 dark:text-white text-lg">
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-[#9CE630] mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-zinc-900 dark:text-white">
                              Posted an answer to "How to optimize React performance?"
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              2 days ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <ThumbsUp className="h-5 w-5 text-[#9CE630] mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-zinc-900 dark:text-white">
                              Received 5 upvotes on your answer
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              3 days ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 text-[#9CE630] mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-zinc-900 dark:text-white">
                              Published a blog post "Getting Started with Next.js 14"
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              1 week ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value="questions">
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-zinc-900 dark:text-white">Your Questions</CardTitle>
                    <Link href="/question">
                      <Button className="bg-[#9CE630] text-black hover:bg-[#8BD520]">
                        Ask Question
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {questions.length > 0 ? (
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <div
                            key={question.id}
                            className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                          >
                            <Link href={`/question/${question.id}`}>
                              <h3 className="text-lg font-medium text-zinc-900 dark:text-white hover:text-[#9CE630] dark:hover:text-[#9CE630] transition-colors">
                                {question.title}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-1" />
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {question.votes}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-1" />
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {question.answers}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {question.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-500 dark:text-zinc-400">
                          You haven't asked any questions yet.
                        </p>
                        <Link href="/question">
                          <Button className="mt-4 bg-[#9CE630] text-black hover:bg-[#8BD520]">
                            Ask Your First Question
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Answers Tab */}
              <TabsContent value="answers">
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-white">Your Answers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {answers.length > 0 ? (
                      <div className="space-y-4">
                        {answers.map((answer) => (
                          <div
                            key={answer.id}
                            className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                          >
                            <Link href={`/question/${answer.questionId}`}>
                              <h3 className="text-lg font-medium text-zinc-900 dark:text-white hover:text-[#9CE630] dark:hover:text-[#9CE630] transition-colors">
                                {answer.questionTitle}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-1" />
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {answer.votes}
                                  </span>
                                </div>
                                {answer.accepted && (
                                  <div className="flex items-center text-green-500">
                                    <Award className="h-4 w-4 mr-1" />
                                    <span className="text-sm">Accepted</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {answer.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-500 dark:text-zinc-400">
                          You haven't answered any questions yet.
                        </p>
                        <Link href="/question">
                          <Button className="mt-4 bg-[#9CE630] text-black hover:bg-[#8BD520]">
                            Browse Questions
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs">
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-zinc-900 dark:text-white">Your Blog Posts</CardTitle>
                    <Link href="/blogs">
                      <Button className="bg-[#9CE630] text-black hover:bg-[#8BD520]">
                        Write Blog
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {blogs.length > 0 ? (
                      <div className="space-y-4">
                        {blogs.map((blog) => (
                          <div
                            key={blog.id}
                            className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                          >
                            <Link href={`/blogs/${blog.id}`}>
                              <h3 className="text-lg font-medium text-zinc-900 dark:text-white hover:text-[#9CE630] dark:hover:text-[#9CE630] transition-colors">
                                {blog.title}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-1" />
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {blog.views} views
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-1" />
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {blog.likes} likes
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {blog.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-500 dark:text-zinc-400">
                          You haven't written any blog posts yet.
                        </p>
                        <Link href="/blogs">
                          <Button className="mt-4 bg-[#9CE630] text-black hover:bg-[#8BD520]">
                            Write Your First Blog
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
