import FlashcardSetCard from "@/components/flashcard/flashcard-set-card";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";

const getFlashcards = async (id: string) => {
  const data = await prisma.flashcardSet.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const FlashcardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getFlashcards(user.id);

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
      <h3 className="mt-4 text-2xl font-semibold tracking-tight">
        Your Flashcards:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 gap-4">
        {data.map((flashcardSet) => (
          <FlashcardSetCard key={flashcardSet.id} data={flashcardSet} />
        ))}
      </div>
    </div>
  );
};

export default FlashcardPage;
