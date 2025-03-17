import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const QuizPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quiz</h1>
          <p className="tracking-wide">
            Create personalized quizzes to check your knowledge
          </p>
        </div>
        <Link href="quiz/create" className={buttonVariants()}>
          <Plus />
          Create Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizPage;
