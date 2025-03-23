"use server";

import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: { title: string; content: string }) {
  try {
    // Get the current user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }

    // Save note to database
    const note = await prisma.note.create({
      data: {
        title: formData.title,
        content: formData.content,
        userId: user.id,
      },
    });

    // Revalidate the quizzes page to show the new quiz
    revalidatePath("/notes");

    return {
      success: true,
      note,
      message: "Note created successfully!",
    };
  } catch (error: any) {
    console.error("Error creating note:", error);
    return {
      success: false,
      message: error.message || "Failed to create note",
    };
  }
}

type NoteInput = {
  title: string;
  content: string;
};

export async function updateNote(id: string, data: Partial<NoteInput>) {
  try {
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/notes/${id}`);
    revalidatePath("/notes");
    return { success: true, data: note };
  } catch (error) {
    console.error("Failed to update note:", error);
    return { success: false, error: "Failed to update note" };
  }
}

// Delete a note
export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({
      where: { id },
    });

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return { success: false, error: "Failed to delete note" };
  }
}

// Generate or update summary using Google Gemini
export async function generateNoteSummary(
  id: string,
  note: Partial<NoteInput>
) {
  try {
    // Fetch the note

    const model = google("gemini-2.0-flash-001");
    // Generate summary using Gemini
    const prompt = `
    Please generate a concise summary (1-3 sentences) of the following note:

    Title: ${note.title}

    Content:
    ${note.content}

    Provide only the summary without any additional explanations.
    `;

    const result = await generateText({ model, prompt });
    const summary = result.text;

    // Update the note with the summary
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { summary },
    });

    revalidatePath(`/notes/${id}`);
    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return { success: false, error: "Failed to generate summary" };
  }
}
