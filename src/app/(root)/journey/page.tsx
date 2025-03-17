import RoadmapCard from "@/components/roadmap/roadmap-card";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";

const getRoadmaps = async (id: string) => {
  const data = await prisma.roadmap.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

const JourneyPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getRoadmaps(user.id);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
        {data.map((roadmap) => (
          <RoadmapCard key={roadmap.id} data={roadmap} />
        ))}
      </div>
    </div>
  );
};

export default JourneyPage;
