import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Convert file to Blob for WebPDFLoader
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 50,
    });

    const chunks = await textSplitter.splitDocuments(docs);

    // Save PDF metadata
    const chatPdf = await prisma.chatPdf.create({
      data: { name: file.name, userId: userId },
    });

    for (const chunk of chunks) {
      const response = await embeddingModel.embedContent(chunk.pageContent);
      const embedding = response.embedding.values;

      await prisma.$executeRaw`
        INSERT INTO "Chunk" ("id", "chatPdfId", "content", "embedding") 
        VALUES (
          ${crypto.randomUUID()}, 
          ${chatPdf.id}, 
          ${chunk.pageContent}, 
          ${embedding}::vector(768)
        )
      `;
    }

    return NextResponse.json({ id: chatPdf.id }, { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
