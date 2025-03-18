import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { buttonVariants } from "../ui/button";

interface FlashcardSetView {
  id: string;
  title: string;
  description: string;
}

const FlashcardSetCard = ({ data }: { data: FlashcardSetView }) => {
  return (
    <Card className="hover:shadow-lg">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`flashcard/${data.id}`} className={buttonVariants()}>
          View
        </Link>
      </CardFooter>
    </Card>
  );
};

export default FlashcardSetCard;
