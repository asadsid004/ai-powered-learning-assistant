"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createQuiz } from "@/app/actions/quiz";
import { useRouter } from "next/navigation";

interface QuizButtonProps {
  formData: {
    title: string;
    numQuestions: number;
    description: string;
    difficulty: string;
    timeLimit: number;
  };
}

export default function QuizButton({ formData }: QuizButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQuizGeneration = async () => {
    setIsLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await createQuiz(formData);

        if (result.success) {
          resolve(result.message); // Success message
          router.push("/quiz");
        } else {
          reject(new Error(result.message || "Failed to generate quiz"));
        }
      } catch (error: any) {
        reject(new Error(error.message || "Unexpected error"));
      } finally {
        setIsLoading(false);
      }
    });

    // Use toast.promise for better UX
    toast.promise(promise, {
      loading: "Generating quiz...",
      success: (msg: any) => msg,
      error: (err) => err.message,
    });
  };

  return (
    <Button
      className="w-full sm:w-fit"
      variant="secondary"
      onClick={handleQuizGeneration}
      disabled={isLoading}
    >
      {isLoading ? "Generating..." : "Quiz"}
    </Button>
  );
}
