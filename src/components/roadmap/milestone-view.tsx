import { Milestone } from "@/types/roadmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MilestoneTasks } from "./milestone-task-card";
import MilestoneResourceCard from "./milestone-resource-card";

interface MilestoneViewProps {
  milestone: Milestone;
}

const MilestoneView = ({ milestone }: MilestoneViewProps) => {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
            <p className="tracking-tight text-3xl font-bold">
              {milestone.title}
            </p>
            {milestone.progress === 100 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Completed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{milestone.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 sm:gap-4 shrink-0">
              <span className="text-sm font-medium">
                Progress: {milestone.progress}%
              </span>
              <span className="text-sm font-medium">
                No. of tasks: {milestone.tasks.length}
              </span>
              <span className="text-sm font-medium">
                No. of days: {milestone.durationInDays}
              </span>
            </div>
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {/* TODO: FIX: Quiz and flashcards directly from roadmap */}
              <Button className="w-full sm:w-fit" variant="secondary">
                Quiz
              </Button>
              <Button className="w-full sm:w-fit" variant="secondary">
                Flashcard
              </Button>
            </div>
          </div>
        </CardContent>
        <div
          className="bg-secondary-foreground h-3 -mb-6"
          style={{
            width: `${milestone.progress}%`,
            borderTopRightRadius: `${milestone.progress !== 100 && 0.5}rem`,
          }}
        />
      </Card>
      <MilestoneTasks tasks={milestone.tasks} />
      <MilestoneResourceCard resources={milestone.resources} />
    </div>
  );
};

export default MilestoneView;
