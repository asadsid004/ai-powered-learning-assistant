import React from "react";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const RoadmapProgress = ({ progress }: { progress: number }) => {
  return (
    <Card className="max-w-2xl">
      <CardContent>
        <h1 className="leading-none font-semibold mb-4">
          Completed: {progress}%
        </h1>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
};

export default RoadmapProgress;
