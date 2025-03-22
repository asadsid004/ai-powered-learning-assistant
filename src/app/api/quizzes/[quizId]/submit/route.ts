// File: app/api/quizzes/[quizId]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

// Zod schema for AI-generated report
const GeneratedReportSchema = z.object({
  summary: z.string(),
  topicInsights: z.array(
    z.object({
      topic: z.string(),
      insight: z.string(),
    })
  ),
  resourceLinks: z.array(
    z.object({
      topic: z.string(),
      url: z.string(),
    })
  ),
});

type GeneratedReport = z.infer<typeof GeneratedReportSchema>;

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const { quizId } = params;

  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.redirect("api/auth/login");
    }

    const { answeredQuestions, correctAnswers, score } = await request.json();

    // Validate input
    if (!Array.isArray(answeredQuestions) || typeof score !== "number") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Verify quiz existence
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.attempted) {
      return NextResponse.json(
        { error: "Quiz already attempted" },
        { status: 400 }
      );
    }

    // Generate AI report
    const reportData = await generateQuizReport(
      quiz,
      answeredQuestions,
      correctAnswers
    );

    // Store in DB using transaction
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          summary: reportData.summary,
          topicInsights: {
            create: reportData.topicInsights.map(({ topic, insight }) => ({
              topic,
              insight,
            })),
          },
          resourceLinks: {
            create: reportData.resourceLinks.map(({ topic, url }) => ({
              topic,
              url,
            })),
          },
        },
      });

      for (const answered of answeredQuestions) {
        await tx.question.update({
          where: { id: answered.id },
          data: { userAnswer: answered.userAnswer },
        });
      }

      return tx.quiz.update({
        where: { id: quizId },
        data: {
          attempted: true,
          correctQuestions: correctAnswers,
          score,
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

// Function to generate quiz report using AI
async function generateQuizReport(
  quiz: any,
  answeredQuestions: any,
  correctAnswers: number
): Promise<GeneratedReport> {
  try {
    const questions: string[] = [];
    const userAnswers: string[] = [];
    const correctAnswerTexts: string[] = [];

    quiz.questions.forEach((question: any) => {
      const answeredQuestion = answeredQuestions.find(
        (aq: any) => aq.id === question.id
      );
      const userAnswerId = answeredQuestion?.userAnswer || null;
      const selectedOption = question.options.find(
        (opt: any) => opt.id === userAnswerId
      );
      const correctOption = question.options.find((opt: any) => opt.isCorrect);

      questions.push(question.text);
      userAnswers.push(selectedOption?.text || "Not answered");
      correctAnswerTexts.push(correctOption?.text || "");
    });

    const reportInput = {
      questions,
      userAnswers,
      correctAnswers: correctAnswerTexts,
    };
    return await generatePersonalizedReport(reportInput);
  } catch (error) {
    console.error("Error generating AI report:", error);

    return {
      summary: `You answered ${correctAnswers} out of ${quiz.numQuestions} questions correctly.`,
      topicInsights: [
        {
          topic: "General Understanding",
          insight: "Review key concepts to strengthen your understanding.",
        },
      ],
      resourceLinks: [
        {
          topic: "General Understanding",
          url: "https://example.com/learning-resources",
        },
      ],
    };
  }
}

// AI report generation function
async function generatePersonalizedReport(input: {
  questions: string[];
  userAnswers: string[];
  correctAnswers: string[];
}): Promise<GeneratedReport> {
  const model = google("gemini-2.0-flash-001", {
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
    structuredOutputs: true,
  });

  const prompt = `
    Generate a structured quiz performance report in JSON format.

    Analyze the following quiz:
    ${input.questions
      .map(
        (question, index) => `
        Question ${index + 1}: ${question}
        User's answer: ${input.userAnswers[index] || "Not answered"}
        Correct answer: ${input.correctAnswers[index]}
      `
      )
      .join("\n")}

    Instructions:
    - Provide an overall summary of the performance of my quiz in detail.
    - Identify weak topics based on incorrect answers.
    - Provide a clear insight for my each weak topic.
    - Recommend 2-3 learning resources for each weak topic.
    - Don't use the word the user, it's my response.
    - Return **only valid JSON** matching this format:
    
    \`\`\`json
    {
      "summary": "Overall performance summary",
      "topicInsights": [
        { "topic": "Topic Name", "insight": "Insight into my misunderstanding" }
      ],
      "resourceLinks": [
        { "topic": "Topic Name", "url": "https://example.com/resource" }
      ]
    }
    \`\`\`
  `;

  try {
    const result = await generateObject({
      model,
      schemaName: "report",
      schemaDescription: "AI-generated personalized learning report",
      schema: GeneratedReportSchema,
      prompt,
    });

    return GeneratedReportSchema.parse(result.object);
  } catch (error: any) {
    console.error("Error generating personalized report:", error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
}
