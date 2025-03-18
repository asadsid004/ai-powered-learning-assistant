"use server";

import { revalidatePath } from "next/cache";
import {
  generateFlashcardsFromDocument,
  generateFlashcardsWithoutDocument,
} from "@/lib/gemini-flashcard";
import { prisma } from "@/lib/prisma";
import {
  GenerateFlashcardFromDocumentInput,
  FlashcardGenerationInput,
} from "@/types/flashcard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function createFlashcardSet(formData: FlashcardGenerationInput) {
  try {
    // Get the current user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }

    // Generate flashcards using Gemini
    const generatedFlashcards = await generateFlashcardsWithoutDocument(
      formData
    );
    console.log(generatedFlashcards);
    // Save flashcard set to database
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title: generatedFlashcards.title,
        description: generatedFlashcards.description || "",
        userId: user.id,
        flashcards: {
          create: generatedFlashcards.flashcards.map((flashcard) => ({
            front: flashcard.front,
            back: flashcard.back,
            hint: flashcard.hint || null,
          })),
        },
      },
      include: {
        flashcards: true,
      },
    });

    // Revalidate the flashcards page to show the new set
    revalidatePath("/flashcards");

    return {
      success: true,
      flashcardSet,
      message: "Flashcard set created successfully!",
    };
  } catch (error: any) {
    console.error("Error creating flashcard set:", error);
    return {
      success: false,
      message: error.message || "Failed to create flashcard set",
    };
  }
}

export async function createFlashcardSetFromDocument(
  formData: GenerateFlashcardFromDocumentInput
) {
  try {
    // Get the current user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }

    // Generate flashcards using Gemini
    const generatedFlashcards = await generateFlashcardsFromDocument(formData);
    console.log(generatedFlashcards);

    if (
      !generatedFlashcards ||
      !generatedFlashcards.flashcards ||
      generatedFlashcards.flashcards.length === 0
    ) {
      throw new Error("Invalid flashcard data returned from AI.");
    }

    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title: generatedFlashcards.title,
        description: generatedFlashcards.description || "",
        userId: user.id,
        flashcards: {
          create: generatedFlashcards.flashcards.map((flashcard) => ({
            front: flashcard.front,
            back: flashcard.back,
            hint: flashcard.hint || null,
          })),
        },
      },
      include: {
        flashcards: true,
      },
    });

    // Revalidate the flashcards page to show the new set
    revalidatePath("/flashcards");

    return {
      success: true,
      flashcardSet,
      message: "Flashcard set created successfully!",
    };
  } catch (error: any) {
    console.error("Error creating flashcard set:", error);
    return {
      success: false,
      message: error.message || "Failed to create flashcard set",
    };
  }
}

export const deleteFlashcard = async (flashcardId: string) => {
  try {
    await prisma.flashcardSet.delete({
      where: { id: flashcardId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting flascard:", error);
    throw new Error("Failed to delete flashcard");
  }
};
