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

    const quizzes = await prisma.quiz.findMany({
      where: { userId: user.id, attempted: true },
      select: {
        id: true,
        title: true,
        score: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Add an index for ordering in the chart
    const indexedQuizzes = quizzes.map((quiz, index) => ({
      quizIndex: index + 1,
      ...quiz,
    }));

    return NextResponse.json(indexedQuizzes);
  } catch (error) {
    console.error("Failed to fetch quiz scores:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
