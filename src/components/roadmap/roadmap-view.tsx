import { Roadmap } from "@/types/roadmap";
import React from "react";
import RoadmapProgress from "./roadmap-progress-card";
import RoadmapDetails from "./roadmap-details-card";
import TodaysTask from "./todays-task-card";
import UpcomingTasks from "./upcoming-tasks-card";
import { MilestoneItem } from "./milestone-card";
import { DeleteRoadmapButton } from "./roadmap-delete-button";

interface RoadmapViewProps {
  roadmap: Roadmap;
}

const RoadmapView = ({ roadmap }: RoadmapViewProps) => {
  const allTasks = roadmap.milestones.flatMap((milestone) =>
    milestone.tasks.map((task) => ({
      ...task,
      milestone: {
        title: milestone.title,
      },
    }))
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{roadmap.title}</h1>
        <DeleteRoadmapButton roadmapId={roadmap.id} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-4 gap-4">
        <div className="space-y-4">
          <RoadmapProgress progress={roadmap.progress} />
          <RoadmapDetails
            description={roadmap.description}
            goal={roadmap.goal}
            weeks={roadmap.durationInWeeks}
          />
        </div>
        <TodaysTask tasks={allTasks} />
        <UpcomingTasks tasks={allTasks} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold my-4">Milestones :</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roadmap.milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              roadmapId={roadmap.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
