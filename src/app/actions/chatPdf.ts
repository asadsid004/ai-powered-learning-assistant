"use server";

import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function getChatPdfName(id: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login");
    }
    const res = await prisma.chatPdf.findUnique({
      where: {
        id: id,
      },
    });

    if (!res) {
      throw new Error("Error fetching chatPdf name");
    }
    return res.name;
  } catch (error) {
    console.error("Error fetching chatPdf name:", error);
    // Even on error, we should exit the loading state
  }
}

export async function getUserName() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  return user.given_name;
}

export const deleteChatPdf = async (chatPdfId: string) => {
  try {
    await prisma.chatPdf.delete({
      where: { id: chatPdfId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat Pdf:", error);
    throw new Error("Failed to delete chat Pdf");
  }
};
