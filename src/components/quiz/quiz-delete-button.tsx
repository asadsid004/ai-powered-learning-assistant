"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteFlashcard } from "@/app/actions/flashcard";
import { deleteQuiz } from "@/app/actions/quiz";

interface DeleteQuizButtonProps {
  quizId: string;
}

export function DeleteQuizButton({ quizId }: DeleteQuizButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteQuiz(quizId);
            router.push("/quiz"); // Redirect on success
            resolve("Quiz deleted successfully!");
          } catch (error) {
            reject("Failed to delete quiz");
          } finally {
            setIsDeleting(false);
          }
        });
      }),
      {
        loading: "Deleting quiz...",
        success: "Quiz deleted successfully!",
        error: "Failed to delete quiz.",
      }
    );
  };

  return (
    <Button
      variant="destructive"
      disabled={isPending || isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? "Deleting..." : <TrashIcon className="w-5 h-5" />}
    </Button>
  );
}
