import FlashcardCarousel from "@/components/flashcard/flashcard-carousel";
import { DeleteFlashcardButton } from "@/components/flashcard/flashcard-delete-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
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

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/flashcard">Flashcard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{flashcard.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div className="flex justify-between items-center px-4 mt-4">
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
    </SidebarInset>
  );
};

export default SpecificFlashcardPage;
