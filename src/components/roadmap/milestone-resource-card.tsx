import { Resource, ResourceType } from "@/types/roadmap";
import React from "react";
import {
  FileTextIcon,
  PlayCircleIcon,
  LinkIcon,
  BookOpenIcon,
  Video,
  ClipboardListIcon,
} from "lucide-react"; // Assuming you're using Heroicons
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

interface MilestoneResourcesProps {
  resources: Resource[];
}

const MilestoneResourceCard = ({ resources }: MilestoneResourcesProps) => {
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "COURSE":
        return <BookOpenIcon className="w-5 h-5 text-yellow-500" />;
      case "YOUTUBE":
        return <Video className="w-5 h-5 text-red-500" />;
      case "TUTORIAL":
        return <ClipboardListIcon className="w-5 h-5 text-blue-500" />;
      case "BOOK":
        return <BookOpenIcon className="w-5 h-5 text-brown-500" />;
      case "VIDEO":
        return <PlayCircleIcon className="w-5 h-5 text-blue-500" />;
      case "ARTICLE":
        return <FileTextIcon className="w-5 h-5 text-green-500" />;
      case "OTHER":
        return <LinkIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <FileTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <div>
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <ul className="space-y-3">
            {resources.map((resource) => (
              <li key={resource.id} className="">
                <div className="flex gap-4">
                  {getResourceIcon(resource.type)}
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource.title}
                  </Link>
                </div>
                <p className="text-secondary-foreground text-sm">
                  {resource.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneResourceCard;
