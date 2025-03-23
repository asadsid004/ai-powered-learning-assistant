"use client";

import type React from "react";
import { useInView } from "react-intersection-observer";
import {
  BookOpen,
  FileQuestion,
  MessageSquare,
  Route,
  FileText,
} from "lucide-react";

export function FeatureGrid() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="w-full">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              AI-Powered Learning Tools
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Quest AI combines cutting-edge artificial intelligence with proven
              learning methodologies to create a powerful, personalized learning
              experience.
            </p>
          </div>
        </div>

        <div
          ref={ref}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Feature 1: AI-Powered Learning Roadmaps */}
          <FeatureCard
            icon={<Route className="h-6 w-6 text-primary" />}
            title="AI-Powered Learning Roadmaps"
            description="Quest AI analyzes your goals, and learning style to create personalized learning paths that adapt as you progress. Our AI identifies knowledge gaps and recommends the most effective resources to help you achieve mastery."
            inView={inView}
            delay={0}
            className="col-span-1 row-span-1 md:col-span-2"
          >
            <div className="mt-6 rounded-lg bg-muted/70 p-4">
              <div className="flex flex-col space-y-3">
                <div className="h-2 w-full rounded-full bg-primary/20">
                  <div className="h-2 w-[70%] rounded-full bg-primary"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Python Basics</span>
                  <span>70%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded bg-primary/10 p-2 text-center text-xs">
                    Variables
                    <span className="block text-primary">✓</span>
                  </div>
                  <div className="rounded bg-primary/10 p-2 text-center text-xs">
                    Functions
                    <span className="block text-primary">✓</span>
                  </div>
                  <div className="rounded bg-muted p-2 text-center text-xs">
                    Classes
                    <span className="block text-muted-foreground">Next</span>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 2: Quiz and Flashcard Generation */}
          <FeatureCard
            icon={<FileQuestion className="h-6 w-6 text-primary" />}
            title="Quiz & Flashcard Generation"
            description="Automatically generate quizzes and flashcards from your study materials. Our AI identifies key concepts and creates effective testing materials to reinforce your learning and improve retention."
            inView={inView}
            delay={100}
          >
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/70 p-3 text-center">
                <div className="text-sm font-medium">What is a variable?</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Tap to reveal
                </div>
              </div>
              <div className="rounded-lg bg-muted/70 p-3 text-center">
                <div className="text-sm font-medium">Define function scope</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Tap to reveal
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 3: Chat with PDF (RAG) */}
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-primary" />}
            title="Chat with PDF (RAG)"
            description="Upload any document and instantly chat with its contents. Our Retrieval-Augmented Generation technology allows you to ask questions, extract insights, and understand complex materials through natural conversation."
            inView={inView}
            delay={200}
          >
            <div className="mt-4 rounded-lg bg-muted/70 p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium">You</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">Explain the key points on page 42</p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    AI
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    The main concepts discussed on page 42 are...
                  </p>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 4: AI Chatbot */}
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
            title="AI Chatbot"
            description="Get instant assistance with our AI tutor that's available 24/7. Ask questions, request explanations, or get help with problem-solving."
            inView={inView}
            delay={300}
          >
            <div className="mt-4 rounded-lg bg-muted/70 p-3">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium">You</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Can you explain how neural networks work?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      AI
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Neural networks are computing systems inspired by the
                      human brain...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 5: AI-Based Note Summarization */}
          <FeatureCard
            icon={<BookOpen className="h-6 w-6 text-primary" />}
            title="AI-Based Note Summarization"
            description="Take notes your way. Jot down important information and organize your thoughts, and let our AI transform them into concise, structured summaries."
            inView={inView}
            delay={400}
            className="col-span-1 row-span-1 md:col-span-2 lg:col-span-1"
          >
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-muted/70 p-2 text-sm">
                <p>
                  Machine learning is a subset of artificial intelligence that
                  provides systems the ability to automatically learn and
                  improve from experience without being explicitly programmed.
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 text-sm">
                <p className="font-medium text-primary">AI Summary:</p>
                <ul className="mt-1 space-y-1 pl-5 text-sm list-disc">
                  <li>Machine learning = subset of AI</li>
                  <li>Systems learn automatically from experience</li>
                  <li>No explicit programming required</li>
                </ul>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  inView: boolean;
  delay: number;
  className?: string;
}

function FeatureCard({
  icon,
  title,
  description,
  children,
  inView,
  delay,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md ${className} ${
        inView
          ? "animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards"
          : "opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
