import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbedding } from "@/lib/embeddings";
import { queryEmbeddings } from "@/lib/pinecone";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    console.log("Chat API: Starting manual RAG flow...");

    // 1. Retrieval (R)
    let context = "";
    try {
      const embedding = await generateEmbedding(lastMessage);
      const matches = await queryEmbeddings(embedding, 3);
      if (matches && matches.length > 0) {
        context = matches
          .map((m: any) => `- ${m.metadata.title}: ${m.metadata.description} (Status: ${m.metadata.status}, Address: ${m.metadata.address})`)
          .join("\n");
      }
    } catch (err) {
      console.error("Retrieval failed, continuing without context:", err);
    }

    // 2. Generation (G)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
    // Using gemini-2.5-flash as verified in list-models
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are the CityPulse AI Assistant.
    
Context from city records:
${context || "No specific records found for this query."}

User Question: ${lastMessage}

Please provide a helpful, professional, and concise answer based on the context above. If no records were found, inform the user but try to help them generally.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Chat API: Successfully generated response.");

    return Response.json({
      role: "assistant",
      content: responseText,
    });
  } catch (error: any) {
    console.error("Chat API Critical Error:", error);
    return Response.json(
      { error: "I'm sorry, I encountered a problem. Please try again later." },
      { status: 500 }
    );
  }
}
