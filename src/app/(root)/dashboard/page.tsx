import { QuizScoreChart } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import TodaysTask from "@/components/roadmap/todays-task-card";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const roadmaps = await prisma.roadmap.findMany({
    where: {
      userId: user.id,
    },
    include: {
      milestones: {
        include: {
          tasks: true,
        },
      },
    },
  });

  // Correctly flatten all tasks across all roadmaps
  const allTasks = roadmaps.flatMap((roadmap) =>
    roadmap.milestones.flatMap((milestone) =>
      milestone.tasks.map((task) => ({
        ...task,
        milestone: {
          title: milestone.title,
        },
      }))
    )
  );

  return (
    <SidebarInset>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <p>{user.given_name}</p>
            <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <QuizScoreChart />
            </div>
            <div className="px-4">
              <TodaysTask tasks={allTasks} />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
