import NoteDetail from "@/components/notes/note-details";
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
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

async function getNote(id: string) {
  const note = await prisma.note.findUnique({
    where: {
      id: id,
    },
  });

  if (!note) {
    return null;
  }

  return note;
}

const SpecificNotesPage = async ({ params }: { params: Params }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { id } = await params;

  const note = await getNote(id);

  if (!note) {
    notFound();
  }
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/notes">Notes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{note?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div className="px-4">
        <NoteDetail note={note} />
      </div>
    </SidebarInset>
  );
};

export default SpecificNotesPage;
