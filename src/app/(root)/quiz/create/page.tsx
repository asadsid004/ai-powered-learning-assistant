import CreateuizFormWithPdf from "@/components/quiz/create-quiz-form-with-pdf";
import CreateQuizForm from "@/components/quiz/create-quiz-form-without-pdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

const CreateQuizPage = () => {
  return (
    <Card className="m-4 border-none shadow-none max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight font-bold">
          Create Quiz
        </CardTitle>
        <CardDescription className="tracking-wide">
          Create personalized quizzes to check your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Tabs className="w-full" defaultValue="topic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="topic">
              Topic
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="upload">
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic">
            <CreateQuizForm />
          </TabsContent>
          <TabsContent value="upload">
            <CreateuizFormWithPdf />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreateQuizPage;
