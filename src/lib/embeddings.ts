import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    
    if (!result.embedding || !result.embedding.values) {
      console.error("Gemini returned empty embedding:", result);
      throw new Error("Empty embedding returned from Gemini");
    }
    
    return result.embedding.values.slice(0, 768);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export function formatComplaintForEmbedding(complaint: {
  title: string;
  description: string;
  category?: { name: string };
  address?: string | null;
}) {
  return `Title: ${complaint.title}\nDescription: ${complaint.description}\nCategory: ${complaint.category?.name || "General"}\nLocation: ${complaint.address || "N/A"}`;
}
