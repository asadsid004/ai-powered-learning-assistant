import RoadmapView from "@/components/roadmap/roadmap-view";
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

async function getRoadmapData(id: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: id,
    },
    include: {
      milestones: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
          resources: true,
        },
      },
    },
  });

  if (!roadmap) {
    return notFound();
  }

  return roadmap;
}

const SpecificRoadmapPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const roadmap = await getRoadmapData(id);

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
              <BreadcrumbPage>{roadmap.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div className="p-6">
        <RoadmapView roadmap={roadmap} />
      </div>
    </SidebarInset>
  );
};

export default SpecificRoadmapPage;
