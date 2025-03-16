import RoadmapView from "@/components/roadmap/roadmap-view";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

async function getRoadmapData(id: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: id,
    },
    include: {
      milestones: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
          resources: true,
        },
      },
    },
  });

  if (!roadmap) {
    return notFound();
  }

  return roadmap;
}

const SpecificRoadmapPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const roadmap = await getRoadmapData(id);

  return (
    <div className="p-6">
      <RoadmapView roadmap={roadmap} />
    </div>
  );
};

export default SpecificRoadmapPage;
