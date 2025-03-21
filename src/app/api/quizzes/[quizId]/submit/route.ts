// File: app/api/quizzes/[quizId]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type Params = Promise<{ quizId: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { quizId } = await params;
  try {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user) {
      return NextResponse.redirect("api/auth/login");
    }

    const { answeredQuestions, correctAnswers, score } = await request.json();

    // Verify the quiz exists and belongs to the user
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // If quiz is already attempted, don't allow resubmission
    if (quiz.attempted) {
      return NextResponse.json(
        { error: "Quiz already attempted" },
        { status: 400 }
      );
    }

    // Generate AI summary report
    // This is a placeholder - you'd implement your own report generation logic
    const reportData = await generateQuizReport(
      quiz,
      answeredQuestions,
      correctAnswers
    );

    // Start a transaction to update everything atomically
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // Create the report
      const report = await tx.report.create({
        data: {
          summary: reportData.summary,
          topicInsights: {
            create: reportData.topicInsights,
          },
          resourceLinks: {
            create: reportData.resourceLinks,
          },
        },
      });

      // Update user answers
      for (const answered of answeredQuestions) {
        await tx.question.update({
          where: { id: answered.id },
          data: { userAnswer: answered.userAnswer },
        });
      }

      // Update quiz with results
      return tx.quiz.update({
        where: { id: quizId },
        data: {
          attempted: true,
          correctQuestions: correctAnswers,
          score: score,
          reportId: report.id,
        },
      });
    });

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}

// Function to generate a quiz report
// In a real app, you might use an AI service or OpenAI API here
async function generateQuizReport(
  quiz: any,
  answeredQuestions: any,
  correctAnswers: any
) {
  // Calculate performance percentage
  const performancePercentage = (correctAnswers / quiz.numQuestions) * 100;

  // Maps answered questions with correct/incorrect info
  const questionResults = quiz.questions.map((question: any) => {
    const answeredQuestion = answeredQuestions.find(
      (aq: any) => aq.id === question.id
    );
    const userAnswer = answeredQuestion?.userAnswer || null;

    // Find the selected option
    const selectedOption = question.options.find(
      (opt: any) => opt.id === userAnswer
    );

    // Find the correct option
    const correctOption = question.options.find((opt: any) => opt.isCorrect);

    return {
      text: question.text,
      isCorrect: selectedOption?.isCorrect || false,
      userAnswer: selectedOption?.text || "Not answered",
      correctAnswer: correctOption?.text || "",
    };
  });

  // Group questions by topics (simplified - in real app, you'd have topic info)
  // For this example, we'll create mock topics
  const topics = [
    {
      name: "Topic 1",
      questions: questionResults.slice(
        0,
        Math.ceil(questionResults.length / 3)
      ),
    },
    {
      name: "Topic 2",
      questions: questionResults.slice(
        Math.ceil(questionResults.length / 3),
        Math.ceil((2 * questionResults.length) / 3)
      ),
    },
    {
      name: "Topic 3",
      questions: questionResults.slice(
        Math.ceil((2 * questionResults.length) / 3)
      ),
    },
  ];

  // Generate topic insights
  const topicInsights = topics.map((topic) => {
    const totalQuestions = topic.questions.length;
    const correctAnswers = topic.questions.filter(
      (q: any) => q.isCorrect
    ).length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    let insight = "";
    if (percentage >= 80) {
      insight = `Strong understanding. You correctly answered ${correctAnswers} out of ${totalQuestions} questions.`;
    } else if (percentage >= 50) {
      insight = `Good foundation, but room for improvement. You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
    } else {
      insight = `This appears to be a challenging area. You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
    }

    return {
      topic: topic.name,
      insight,
    };
  });

  // Generate resource links
  const resourceLinks = topics.map((topic) => {
    // In a real app, you'd have a database of resources or use an API
    return {
      topic: topic.name,
      url: `https://example.com/learn/${topic.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    };
  });

  // Generate summary
  let summary = "";
  if (performancePercentage >= 80) {
    summary = `Excellent work! You scored ${performancePercentage.toFixed(
      1
    )}% (${correctAnswers} out of ${
      quiz.numQuestions
    }). You've demonstrated a strong understanding of the material. There are still a few areas where you can improve, but overall your performance is outstanding.`;
  } else if (performancePercentage >= 60) {
    summary = `Good job! You scored ${performancePercentage.toFixed(
      1
    )}% (${correctAnswers} out of ${
      quiz.numQuestions
    }). You've shown a solid grasp of many key concepts, but there are several areas where additional review could strengthen your understanding.`;
  } else if (performancePercentage >= 40) {
    summary = `You scored ${performancePercentage.toFixed(
      1
    )}% (${correctAnswers} out of ${
      quiz.numQuestions
    }). You're on the right track, but there are significant knowledge gaps that need attention. Focus on the topics highlighted below.`;
  } else {
    summary = `You scored ${performancePercentage.toFixed(
      1
    )}% (${correctAnswers} out of ${
      quiz.numQuestions
    }). This material appears challenging for you at this point. Don't worry - the resources below will help you build a stronger foundation. Consider reviewing the fundamental concepts before retaking the quiz.`;
  }

  return {
    summary,
    topicInsights: topicInsights.map((ti) => ({
      topic: ti.topic,
      insight: ti.insight,
    })),
    resourceLinks: resourceLinks.map((rl) => ({
      topic: rl.topic,
      url: rl.url,
    })),
  };
}
