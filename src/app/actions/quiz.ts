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
    // const quiz = await prisma.quiz.create({
    //   data: {
    //     title: generatedQuiz.title,
    //     description: generatedQuiz.description,
    //     difficulty: formData.difficulty,
    //     userId: session.user.id,
    //     questions: {
    //       create: generatedQuiz.questions.map((question) => ({
    //         text: question.text,
    //         type: question.type,
    //         explanation: question.explanation || "",
    //         options: {
    //           create: question.options
    //             ? question.options.map((option) => ({
    //                 text: option.text,
    //                 isCorrect: option.isCorrect,
    //               }))
    //             : [],
    //         },
    //       })),
    //     },
    //   },
    //   include: {
    //     questions: {
    //       include: {
    //         options: true,
    //       },
    //     },
    //   },
    // });

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/quizzes");

    return {
      success: true,
      // quiz,
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

    // Generate quiz using Gemini
    const generatedQuiz = await generateQuizFromDocument(formData);
    console.log(generatedQuiz);

    // Save quiz to database
    // const quiz = await prisma.quiz.create({
    //   data: {
    //     title: generatedQuiz.title,
    //     description: generatedQuiz.description,
    //     difficulty: formData.difficulty,
    //     userId: session.user.id,
    //     questions: {
    //       create: generatedQuiz.questions.map((question) => ({
    //         text: question.text,
    //         type: question.type,
    //         explanation: question.explanation || "",
    //         options: {
    //           create: question.options
    //             ? question.options.map((option) => ({
    //                 text: option.text,
    //                 isCorrect: option.isCorrect,
    //               }))
    //             : [],
    //         },
    //       })),
    //     },
    //   },
    //   include: {
    //     questions: {
    //       include: {
    //         options: true,
    //       },
    //     },
    //   },
    // });

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/quizzes");

    return {
      success: true,
      // quiz,
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
