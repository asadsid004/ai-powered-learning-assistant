import FlashcardCarousel from "@/components/flashcard/flashcard-carousel";
import { DeleteFlashcardButton } from "@/components/flashcard/flashcard-delete-button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

async function getFlashcardData(id: string) {
  const flashcard = await prisma.flashcardSet.findFirst({
    where: {
      id: id,
    },
    include: {
      flashcards: true,
    },
  });

  if (!flashcard) {
    return notFound();
  }

  return flashcard;
}

const SpecificFlashcardPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const flashcard = await getFlashcardData(id);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {flashcard.title}
          </h1>
          <p className="text-secondary-foreground tracking-wide mb-6">
            {flashcard.description}
          </p>
        </div>
        <DeleteFlashcardButton flashcardId={flashcard.id} />
      </div>
      <FlashcardCarousel flashcards={flashcard.flashcards} />
    </div>
  );
};

export default SpecificFlashcardPage;
