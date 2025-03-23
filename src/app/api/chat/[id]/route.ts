import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

type Params = Promise<{ id: string }>;

async function getEmbeddings(text: string) {
  const response = await embeddingModel.embedContent(text);
  return response.embedding.values;
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate embedding for the user query
    const queryEmbedding = await getEmbeddings(message);

    // Retrieve relevant chunks using similarity search
    const relevantChunks: any = await prisma.$queryRaw`
      SELECT content FROM "Chunk"
      WHERE "chatPdfId" = ${id}
      ORDER BY embedding <-> ${queryEmbedding}::vector
      LIMIT 3;
    `;

    const context = relevantChunks
      .map((chunk: any) => chunk.content)
      .join("\n");

    // Generate response using Gemini AI
    const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const aiResponse = await chatModel.generateContent(
      `Context from the PDF: ${context}\n\nUser question: ${message}\n\nPlease answer based on the provided context.\nAvoid using markdown. Be very clear in answering the questions.\nUse dots/stars for bullets points whereever needed, like this make responses look clear and easy to understand`
    );
    const responseText = aiResponse.response.text();

    // Save messages in database
    await prisma.message.createMany({
      data: [
        { chatPdfId: id, role: "user", content: message },
        { chatPdfId: id, role: "assistant", content: responseText },
      ],
    });

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const messages = await prisma.message.findMany({
      where: { chatPdfId: id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
