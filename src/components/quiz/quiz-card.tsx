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

export interface QuizCard {
  id: string;
  title: string;
  description: string;
  numQuestions: number;
  attempted: boolean;
  correctQuestions: number | null;
  timeLimit: number;
  score: number | null;
}

const QuizCard = ({ data }: { data: QuizCard }) => {
  return (
    <Card className="hover:shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 tracking-tight">
          {data.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row -mt-3 -mb-3 justify-between gap-2 sm:gap-0">
        <div className="flex sm:block justify-between">
          <p className="text-sm">Questions: {data.numQuestions}</p>
          <p className="text-sm">Time Limit: {data.timeLimit}</p>
        </div>
        <div>
          <Link
            href={`quiz/${data.id}`}
            className={buttonVariants({ className: "w-full sm:w-fit" })}
          >
            {data.attempted ? "View" : "Attempt"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
