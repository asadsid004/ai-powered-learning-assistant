import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

export interface QuizCard {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const NoteCard = ({ data }: { data: QuizCard }) => {
  return (
    <Card className="hover:shadow-lg overflow-hidden">
      <CardContent className="space-y-2">
        <CardTitle className="text-lg flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 tracking-tight">
          {data.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {data.content}
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
          <p className="text-xs">
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(data.updatedAt!))}
          </p>
          <Link
            href={`notes/${data.id}`}
            className={buttonVariants({ className: "w-full sm:w-fit" })}
          >
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
