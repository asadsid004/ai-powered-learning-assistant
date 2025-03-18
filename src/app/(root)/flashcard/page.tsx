import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const FlashcardPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Flashcard</h1>
          <p className="tracking-wide">
            Create personalized flashcard to revise and learn any topic quickly
          </p>
        </div>
        <Link href="flashcard/create" className={buttonVariants()}>
          <Plus />
          Create Flashcard
        </Link>
      </div>
    </div>
  );
};

export default FlashcardPage;
