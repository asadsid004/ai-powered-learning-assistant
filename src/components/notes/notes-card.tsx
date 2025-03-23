import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

export interface QuizCard {
  id: string;
  title: string;
  content: string;
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
        <Link
          href={`notes/${data.id}`}
          className={buttonVariants({ className: "w-full sm:w-fit" })}
        >
          View
        </Link>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
