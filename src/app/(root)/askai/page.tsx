import { AskAI } from "@/components/ui/askAi";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const AskAiPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Ask AI</h1>
          <div className="ml-auto flex items-center gap-2">
            <p>{user.given_name}</p>
            <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto mt-4 px-4">
        <AskAI />
      </div>
    </SidebarInset>
  );
};

export default AskAiPage;
