"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Task } from "@/types/roadmap";
import { Calendar, CalendarClock, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { updateTaskStatus } from "@/app/actions/roadmap";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface TaskMilestone extends Task {
  milestone: {
    title: string;
  };
}

interface TodaysTasksProps {
  tasks: TaskMilestone[];
}

const TodaysTask = ({ tasks }: TodaysTasksProps) => {
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  const todayStr = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const todayTasks = tasks.filter(
    (task) =>
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(task.dueDate!)) === todayStr
  );

  const handleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    setLoadingTask(taskId);

    const promise = updateTaskStatus(taskId, isCompleted)
      .then(() => {
        setLoadingTask(null);
        return { name: "Task" };
      })
      .catch(() => {
        setLoadingTask(null);
        throw new Error("Failed to update task");
      });

    toast.promise(promise, {
      loading: "Updating task...",
      success: (data) =>
        `${data.name} marked as ${isCompleted ? "done" : "pending"}`,
      error: "Failed to update task",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Today's Tasks
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="text-gray-500 h-5 w-5" />
              {todayStr}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="sm:max-h-[350px] sm:overflow-y-scroll">
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <label
                      className={`font-medium ${
                        task.isCompleted ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </label>
                    <Button
                      size="sm"
                      variant={task.isCompleted ? "secondary" : "default"}
                      onClick={() =>
                        handleTaskCompletion(task.id, !task.isCompleted)
                      }
                      disabled={loadingTask === task.id}
                    >
                      {loadingTask === task.id ? (
                        "Updating..."
                      ) : task.isCompleted ? (
                        "Undo"
                      ) : (
                        <Check />
                      )}
                    </Button>
                  </div>
                  {task.milestone && (
                    <Badge variant="outline" className="text-xs mt-1 bg-white">
                      {task.milestone.title}
                    </Badge>
                  )}
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {task.description!.length > 100
                      ? `${task.description!.substring(0, 100)}...`
                      : task.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    <span>
                      Due{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(task.dueDate!))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center h-full justify-center py-8 text-center">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-full p-3 mb-3">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-50">
              No tasks for today
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              You're all caught up with your schedule
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {todayTasks.length > 0 ? (
            <span>
              {todayTasks.filter((t) => t.isCompleted).length} of{" "}
              {todayTasks.length} completed
            </span>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodaysTask;
