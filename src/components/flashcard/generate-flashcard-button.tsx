"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createFlashcardSet } from "@/app/actions/flashcard";

interface FlashcardButtonProps {
  formData: {
    title: string;
    numFlashcards: number;
    description: string;
  };
}

export default function FlashcardButton({ formData }: FlashcardButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFlashcardGeneration = async () => {
    setIsLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await createFlashcardSet(formData);

        if (result.success) {
          resolve(result.message); // Success message
          router.push("/flashcard");
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
      loading: "Generating flashcards...",
      success: (msg: any) => msg,
      error: (err) => err.message,
    });
  };

  return (
    <Button
      className="w-full sm:w-fit"
      variant="secondary"
      onClick={handleFlashcardGeneration}
      disabled={isLoading}
    >
      {isLoading ? "Generating..." : "Flashcard"}
    </Button>
  );
}
