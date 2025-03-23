"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteChatPdf } from "@/app/actions/chatPdf";

interface DeleteChatPdfButtonProps {
  chatPdfId: string;
}

export function DeleteChatPdfButton({ chatPdfId }: DeleteChatPdfButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteChatPdf(chatPdfId);
            router.push("/chatpdf"); // Redirect on success
            resolve("ChatPDf deleted successfully!");
          } catch (error) {
            reject("ChatPDf to delete flashcard");
          } finally {
            setIsDeleting(false);
          }
        });
      }),
      {
        loading: "Deleting chat PDF...",
        success: "Chat PDF deleted successfully!",
        error: "Failed to delete Chat PDF.",
      }
    );
  };

  return (
    <Button
      variant="destructive"
      disabled={isPending || isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? "Deleting..." : <TrashIcon className="w-5 h-5" />}
    </Button>
  );
}
