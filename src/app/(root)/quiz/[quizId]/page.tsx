// File: app/quiz/[quizId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuizComponent from "@/components/quiz/quiz-view"; // Import the quiz component

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

  if (!quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <QuizComponent quiz={quiz} />
    </div>
  );
}
