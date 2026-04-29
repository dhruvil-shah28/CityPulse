import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: complaintId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    // DBMS Concept: Transactions
    // We use Prisma's interactive transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get current complaint to verify it exists and get old status
      const complaint = await tx.complaint.findUnique({
        where: { id: complaintId }
      });

      if (!complaint) {
        throw new Error("Complaint not found");
      }

      // 2. Update the complaint
      const updatedComplaint = await tx.complaint.update({
        where: { id: complaintId },
        data: { status }
      });

      // 3. Create status history log
      await tx.statusHistory.create({
        data: {
          complaintId,
          oldStatus: complaint.status,
          newStatus: status,
          changedById: session.user.id,
          notes: notes || "Status updated by admin"
        }
      });

      return updatedComplaint;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Transaction error:", error);
    if (error.message === "Complaint not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: "Transaction failed, rollback executed." }, { status: 500 });
  }
}
