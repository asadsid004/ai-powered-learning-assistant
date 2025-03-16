import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export interface RoadmapInput {
  title: string;
  goal: string;
  description: string;
  currentSkillLevel: string;
  timeCommitment: string;
  durationInWeeks: number;
}

export interface MilestoneInput {
  title: string;
  description: string;
  durationInDays: number;
}

export interface TaskInput {
  title: string;
  description: string;
  order?: string;
  dueDate: string; // Added due date
}

export interface ResourceInput {
  title: string;
  type:
    | "COURSE"
    | "YOUTUBE"
    | "TUTORIAL"
    | "BOOK"
    | "VIDEO"
    | "ARTICLE"
    | "OTHER";
  url: string;
  description: string;
}

export interface GeneratedRoadmap {
  title: string;
  description: string;
  goal: string;
  durationInWeeks: number;
  milestones: Array<{
    title: string;
    description: string;
    durationInDays: number;
    tasks: TaskInput[];
    resources: ResourceInput[];
  }>;
}

// Zod schema for runtime validation
const GeneratedRoadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  goal: z.string(),
  durationInWeeks: z.number(),
  milestones: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      durationInDays: z.number(),
      tasks: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          dueDate: z.string().datetime(), // Validate as a date-time string
        })
      ),
      resources: z.array(
        z.object({
          title: z.string(),
          type: z.enum([
            "COURSE",
            "YOUTUBE",
            "TUTORIAL",
            "BOOK",
            "VIDEO",
            "ARTICLE",
            "OTHER",
          ]),
          url: z.string(),
          description: z.string(),
        })
      ),
    })
  ),
});

export async function generateRoadmap(
  input: RoadmapInput
): Promise<GeneratedRoadmap> {
  const today = new Date();
  const todayISO = today.toISOString(); // Format date for the prompt

  const model = google("gemini-1.5-pro-latest", {
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
    structuredOutputs: true,
  });

  const prompt = `
    Create a detailed learning roadmap for someone who wants to become a ${input.title}.
    Description: ${input.description}
    Goal: ${input.goal}
    Current Skill Level: ${input.currentSkillLevel}
    Time Commitment: ${input.timeCommitment}
    Total Duration: ${input.durationInWeeks} weeks
    Today's date: ${todayISO}  // Important: Include the date!

    The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations. Ensure that durationInWeeks is a number. Ensure that each resource has a valid URL.  Each task MUST have a 'dueDate' property in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) that is after today's date.  Consider the milestone duration when assigning due dates.

    Provide the roadmap in the following structured JSON format:
    \`\`\`json
    {
      "title": "The title of the roadmap",
      "description": "A brief description of the roadmap",
      "goal": "The main goal of the roadmap",
      "durationInWeeks": 12,
      "milestones": [
        {
          "title": "Milestone title",
          "description": "Description of this milestone",
          "durationInDays": 4,
          "tasks": [
            {
              "title": "Task title",
              "description": "Brief description of the task",
              "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ"  // Due date in ISO format
            }
          ],
          "resources": [
            {
              "title": "Resource title",
              "url": "URL to the resource",
              "type": "One of: COURSE, YOUTUBE, TUTORIAL, BOOK, VIDEO, ARTICLE, OTHER",
              "description": "Brief description of the resource"
            }
          ]
        }
      ]
    }
    \`\`\`
    The description of roadmap, each milestone, each task, each resource should be detailed, min of 20 words.
    Provide 3-6 milestone phases, each with 3-8 specific tasks and 3-6 relevant learning resources.
    Ensure each milestone has a logical duration in weeks, and tasks are specific, actionable, achievable, and have a due date appropriately set.
    Make the resources real and useful with actual URLs to quality learning materials (include online courses, youtube videos, articles, books, etc).
    The sum of milestone durations (in days) should equal the total duration of ${input.durationInWeeks} weeks.
  `;

  try {
    // const result = await model.(prompt);
    const result = await generateObject({
      model: model,
      schemaName: "roadmap",
      schemaDescription: "An AI generated roadmap.",
      schema: GeneratedRoadmapSchema,
      prompt: prompt,
    });

    console.log(JSON.stringify(result.object, null, 2));
    const response = result.object;

    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedRoadmap = GeneratedRoadmapSchema.parse(response);
      return validatedRoadmap;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Failed to generate Gemini roadmap:", error);
    throw new Error(`Failed to generate roadmap: ${error.message}`); // Include original error message
  }
}
