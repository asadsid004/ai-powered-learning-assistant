import MilestoneView from "@/components/roadmap/milestone-view";
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

const getMilestoneData = async (id: string) => {
  const milestone = await prisma.milestone.findUnique({
    where: {
      id: id,
    },
    include: {
      tasks: true,
      resources: true,
    },
  });

  if (!milestone) {
    return notFound();
  }

  return milestone;
};

type Params = Promise<{ milestoneId: string }>;

const MilestonePage = async ({ params }: { params: Params }) => {
  const { milestoneId } = await params;
  const milestone = await getMilestoneData(milestoneId);

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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`/journey/${milestone.roadmapId}`}>
                Milestone {milestone.order + 1}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{milestone.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div className="p-6 mx-auto max-w-5xl">
        <MilestoneView milestone={milestone} />
      </div>
    </SidebarInset>
  );
};

export default MilestonePage;
