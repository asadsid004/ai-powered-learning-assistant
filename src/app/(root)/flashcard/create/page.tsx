import CreateFlashcardFormWithPdf from "@/components/flashcard/create-flashcard-form-with-pdf";
import CreateFlashcardForm from "@/components/flashcard/create-flashcard-form-without-pdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateFlashcardPage = () => {
  return (
    <div>
      <Card className="m-4 border-none shadow-none max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight font-bold">
            Create Flashcard
          </CardTitle>
          <CardDescription className="tracking-wide">
            Create personalized flashcard to revise and learn any topic quickly
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
              <CreateFlashcardForm />
            </TabsContent>
            <TabsContent value="upload">
              <CreateFlashcardFormWithPdf />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFlashcardPage;
