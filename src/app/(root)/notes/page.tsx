import NoteCard from "@/components/notes/notes-card";
import QuizCard from "@/components/quiz/quiz-card";
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

const getNotes = async (id: string) => {
  const data = await prisma.note.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const NotesPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getNotes(user.id);

  return (
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Notes</h1>
          <div className="ml-auto flex items-center gap-2">
            <p>{user.given_name}</p>
            <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
          </div>
        </div>
      </header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 px-4 mt-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
          <p className="tracking-wide">
            Jot down important information and organize your thoughts
          </p>
        </div>
        <Link href="notes/create" className={buttonVariants()}>
          <Plus />
          Create Note
        </Link>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight px-4">
        Your Notes:
      </h3>
      {data.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4 px-4">
          {data.map((note) => (
            <NoteCard key={note.id} data={note} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-base mt-10">
          No notes yet. Create a note
        </div>
      )}
    </SidebarInset>
  );
};

export default NotesPage;
