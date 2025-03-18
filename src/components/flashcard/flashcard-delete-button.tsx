"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteFlashcard } from "@/app/actions/flashcard";

interface DeleteFlashcardButtonProps {
  flashcardId: string;
}

export function DeleteFlashcardButton({
  flashcardId,
}: DeleteFlashcardButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteFlashcard(flashcardId);
            router.push("/flashcard"); // Redirect on success
            resolve("Flashcard deleted successfully!");
          } catch (error) {
            reject("Failed to delete flashcard");
          } finally {
            setIsDeleting(false);
          }
        });
      }),
      {
        loading: "Deleting flashcard...",
        success: "Flashcard deleted successfully!",
        error: "Failed to delete flashcard.",
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
