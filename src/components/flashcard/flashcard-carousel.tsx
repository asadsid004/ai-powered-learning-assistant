"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Flashcard from "./flashcard";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

interface flashcards {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  front: string;
  back: string;
  hint: string | null;
  flashcardSetId: string;
}

export default function FlashcardCarousel({
  flashcards,
}: {
  flashcards: flashcards[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [api, setApi] = useState<any>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrentIndex(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    api?.scrollTo(randomIndex);
  };

  return (
    <div className="space-y-6 fade-in">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {flashcards.map((flashcard, index) => (
            <CarouselItem
              key={index}
              className="md:basis-4/5 lg:basis-3/4 slide-in"
            >
              <Flashcard flashcard={flashcard} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex items-center justify-center mt-8 gap-2">
          <CarouselPrevious className="static transform-none mx-1 carousel-button" />

          <div className="flex items-center bg-secondary rounded-full px-4 py-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full mr-2"
              onClick={handleShuffle}
              title="Random card"
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <div className="text-sm font-medium">
              <span>{currentIndex}</span> / <span>{flashcards.length}</span>
            </div>
          </div>

          <CarouselNext className="static transform-none mx-1 carousel-button" />
        </div>
      </Carousel>

      <div className="text-center text-sm text-muted-foreground fade-in-delayed">
        Use arrow keys or swipe to navigate between cards
      </div>
    </div>
  );
}
