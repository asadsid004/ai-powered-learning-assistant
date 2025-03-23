"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, BookOpen } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-18 lg:py-28">
      <div className="container relative px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex flex-col justify-center items-center space-y-8">
            <div
              className={`space-y-6 text-center transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                <span className="flex items-center text-sm font-medium text-primary">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Revolutionizing self-paced learning
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Learn Smarter with{" "}
                <span className="text-primary">AI-Powered</span> Guidance
              </h1>
              <p className=" text-muted-foreground md:text-base">
                Quest AI creates personalized learning experiences that adapt to
                your goals, learning style, and pace. Master any subject with
                intelligent guidance.
              </p>
            </div>
            <div
              className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Button size="lg" className="group" asChild>
                <Link href="/api/auth/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
            <div
              className={`flex flex-wrap gap-x-8 gap-y-4 transition-all duration-700 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">AI-Powered Learning</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <p className="text-sm">Personalized Journeys</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">Enhanced Retention</p>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center justify-center transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80 backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-12 bg-background/90 border-b flex items-center px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto bg-muted/50 rounded-full px-4 py-1 text-xs">
                    Quest AI
                  </div>
                </div>

                <div className="absolute top-16 left-4 right-4 bottom-4">
                  {/* Dashboard UI */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="col-span-2 bg-card rounded-lg border p-4 shadow-sm">
                      <h3 className="text-sm font-medium mb-2">
                        Your Learning Journey
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-[65%] bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs">65%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-lg p-2 text-center text-xs ${
                              i < 3 ? "bg-primary/10 text-primary" : "bg-muted"
                            }`}
                          >
                            Milestone {i + 1}
                            {i < 3 && <span className="block mt-1">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-lg border p-4 shadow-sm">
                      <h3 className="text-sm font-medium mb-2">
                        Today's Tasks
                      </h3>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                i === 0
                                  ? "bg-primary border-primary"
                                  : "border-muted"
                              }`}
                            >
                              {i === 0 && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="h-4 bg-muted rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card rounded-lg border p-4 shadow-sm">
                      <h3 className="text-sm font-medium mb-2">AI Assistant</h3>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                            AI
                          </div>
                          <div className="flex-1 p-2 bg-muted rounded-lg text-xs">
                            How can I help with your learning today?
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="flex-1 p-2 bg-primary/10 rounded-lg text-xs">
                            I need help with machine learning concepts
                          </div>
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                            You
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
