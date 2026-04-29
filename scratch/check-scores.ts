
import { generateEmbedding } from '../src/lib/embeddings';
import { queryEmbeddings } from '../src/lib/pinecone';
import * as dotenv from "dotenv";
dotenv.config();

async function testSearch() {
  const query = "pothole";
  console.log("Searching for:", query);
  const embedding = await generateEmbedding(query);
  const matches = await queryEmbeddings(embedding, 5);
  console.log("Matches count:", matches.length);
  matches.forEach((m, i) => {
    console.log(`Match ${i}: Score=${m.score}, Title=${m.metadata?.title}`);
  });
}
testSearch().catch(console.error);
