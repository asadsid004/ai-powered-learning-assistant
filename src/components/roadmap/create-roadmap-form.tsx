"use client";

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
import { createRoadmap } from "@/app/actions/roadmap";
import { useTransition } from "react";
import { redirect } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1).min(2).max(100),
  goal: z.string().min(1).min(2).max(200),
  description: z.string().min(10).max(500),
  currentSkillLevel: z.string(),
  timeCommitment: z.number().min(1),
  durationInWeeks: z.number().min(1).max(100),
});

export default function CreateRoadmapForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      goal: "",
      description: "",
      currentSkillLevel: "",
      timeCommitment: 5,
      durationInWeeks: 1, // Provide a default number
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const data = await createRoadmap(values);

      if (!data.success) {
        toast.error(`Error creating journey: ${data.error}`);
      } else {
        toast.success("Journey generated successfully");
        redirect("/journey");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Computer vision" type="text" {...field} />
              </FormControl>
              <FormDescription>This is your journey name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Input
                  placeholder="Become a professional in computer vision"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your goal you want to achieve
              </FormDescription>
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
                  placeholder="Focus more on hands on projects and practical knowledge"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your specific needs of your journey
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="currentSkillLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Beginner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="novice">Novice</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  What is your current understanding
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeCommitment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Commitment</FormLabel>
                <FormControl>
                  <Input
                    placeholder="40"
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={1}
                    type="number"
                  />
                </FormControl>
                <FormDescription>
                  Your no. of hours you want to put in
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationInWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (weeks)</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 1)
                    }
                    min={1}
                    placeholder="10"
                    type="number"
                  />
                </FormControl>
                <FormDescription>
                  No, of weeks you want to achieve your goal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
