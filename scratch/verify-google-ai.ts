
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Model initialized");
  // Try a simple generate content
  const response = await result.generateContent("Hi");
  console.log("Response:", response.response.text());
}
listModels().catch(console.error);
