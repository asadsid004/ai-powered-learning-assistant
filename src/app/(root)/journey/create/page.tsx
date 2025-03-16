import CreateRoadmapForm from "@/components/roadmap/create-roadmap-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreateRoadmapPage = () => {
  return (
    <div>
      <Card className="m-4 border-none shadow-none max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight font-bold">
            Create Journey
          </CardTitle>
          <CardDescription className="tracking-wide">
            Create personalized learning journeys tailored to your goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoadmapForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoadmapPage;
