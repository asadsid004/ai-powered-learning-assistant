import FlashcardSetCard from "@/components/flashcard/flashcard-set-card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
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
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Flashcard</h1>
          <div className="ml-auto flex items-center gap-2">
            <p>{user.given_name}</p>
            <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
          </div>
        </div>
      </header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 px-4 mt-4">
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
      <h3 className="mt-4 text-2xl font-semibold tracking-tight px-4">
        Your Flashcards:
      </h3>
      {data.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4 px-4">
          {data.map((flashcardSet) => (
            <FlashcardSetCard key={flashcardSet.id} data={flashcardSet} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-base mt-10">
          No flashcards yet. Create a flashcard
        </div>
      )}
    </SidebarInset>
  );
};

export default FlashcardPage;
