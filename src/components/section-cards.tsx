"use client";

import {
  IconTrendingUp,
  IconTrendingDown,
  IconCircle,
  IconClipboardList,
  IconBook,
  IconBrain,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

// Fetch analytics data from API
async function fetchDashboardStats() {
  const res = await fetch("/api/dashboard/stats"); // API route
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function SectionCards() {
  const [stats, setStats] = useState({
    quizAccuracy: 0,
    journeysCompleted: 0,
    quizzesAttempted: 0,
    flashcardsReviewed: 0,
  });

  useEffect(() => {
    fetchDashboardStats().then((data) => setStats(data));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Quiz Accuracy */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Quiz Accuracy</CardDescription>
          <CardTitle className="text-3xl font-semibold">
            {stats.quizAccuracy}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.quizAccuracy > 50 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {stats.quizAccuracy > 50 ? "Above Average" : "Needs Improvement"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm space-x-2 -mt-2">
          <div className="font-medium">
            {stats.quizAccuracy > 50 ? "Great Performance" : "Work on Accuracy"}{" "}
          </div>
          <div className="text-muted-foreground">
            Avg. quiz scores of all attempts
          </div>
        </CardFooter>
      </Card>

      {/* Journeys Completed */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Journeys Completed</CardDescription>
          <CardTitle className="text-3xl font-semibold">
            {stats.journeysCompleted}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCircle />
              {stats.journeysCompleted > 5
                ? "High Engagement"
                : "Keep Learning"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm space-x-2 -mt-2">
          <div className="font-medium">
            {stats.journeysCompleted > 5 ? "Great Progress" : "Keep Completing"}{" "}
          </div>
          <div className="text-muted-foreground">Roadmaps fully completed</div>
        </CardFooter>
      </Card>

      {/* Quizzes Attempted */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Quizzes Attempted</CardDescription>
          <CardTitle className="text-3xl font-semibold">
            {stats.quizzesAttempted}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBook />
              {stats.quizzesAttempted > 10
                ? "Frequent Learner"
                : "Try More Quizzes"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm space-x-2 -mt-2">
          <div className="font-medium">
            {stats.quizzesAttempted > 10
              ? "Great Participation"
              : "Take More Quizzes"}{" "}
          </div>
          <div className="text-muted-foreground">Total quizzes taken</div>
        </CardFooter>
      </Card>

      {/* Flashcards Reviewed */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Flashcards Created</CardDescription>
          <CardTitle className="text-3xl font-semibold">
            {stats.flashcardsReviewed}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBrain />
              {stats.flashcardsReviewed > 20
                ? "Memory Boosting"
                : "Review More"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm space-x-2 -mt-2">
          <div className="font-medium">
            {stats.flashcardsReviewed > 20
              ? "Excellent Recall"
              : "Keep Reviewing"}
          </div>
          <div className="text-muted-foreground">Total flashcards created</div>
        </CardFooter>
      </Card>
    </div>
  );
}
