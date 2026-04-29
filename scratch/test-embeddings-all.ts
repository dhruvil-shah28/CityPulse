
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

async function testAllEmbeddings() {
  const models = ["gemini-embedding-001", "gemini-embedding-2-preview", "gemini-embedding-2"];
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent("Hello world");
      console.log(`${modelName} WORKS!`);
      return modelName;
    } catch (e: any) {
      console.log(`${modelName} FAILED: ${e.message}`);
    }
  }
}
testAllEmbeddings().catch(console.error);
