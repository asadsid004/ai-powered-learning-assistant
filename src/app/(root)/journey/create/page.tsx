import CreateRoadmapForm from "@/components/roadmap/create-roadmap-form";
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
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

const CreateRoadmapPage = async () => {
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
              <BreadcrumbLink href="/journey">Journey</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Journey</BreadcrumbPage>
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
            Create Journey
          </CardTitle>
          <CardDescription className="tracking-wide">
            Create personalized learning journeys tailored to your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoadmapForm />
        </CardContent>
      </Card>
    </SidebarInset>
  );
};

export default CreateRoadmapPage;
