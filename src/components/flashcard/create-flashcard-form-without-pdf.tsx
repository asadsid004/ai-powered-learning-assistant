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
import { createQuiz } from "@/app/actions/quiz";
import { redirect } from "next/navigation";
import { createFlashcardSet } from "@/app/actions/flashcard";

const formSchema = z.object({
  title: z.string().min(1).min(2).max(50),
  description: z.string().min(10).max(250).optional(),
  numFlashcards: z.number().min(5).max(30),
});

export default function CreateFlashcardForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      numFlashcards: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const data = await createFlashcardSet(values);
      if (!data.success) {
        toast.error(
          `Error creating flashcards: ${!data.success || "Unknown error"}`
        );
      } else {
        toast.success("Flashcards generated successfully");
        redirect("/flashcard");
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
              <FormDescription>This is your title of flashcard</FormDescription>
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
                Provide a bit of more information about the flashcard
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numFlashcards"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of flashcard</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value) || 5)}
                />
              </FormControl>
              <FormDescription>
                Tell the no. of flashcard you want
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
