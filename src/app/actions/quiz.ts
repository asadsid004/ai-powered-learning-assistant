"use server";

import { revalidatePath } from "next/cache";
import {
  generateQuizFromDocument,
  generateQuizWithoutDocument,
} from "@/lib/gemini-quiz";
import { prisma } from "@/lib/prisma";
import {
  GenerateQuizFromDocumentInput,
  QuizGenerationInput,
} from "@/types/quiz";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { generateObject } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";

export async function createQuiz(formData: QuizGenerationInput) {
  try {
    // Get the current user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }

    // Generate quiz using Gemini
    const generatedQuiz = await generateQuizWithoutDocument(formData);

    // Save quiz to database
    const quiz = await prisma.quiz.create({
      data: {
        title: generatedQuiz.title,
        description: generatedQuiz.description || "",
        difficulty: formData.difficulty,
        userId: user.id,
        attempted: false,
        timeLimit: formData.timeLimit,
        numQuestions: formData.numQuestions,
        questions: {
          create: generatedQuiz.questions.map((question) => ({
            text: question.text,
            explanation: question.explanation || "",
            options: {
              create: question.options
                ? question.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                  }))
                : [],
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/notes");

    return {
      success: true,
      quiz,
      message: "Notes created successfully!",
    };
  } catch (error: any) {
    console.error("Error creating note:", error);
    return {
      success: false,
      message: error.message || "Failed to create note",
    };
  }
}

export async function createQuizFromDocument(
  formData: GenerateQuizFromDocumentInput
) {
  try {
    // Get the current user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }

    // Generate quiz using Gemini (Ensure it returns necessary fields)
    const generatedQuiz = await generateQuizFromDocument(formData);

    if (
      !generatedQuiz ||
      !generatedQuiz.questions ||
      generatedQuiz.questions.length === 0
    ) {
      throw new Error("Invalid quiz data returned from AI.");
    }

    // Save quiz to database
    const quiz = await prisma.quiz.create({
      data: {
        title: generatedQuiz.title,
        description: generatedQuiz.description || "",
        difficulty: formData.difficulty,
        userId: user.id,
        attempted: false,
        timeLimit: formData.timeLimit,
        numQuestions: formData.numQuestions,
        questions: {
          create: generatedQuiz.questions.map((question) => ({
            text: question.text,
            explanation: question.explanation || "",
            options: {
              create: question.options
                ? question.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                  }))
                : [],
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/quiz");

    return {
      success: true,
      quiz,
      message: "Quiz created successfully!",
    };
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      message: error.message || "Failed to create quiz",
    };
  }
}

export const deleteQuiz = async (quizId: string) => {
  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Failed to delete œuiz");
  }
};

// Generate explanations for incorrect answers

interface ReportGenerationInput {
  questions: string[];
  userAnswers: string[];
  correctAnswers: string[];
}

interface GeneratedReport {
  summary: string;
  topicInsights: { [topic: string]: string };
  resourceLinks: { [topic: string]: string[] };
}

// Zod schema for runtime validation
const GeneratedReportSchema = z.object({
  summary: z.string(),
  topicInsights: z.record(z.string(), z.string()), // key-value pairs, topic -> insight
  resourceLinks: z.record(z.string(), z.array(z.string())), // key-value pairs, topic -> array of URLs
});

export async function generatePersonalizedReport(
  input: ReportGenerationInput
): Promise<GeneratedReport> {
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
    Generate a personalized learning report based on their quiz performance.
    
    The quiz included the following questions and answers:
    ${input.questions
      .map(
        (question, index) => `
      Question ${index + 1}: ${question}
      User's answer: ${
        input.userAnswers[index] ? input.userAnswers[index] : "Not answered"
      }
      Correct answer: ${input.correctAnswers[index]}
    `
      )
      .join("\n")}

    Analyze the user's answers to identify areas where they struggled.
    Provide a concise summary of their overall performance.
    For each topic where the user made mistakes, provide a brief insight explaining the misconception.
    Also, for each of those topics, find 2-3 relevant resources links (URLs) to help them learn more.

    The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

    Provide the report in the following structured JSON format:
    \`\`\`json
    {
      "summary": "Overall summary of the user's performance.",
      "topicInsights": {
        "Topic 1": "Insight into the user's misconception about Topic 1.",
        "Topic 2": "Insight into the user's misconception about Topic 2."
      },
      "resourceLinks": {
        "Topic 1": [
          "https://example.com/resource1",
          "https://example.com/resource2"
        ],
        "Topic 2": [
          "https://example.com/resource3",
          "https://example.com/resource4"
        ]
      }
    }
    \`\`\`

    The summary should be encouraging and educational.  Topic insights should be clear and concise.  Resource links MUST be valid URLs.
    Try to determine the correct name of the topic.
  `;

  try {
    const result = await generateObject({
      model: model,
      schemaName: "report",
      schemaDescription: "An AI generated personalized learning report.",
      schema: GeneratedReportSchema,
      prompt: prompt,
    });

    const response = result.object;

    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedReport = GeneratedReportSchema.parse(response);
      return validatedReport;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Error generating personalized report with Gemini:", error);
    throw new Error(`Failed to generate personalized report: ${error.message}`);
  }
}
