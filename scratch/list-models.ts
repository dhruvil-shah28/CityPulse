
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const models = await genAI.listModels();
  for (const model of models.models) {
    console.log(model.name);
  }
}
listModels().catch(console.error);
