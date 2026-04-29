import { Pinecone } from "@pinecone-database/pinecone";

let index: any = null;

function getIndex() {
  if (!index) {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });
    index = pc.index(process.env.PINECONE_INDEX || "citypulse");
  }
  return index;
}

export async function upsertEmbedding(id: string, values: number[], metadata: any) {
  try {
    const pineconeIndex = getIndex();
    console.log(`Upserting to Pinecone: ID=${id}, Dimensions=${values?.length}`);
    if (!values || values.length === 0 || values.some(v => isNaN(v))) {
      throw new Error("Invalid embedding values: contains NaN or is empty");
    }
    const records = [
      {
        id,
        values,
        metadata,
      },
    ];
    await pineconeIndex.namespace("").upsert(records);
  } catch (error) {
    console.error("Error upserting to Pinecone:", error);
    throw error;
  }
}

export async function queryEmbeddings(values: number[], topK: number = 5) {
  try {
    const pineconeIndex = getIndex();
    const queryResponse = await pineconeIndex.namespace("").query({
      vector: values,
      topK,
      includeMetadata: true,
    });
    return queryResponse.matches;
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw error;
  }
}
