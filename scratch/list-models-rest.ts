
import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.models) {
    data.models.forEach((m: any) => console.log(m.name));
  } else {
    console.log('No models found or error:', data);
  }
}
listModels().catch(console.error);
