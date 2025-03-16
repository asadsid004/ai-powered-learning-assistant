import MilestoneView from "@/components/roadmap/milestone-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import {
  CheckIcon,
  FileTextIcon,
  LinkIcon,
  PlayCircleIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const getMilestoneData = async (id: string) => {
  const milestone = await prisma.milestone.findUnique({
    where: {
      id: id,
    },
    include: {
      tasks: true,
      resources: true,
    },
  });

  if (!milestone) {
    return notFound();
  }

  return milestone;
};

type Params = Promise<{ milestoneId: string }>;

const MilestonePage = async ({ params }: { params: Params }) => {
  const { milestoneId } = await params;
  const milestone = await getMilestoneData(milestoneId);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileTextIcon className="w-5 h-5 text-red-500" />;
      case "video":
        return <PlayCircleIcon className="w-5 h-5 text-blue-500" />;
      case "link":
        return <LinkIcon className="w-5 h-5 text-green-500" />;
      default:
        return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 mx-auto max-w-5xl">
      <MilestoneView milestone={milestone} />
    </div>
  );
};

export default MilestonePage;
