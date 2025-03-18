import {
  GenerateFlashcardFromDocumentInput,
  FlashcardGenerationInput,
} from "@/types/flashcard";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const GeneratedFlashcardSetSchema = z.object({
  title: z.string(),
  description: z.string(),
  flashcards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
      hint: z.string().optional(),
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

// Generate flashcards from a topic without document
export async function generateFlashcardsWithoutDocument(
  input: FlashcardGenerationInput
) {
  const prompt = `
    Generate a set of flashcards about ${input.title}.
    ${input.description && `Description: ${input.description}`}
    Number of Flashcards: ${input.numFlashcards || 10}

    The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

    Provide the flashcards in the following structured JSON format:
    \`\`\`json
    {
      "title": "Title of the flashcard set",
      "description": "A brief description of the flashcard set",
      "flashcards": [
        {
          "front": "Question or concept on the front of the card",
          "back": "Answer or explanation on the back of the card",
          "hint": "Optional hint to help remember the answer",
        }
      ]
    }
    \`\`\`

    Ensure each flashcard is clear, concise, and relevant to the topic.
    The front should contain a question or concept, and the back should contain the answer or explanation.
    Include optional hints where helpful.
  `;

  try {
    const result = await generateObject({
      model: model,
      schemaName: "FlashcardSet",
      schemaDescription: "An AI generated set of flashcards.",
      schema: GeneratedFlashcardSetSchema,
      prompt: prompt,
    });
    console.log(JSON.stringify(result.object, null, 2));
    const response = result.object;

    if (!response) {
      throw new Error("Gemini API returned an empty response.");
    }

    // Validate the JSON against the schema
    try {
      const validatedFlashcards = GeneratedFlashcardSetSchema.parse(response);
      return validatedFlashcards;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Failed to generate Gemini flashcards:", error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
}

// Generate flashcards from a document
export async function generateFlashcardsFromDocument(
  input: GenerateFlashcardFromDocumentInput
) {
  const prompt = `
  Create a set of flashcards from the document provided.
  Number of Flashcards: ${input.numFlashcards || 10}

  The response MUST be valid JSON, and ONLY valid JSON. Do not include any surrounding text or explanations.

  Provide the flashcards in the following structured JSON format:
  \`\`\`json
  {
    "title": "Title of the flashcard set",
    "description": "A brief description of the flashcard set",
    "flashcards": [
      {
        "front": "Question or concept on the front of the card",
        "back": "Answer or explanation on the back of the card",
        "hint": "Optional hint to help remember the answer",
      }
    ]
  }
  \`\`\`

  Ensure each flashcard is clear, concise, and relevant to the document content.
  The front should contain a question or key concept from the document, and the back should contain the answer or explanation.
  Include optional hints where helpful.
  Extract the most important concepts, facts, definitions, and relationships from the document.
`;
  try {
    const result = await generateObject({
      model: model,
      schemaName: "FlashcardSet",
      schemaDescription:
        "An AI generated set of flashcards based on a document.",
      schema: GeneratedFlashcardSetSchema,
      messages: [
        {
          role: "system",
          content:
            "You are an AI tutor. Your job is to take a document and create a set of flashcards that capture the key concepts, facts, definitions, and relationships from the document.",
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
      const validatedFlashcards = GeneratedFlashcardSetSchema.parse(response);
      return validatedFlashcards;
    } catch (validationError: any) {
      console.error("Zod validation error:", validationError);
      throw new Error(
        `Gemini response does not match the expected format: ${validationError.message}`
      );
    }
  } catch (error: any) {
    console.error("Failed to generate flashcards from document:", error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
}
