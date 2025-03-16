import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export interface RoadmapOnly {
  id: string;
  title: string;
  description: string;
  goal: string;
  durationInWeeks: number;
  progress: number;
}

const RoadmapCard = ({ data }: { data: RoadmapOnly }) => {
  return (
    <Card className="hover:shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
          <p className="tracking-tight">{data.title}</p>
          {data.progress === 0 && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row -mt-3 -mb-3 justify-between gap-2 sm:gap-0">
        <div className="flex sm:block justify-between">
          <p className="text-sm">Progress: {data.progress}%</p>
          <p className="text-sm">Duration(weeks): {data.durationInWeeks}</p>
        </div>
        <div>
          <Link
            href={`roadmap/${data.id}`}
            className={buttonVariants({ className: "w-full sm:w-fit" })}
          >
            View
          </Link>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
      <div
        className="bg-secondary-foreground rounded-tr-xl h-3 -mb-6"
        style={{
          width: `${data.progress}%`,
        }}
      />
    </Card>
  );
};

export default RoadmapCard;
