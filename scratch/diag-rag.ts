
import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { generateEmbedding } from '../src/lib/embeddings';
import { queryEmbeddings } from '../src/lib/pinecone';
import { z } from 'zod';
import * as dotenv from "dotenv";
dotenv.config();

async function testRAGFull() {
  console.log("Testing RAG Full Flow...");
  const result = await generateText({
    model: google('gemini-3.1-flash-lite-preview'),
    system: `You are the CityPulse AI Assistant. ALWAYS use searchComplaints and ALWAYS summarize findings.`,
    messages: [{ role: 'user', content: 'Are there any pothole reports?' }],
    maxSteps: 5,
    tools: {
      searchComplaints: tool({
        description: 'Search for city complaints.',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          console.log('Tool executing with query:', query);
          const embedding = await generateEmbedding(query);
          const matches = await queryEmbeddings(embedding, 5);
          console.log('Matches found:', matches.length);
          return matches.map(m => m.metadata);
        },
      }),
    },
  });

  console.log("Final text:", result.text);
  console.log("Steps taken:", result.steps.length);
  result.steps.forEach((step, i) => {
    console.log(`Step ${i}:`, JSON.stringify(step, null, 2));
  });
}

testRAGFull().catch(console.error);
