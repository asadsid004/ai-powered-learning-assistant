import {
  GenerateQuizFromDocumentInput,
  QuizGenerationInput,
} from "@/types/quiz";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const GeneratedQuizSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.object({
      text: z.string(),
      explanation: z.string().optional(),
      options: z
        .array(
          z.object({
            text: z.string(),
            isCorrect: z.boolean(),
          })
        )
        .optional(),
    })
  ),
});

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

// Generate a quiz from a document or topic
export async function generateQuizWithoutDocument(input: QuizGenerationInput) {
  const prompt = `
    Generate a quiz about ${input.title}.
    Description: ${input.description}
    Difficulty: ${input.difficulty}
    Number of Questions: ${input.numQuestions}

    The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

    Provide the quiz in the following structured JSON format:
    \`\`\`json
    {
      "title": "Title of the quiz",
      "description": "A brief description of the quiz",
      "questions": [
        {
          "text": "The question text",
          "explanation": "A brief explanation for the answer",
          "options": [
            {
              "text": "Option text",
              "isCorrect": true/false
            }
          ]
        }
      ]
    }
    \`\`\`

    Ensure each question is clear, concise, and relevant to the topic.
    For MULTIPLE_CHOICE questions, provide 4 options, with exactly one being correct.
    Provide brief to detailed explanations for each question.
  `;

  try {
    const result = await generateObject({
      model: model,
      schemaName: "Quiz",
      schemaDescription: "An AI generated Quiz.",
      schema: GeneratedQuizSchema,
      prompt: prompt,
    });
    console.log(JSON.stringify(result.object, null, 2));
    const response = result.object;

    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedQuiz = GeneratedQuizSchema.parse(response);
      return validatedQuiz;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Failed to generate Gemini quiz:", error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

export async function generateQuizFromDocument(
  input: GenerateQuizFromDocumentInput
) {
  const prompt = `
  Create a quiz from the document provided with following categories
  Difficulty: ${input.difficulty}
  Number of Questions: ${input.numQuestions}

  The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

  Provide the quiz in the following structured JSON format:
  \`\`\`json
  {
    "title": "Title of the quiz",
    "description": "A brief description of the quiz",
    "questions": [
      {
        "text": "The question text",
        "explanation": "A brief explanation for the answer",
        "options": [
          {
            "text": "Option text",
            "isCorrect": true/false
          }
        ]
      }
    ]
  }
  \`\`\`

  Ensure each question is clear, concise, and relevant to the topic.
  For MULTIPLE_CHOICE questions, provide 4 options, with exactly one being correct.
  Provide brief to detailed explanations for each question.
  Also keep in mind I am not using markdown to display quiz questions. I am using html elements to display questions and answers.
  So generate accordingly such that the questions are clear and understandable to read and answer.
`;
  try {
    const result = await generateObject({
      model: model,
      schemaName: "Quiz",
      schemaDescription: "An AI generated Quiz based on a document.",
      schema: GeneratedQuizSchema,
      messages: [
        {
          role: "system",
          content:
            "You are an AI tutor. Your job is to take a document and create a multiple-choice quiz with at least 4 questions. Each question should have 4 answer options, with exactly one correct answer.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "file",
              data: input.file,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });

    const response = result.object;
    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedQuiz = GeneratedQuizSchema.parse(response);
      return validatedQuiz;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Failed to generate quiz from document:", error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

// Generate report
interface ReportGenerationInput {
  userName: string;
  questions: string[];
  userAnswers: string[];
  correctAnswers: string[];
}

interface GeneratedReport {
  summary: string;
  topicInsights: { [topic: string]: string };
  resourceLinks: { [topic: string]: string[] };
}

// Zod schema for runtime validation
const GeneratedReportSchema = z.object({
  summary: z.string(),
  topicInsights: z.record(z.string(), z.string()), // key-value pairs, topic -> insight
  resourceLinks: z.record(z.string(), z.array(z.string())), // key-value pairs, topic -> array of URLs
});

export async function generatePersonalizedReport(
  input: ReportGenerationInput
): Promise<GeneratedReport> {
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
    Generate a personalized learning report for ${
      input.userName
    } based on their quiz performance.
    
    The quiz included the following questions and answers:
    ${input.questions
      .map(
        (question, index) => `
      Question ${index + 1}: ${question}
      User's answer: ${input.userAnswers[index]}
      Correct answer: ${input.correctAnswers[index]}
    `
      )
      .join("\n")}

    Analyze the user's answers to identify areas where they struggled.
    Provide a concise summary of their overall performance.
    For each topic where the user made mistakes, provide a brief insight explaining the misconception.
    Also, for each of those topics, find 2-3 relevant resources links (URLs) to help them learn more.

    The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

    Provide the report in the following structured JSON format:
    \`\`\`json
    {
      "summary": "Overall summary of the user's performance.",
      "topicInsights": {
        "Topic 1": "Insight into the user's misconception about Topic 1.",
        "Topic 2": "Insight into the user's misconception about Topic 2."
      },
      "resourceLinks": {
        "Topic 1": [
          "https://example.com/resource1",
          "https://example.com/resource2"
        ],
        "Topic 2": [
          "https://example.com/resource3",
          "https://example.com/resource4"
        ]
      }
    }
    \`\`\`

    The summary should be encouraging and educational.  Topic insights should be clear and concise.  Resource links MUST be valid URLs.
    Try to determine the correct name of the topic.
  `;

  try {
    const result = await generateObject({
      model: model,
      schemaName: "report",
      schemaDescription: "An AI generated personalized learning report.",
      schema: GeneratedReportSchema,
      prompt: prompt,
    });

    const response = result.object;

    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedReport = GeneratedReportSchema.parse(response);
      return validatedReport;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Error generating personalized report with Gemini:", error);
    throw new Error(`Failed to generate personalized report: ${error.message}`);
  }
}
