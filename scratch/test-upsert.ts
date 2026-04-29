import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

async function testUpsert() {
  try {
    const indexName = process.env.PINECONE_INDEX || "citypulse";
    const index = pc.index(indexName);
    console.log("Testing upsert...");
    const values = new Array(768).fill(0.1);
    await index.upsert([
      {
        id: "test-1",
        values: values,
        metadata: { title: "Test Title" },
      },
    ]);
    console.log("Upsert successful!");
  } catch (e) {
    console.error(e);
  }
}

testUpsert();
