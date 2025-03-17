import CreateuizFormWithPdf from "@/components/quiz/create-quiz-form-with-pdf";
import CreateQuizForm from "@/components/quiz/create-quiz-form-without-pdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";

const CreateQuizPage = () => {
  return (
    <div>
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
          <Tabs className="w-full">
            <TabsList className="grid w-full selection:bg-emerald-50 grid-cols-2">
              <TabsTrigger value="topic">Topic</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
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
    </div>
  );
};

export default CreateQuizPage;
