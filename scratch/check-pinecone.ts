
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

async function checkStats() {
  const index = pc.index("citypulse");
  const stats = await index.describeIndexStats();
  console.log("Stats:", JSON.stringify(stats, null, 2));
}
checkStats().catch(console.error);
