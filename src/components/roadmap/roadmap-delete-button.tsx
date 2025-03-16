"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteRoadmap } from "@/app/actions/roadmap";

interface DeleteRoadmapButtonProps {
  roadmapId: string;
}

export function DeleteRoadmapButton({ roadmapId }: DeleteRoadmapButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    toast.promise(
      new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            await deleteRoadmap(roadmapId);
            router.push("/journey"); // Redirect on success
            resolve("Roadmap deleted successfully!");
          } catch (error) {
            reject("Failed to delete roadmap");
          } finally {
            setIsDeleting(false);
          }
        });
      }),
      {
        loading: "Deleting roadmap...",
        success: "Roadmap deleted successfully!",
        error: "Failed to delete roadmap.",
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
