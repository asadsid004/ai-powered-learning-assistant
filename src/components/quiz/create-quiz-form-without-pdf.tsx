"use client";
import { useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createQuiz } from "@/app/actions/quiz";
import { redirect } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1).min(2).max(50),
  description: z.string().min(10).max(250),
  difficulty: z.string().min(1),
  numQuestions: z.number().min(5).max(30),
  timeLimit: z.number().min(2),
});

export default function CreateQuizForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      timeLimit: 5,
      numQuestions: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const data = await createQuiz(values);

      if (!data.success) {
        toast.error(`Error creating quiz: ${!data.success || "Unknown error"}`);
      } else {
        toast.success("Quiz generated successfully");
        redirect("/quiz");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Machine learning" type="text" {...field} />
              </FormControl>
              <FormDescription>This is your title of quiz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Focus more on mathematical aspect of machine learning"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a bit of more information about the quiz
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    Tell the no. of questions you want to attempt
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
