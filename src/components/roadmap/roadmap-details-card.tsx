import React from "react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const RoadmapDetails = ({
  description,
  goal,
  weeks,
}: {
  description: string;
  goal: string;
  weeks: number;
}) => {
  return (
    <Card>
      <CardContent>
        <p>
          <span className="font-semibold">Descrption: </span>
          {description}
        </p>
        <Separator className="my-1 bg-secondary-foreground/50" />
        <p>
          <span className="font-semibold">Goal: </span>
          {goal}
        </p>
        <Separator className="my-1 bg-secondary-foreground/50" />
        <p>
          <span className="font-semibold">No. of Weeks: </span>
          {weeks}
        </p>
      </CardContent>
    </Card>
  );
};

export default RoadmapDetails;
