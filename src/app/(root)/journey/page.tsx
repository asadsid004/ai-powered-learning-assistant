import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const JourneyPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Journey's</h1>
          <p className="tracking-wide">
            Create personalized learning journeys tailored to your goals
          </p>
        </div>
        <Link href="journey/create" className={buttonVariants()}>
          <Plus />
          Create Journey
        </Link>
      </div>
    </div>
  );
};

export default JourneyPage;
