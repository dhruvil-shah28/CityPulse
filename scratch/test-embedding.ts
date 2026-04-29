import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

async function test() {
  const models = ["text-embedding-004", "embedding-001"];
  for (const m of models) {
    try {
      console.log(`Testing model: ${m}`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.embedContent("Hello world");
      console.log(`Success with ${m}! Dimensions: ${result.embedding.values.length}`);
      return;
    } catch (e: any) {
      console.error(`Failed with ${m}: ${e.message}`);
    }
  }
}

test();
