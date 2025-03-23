import CreateFlashcardFormWithPdf from "@/components/flashcard/create-flashcard-form-with-pdf";
import CreateFlashcardForm from "@/components/flashcard/create-flashcard-form-without-pdf";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CreateFlashcardPage = async () => {
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
              <BreadcrumbPage>Create Flashcard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <Card className="m-4 border-none shadow-none max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight font-bold">
            Create Flashcard
          </CardTitle>
          <CardDescription className="tracking-wide">
            Create personalized flashcard to revise and learn any topic quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Tabs className="w-full" defaultValue="topic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="cursor-pointer" value="topic">
                Topic
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="upload">
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topic">
              <CreateFlashcardForm />
            </TabsContent>
            <TabsContent value="upload">
              <CreateFlashcardFormWithPdf />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </SidebarInset>
  );
};

export default CreateFlashcardPage;
