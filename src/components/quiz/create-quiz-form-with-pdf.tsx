"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createQuizFromDocument } from "@/app/actions/quiz";
import { redirect } from "next/navigation";

const formSchema = z.object({
  difficulty: z.string().min(1, "Please select a difficulty."),
  numQuestions: z.coerce.number().min(5).max(30),
  timeLimit: z.coerce.number().min(2),
});

export default function CreateQuizFormWithPdf() {
  const [isPending, startTransition] = useTransition();
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeLimit: 5,
      difficulty: "",
      numQuestions: 5,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 20 * 1024 * 1024) {
      toast.error("Only PDF files under 20MB are allowed.");
      return;
    }
    try {
      const base64 = await encodeFileAsBase64(file);
      setFileBase64(base64);
      setFileName(file.name);
      toast.success("File uploaded successfully.");
    } catch (error) {
      toast.error("Error encoding file.");
    }
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!fileBase64) {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    startTransition(async () => {
      const data = await createQuizFromDocument({
        ...values,
        file: fileBase64,
      });

      if (!data.success) {
        toast.error(`Error creating quiz: ${data.message || "Unknown error"}`);
      } else {
        toast.success("Quiz generated successfully");
        redirect("/quiz");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Upload PDF</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </FormControl>
          {fileName && (
            <p className="text-sm text-green-600">Uploaded: {fileName}</p>
          )}
          <FormDescription>Upload a PDF file (Max 20MB)</FormDescription>
          <FormMessage />
        </FormItem>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Difficulty of questions</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of questions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="5"
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 5)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Number of questions you want to attempt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Limit</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 5)}
                />
              </FormControl>
              <FormDescription>
                Set the timer limit (in minutes)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
