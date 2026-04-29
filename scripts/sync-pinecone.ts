import * as dotenv from "dotenv";
dotenv.config();
import { prisma } from "../src/lib/prisma";
import { generateEmbedding, formatComplaintForEmbedding } from "../src/lib/embeddings";
import { upsertEmbedding } from "../src/lib/pinecone";

async function syncComplaints() {
  console.log("Starting sync...");
  console.log(`Pinecone API Key present: ${!!process.env.PINECONE_API_KEY} (Length: ${process.env.PINECONE_API_KEY?.length})`);
  const complaints = await prisma.complaint.findMany({
    include: { category: true },
  });

  console.log(`Found ${complaints.length} complaints to index.`);

  for (const complaint of complaints) {
    try {
      console.log(`Indexing complaint: ${complaint.id} - ${complaint.title}`);
      const text = formatComplaintForEmbedding(complaint);
      const values = await generateEmbedding(text);
      console.log(`Embedding dimensions: ${values.length}`);
      
      await upsertEmbedding(complaint.id, values, {
        title: complaint.title || "",
        description: complaint.description || "",
        status: complaint.status || "PENDING",
        category: complaint.category?.name || "General",
        address: complaint.address || "N/A",
        createdAt: complaint.createdAt.toISOString(),
      });
      console.log(`Successfully indexed: ${complaint.id}`);
    } catch (error) {
      console.error(`Failed to index complaint ${complaint.id}:`, error);
    }
  }

  console.log("Sync completed.");
}

syncComplaints()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
