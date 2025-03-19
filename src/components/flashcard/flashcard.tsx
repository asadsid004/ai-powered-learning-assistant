"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface flashcard {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  front: string;
  back: string;
  hint: string | null;
  flashcardSetId: string;
}
export default function Flashcard({ flashcard }: { flashcard: flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] flashcard-container">
      <div
        className="w-full h-full perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <Card
            className="absolute w-full h-full p-6 flex flex-col items-center justify-center backface-hidden
                      shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-center space-y-4 max-w-[90%]">
              <h3 className="text-xl font-semibold">{flashcard.front}</h3>
              <p className="text-sm text-muted-foreground">
                Hint: {flashcard.hint}
              </p>
              <div className="flex items-center justify-center mt-6">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="tap-indicator">👆</span>
                  Tap to reveal answer
                </span>
              </div>
            </div>
          </Card>

          {/* Back of card */}
          <Card
            className="absolute w-full h-full p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180
                      shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-center space-y-4 max-w-[90%]">
              <h3 className="text-xl font-semibold text-primary">Answer:</h3>
              <p className="answer-text">{flashcard.back}</p>
              <div className="flex items-center justify-center mt-6">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="tap-indicator">👆</span>
                  Tap to see question
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 z-10 flip-button"
        onClick={(e) => {
          e.stopPropagation();
          handleFlip();
        }}
      >
        {isFlipped ? "Show Question" : "Reveal Answer"}
      </Button>
    </div>
  );
}
