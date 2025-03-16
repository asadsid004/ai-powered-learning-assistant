"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateTaskStatus } from "@/app/actions/roadmap";
import { Task } from "@/types/roadmap";
import { Card, CardContent } from "../ui/card";

interface MilestoneTasksProps {
  tasks: Task[];
}

export function MilestoneTasks({ tasks }: MilestoneTasksProps) {
  const [taskList, setTaskList] = useState(tasks);

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    const updatedTasks = taskList.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
    );

    // Optimistic UI update
    setTaskList(updatedTasks);

    toast.promise(
      updateTaskStatus(taskId, !isCompleted), // API Call
      {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Failed to update task.",
      }
    );
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Milestone Tasks</h2>
        <ul className="space-y-4">
          {taskList.map((task) => (
            <li
              key={task.id}
              className={cn(
                "flex items-center justify-between p-4 border rounded-lg transition-all",
                task.isCompleted
                  ? "bg-green-50 border-green-300"
                  : "border-gray-200"
              )}
            >
              <div>
                <span
                  className={cn(
                    "text-gray-800 font-medium",
                    task.isCompleted && "line-through text-gray-500"
                  )}
                >
                  {task.title}
                </span>
                {task.dueDate && (
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <ClockIcon className="w-4 h-4" />
                    Due{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(task.dueDate!))}
                  </div>
                )}
                <span className="text-sm">{task.description}</span>
              </div>
              <Button
                variant={task.isCompleted ? "secondary" : "default"}
                onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
              >
                {task.isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  "Mark as Done"
                )}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
