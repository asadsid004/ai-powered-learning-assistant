"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Fetch quiz scores from the backend
async function fetchQuizScores() {
  const res = await fetch("/api/quizzes/scores"); // API route
  if (!res.ok) throw new Error("Failed to fetch quiz scores");
  return res.json();
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function QuizScoreChart() {
  const isMobile = useIsMobile();
  const [quizCount, setQuizCount] = React.useState("7");
  const [quizData, setQuizData] = React.useState([]);

  React.useEffect(() => {
    fetchQuizScores().then((data) => setQuizData(data));
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setQuizCount("7");
    }
  }, [isMobile]);

  // Get the last N quizzes based on selection
  const filteredData = quizData.slice(-Number(quizCount));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
        <CardDescription>Your quiz scores over recent attempts</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={quizCount}
            onValueChange={setQuizCount}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7">Last 7</ToggleGroupItem>
            <ToggleGroupItem value="15">Last 15</ToggleGroupItem>
            <ToggleGroupItem value="30">Last 30</ToggleGroupItem>
          </ToggleGroup>
          <Select value={quizCount} onValueChange={setQuizCount}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Last 7 quizzes" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7" className="rounded-lg">
                Last 7 quizzes
              </SelectItem>
              <SelectItem value="15" className="rounded-lg">
                Last 15 quizzes
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                Last 30 quizzes
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="quizIndex" tickLine={false} axisLine={false} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 5}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Quiz #${value}`}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="score"
              type="natural"
              fill="url(#fillScore)"
              stroke="var(--primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
