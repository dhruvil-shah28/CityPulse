
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

async function listComplaints() {
  const index = pc.index("citypulse");
  // Query with a zero vector or just a broad query if possible
  // Since we can't easily do a "list all", we'll query with a generic vector if we had one
  // Or just use describeIndexStats to see if we have anything
  const results = await index.query({
    vector: new Array(768).fill(0),
    topK: 5,
    includeMetadata: true
  });
  console.log("Existing Complaints Sample:", JSON.stringify(results.matches, null, 2));
}
listComplaints().catch(console.error);
