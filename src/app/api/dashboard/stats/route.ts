import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate Quiz Accuracy
    const quizData = await prisma.quiz.findMany({
      where: { userId: user.id, attempted: true },
      select: { score: true },
    });

    const quizAccuracy = quizData.length
      ? Math.round(
          quizData.reduce((sum, quiz) => sum + (quiz.score || 0), 0) /
            quizData.length
        )
      : 0;

    // Count Completed Journeys (Roadmaps)
    const journeysCompleted = await prisma.roadmap.count({
      where: { userId: user.id, progress: 100 },
    });

    // Count Quizzes Attempted
    const quizzesAttempted = await prisma.quiz.count({
      where: { userId: user.id, attempted: true },
    });

    // Count Flashcards Reviewed
    const flashcardsReviewed = await prisma.flashcardSet.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      quizAccuracy,
      journeysCompleted,
      quizzesAttempted,
      flashcardsReviewed,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
