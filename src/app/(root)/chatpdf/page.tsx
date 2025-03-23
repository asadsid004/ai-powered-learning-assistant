import ChatPdfCard from "@/components/chatpdf/chat-pdf-card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getChatpdfData(id: string) {
  try {
    const chatPdf = await prisma.chatPdf.findMany({
      where: {
        userId: id,
      },
    });

    if (!chatPdf) {
      return null;
    }

    return chatPdf;
  } catch (error) {
    console.error("Error fetching chatPdf:", error);
    return null;
  }
}

const ChatPDFPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const chatPdf = await getChatpdfData(user.id);

  return (
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Chat PDF</h1>
          <div className="ml-auto flex items-center gap-2">
            <p>{user.given_name}</p>
            <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
          </div>
        </div>
      </header>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 px-4 mt-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Chat PDF's</h1>
          <p className="tracking-wide">
            Chat with your PDF in a seamless manner using Chat PDF
          </p>
        </div>
        <Link href="chatpdf/create" className={buttonVariants()}>
          <Plus />
          Create Chat PDF
        </Link>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight px-4">
        Your Chats:
      </h3>
      {chatPdf?.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 px-4">
          {chatPdf!.map((chatPdf) => (
            <ChatPdfCard key={chatPdf.id} data={chatPdf} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-base mt-10">
          No chats yet. Create a chat with pdf
        </div>
      )}
    </SidebarInset>
  );
};

export default ChatPDFPage;
