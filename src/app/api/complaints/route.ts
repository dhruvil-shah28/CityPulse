import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateEmbedding, formatComplaintForEmbedding } from "@/lib/embeddings";
import { upsertEmbedding } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, categoryId, address, lat, lng, imageUrl } = await req.json();

    if (!title || !description || !categoryId || !address) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Creating the complaint
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        userId: session.user.id,
        categoryId,
        status: "PENDING",
        imageUrl,
      },
    });

    // Create an initial status history record (DBMS Concept: Triggers / History tracking)
    await prisma.statusHistory.create({
      data: {
        complaintId: complaint.id,
        oldStatus: "PENDING",
        newStatus: "PENDING",
        changedById: session.user.id,
        notes: "Complaint created",
      }
    });

    // Indexing in Pinecone (Background task - not awaited to avoid blocking response)
    // In a production app, this would be handled by a queue (BullMQ, Inngest, etc.)
    (async () => {
      try {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        const text = formatComplaintForEmbedding({ ...complaint, category: category || undefined });
        const embedding = await generateEmbedding(text);
        await upsertEmbedding(complaint.id, embedding, {
          title: complaint.title || "",
          description: complaint.description || "",
          status: complaint.status || "PENDING",
          category: category?.name || "General",
          address: complaint.address || "N/A",
          createdAt: complaint.createdAt.toISOString(),
        });
        console.log(`Successfully indexed new complaint ${complaint.id} in Pinecone.`);
      } catch (error) {
        console.error("Failed to index new complaint in Pinecone:", error);
      }
    })();

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error("Failed to create complaint:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
