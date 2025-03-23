"use client";

import { Badge } from "@/components/ui/badge";
import type { Milestone } from "@/types/roadmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import QuizButton from "../quiz/generate-quiz-button";
import FlashcardButton from "../flashcard/generate-flashcard-button";

interface MilestoneItemProps {
  milestone: Milestone;
  roadmapId: string;
}

export function MilestoneItem({ milestone, roadmapId }: MilestoneItemProps) {
  return (
    <Card className="hover:shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {milestone.title}
          {milestone.isCompleted && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {milestone.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2 sm:gap-4 shrink-0">
            <span className="text-sm font-medium">
              Progress: {milestone.progress}%
            </span>
            <span className="text-sm font-medium">
              No. of tasks: {milestone.tasks.length}
            </span>
            <span className="text-sm font-medium">
              No. of days: {milestone.durationInDays}
            </span>
          </div>
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Link
              href={`/journey/${roadmapId}/milestone/${milestone.id}`}
              className={buttonVariants({ className: "w-full sm:w-fit" })}
            >
              View
            </Link>
            {/* TODO: FIX: Quiz and flashcards directly from roadmap */}
            <QuizButton
              formData={{
                title: milestone.title,
                description: milestone.description,
                difficulty: "medium", // You can dynamically set this based on milestone
                numQuestions: 5, // Adjust as needed
                timeLimit: 10, // Example: 5 min time limit
              }}
            />
            <FlashcardButton
              formData={{
                title: milestone.title,
                description: milestone.description,
                numFlashcards: 5,
              }}
            />
          </div>
        </div>
      </CardContent>
      <div
        className="bg-secondary-foreground h-3 -mb-6"
        style={{
          width: `${milestone.progress}%`,
          borderTopRightRadius: `${milestone.progress !== 100 && 0.5}rem`,
        }}
      />
    </Card>
  );
}
