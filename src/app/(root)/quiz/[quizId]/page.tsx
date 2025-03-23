// File: app/quiz/[quizId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuizComponent from "@/components/quiz/quiz-view"; // Import the quiz component
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { buttonVariants } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function getQuizData(id: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        report: {
          include: {
            topicInsights: true,
            resourceLinks: true,
          },
        },
      },
    });

    if (!quiz) {
      return null;
    }

    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
}

type Params = Promise<{ quizId: string }>;

export default async function SpecificQuizPage({ params }: { params: Params }) {
  const { quizId } = await params;
  const quiz = await getQuizData(quizId);

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!quiz) {
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
              <BreadcrumbLink href="/quiz">Quiz</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{quiz.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <p>{user.given_name}</p>
          <LogoutLink className={buttonVariants()}>Logout</LogoutLink>
        </div>
      </header>
      <div>
        <QuizComponent quiz={quiz} />
      </div>
    </SidebarInset>
  );
}
