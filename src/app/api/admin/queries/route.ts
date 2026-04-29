import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryType = searchParams.get('type');

    let result;

    if (queryType === 'ranked-categories') {
      // DBMS Concept: Window Functions (RANK) and Complex Aggregation
      result = await prisma.$queryRaw`
        WITH CategoryStats AS (
          SELECT 
            c.id,
            c.name,
            COUNT(comp.id) as complaint_count
          FROM "Category" c
          LEFT JOIN "Complaint" comp ON c.id = comp."categoryId"
          GROUP BY c.id, c.name
        )
        SELECT 
          name,
          complaint_count,
          RANK() OVER(ORDER BY complaint_count DESC) as rank
        FROM CategoryStats;
      `;
      // Convert BigInt to Number
      result = (result as any[]).map(row => ({
        ...row,
        complaint_count: Number(row.complaint_count),
        rank: Number(row.rank)
      }));
    } else if (queryType === 'user-activity') {
      // DBMS Concept: Window Functions (ROW_NUMBER) and Joins
      result = await prisma.$queryRaw`
        SELECT 
          u.name,
          c.title,
          c."createdAt",
          ROW_NUMBER() OVER(PARTITION BY u.id ORDER BY c."createdAt" DESC) as recent_complaint_rank
        FROM "User" u
        INNER JOIN "Complaint" c ON u.id = c."userId"
        WHERE u.role = 'USER'
      `;
      result = (result as any[]).map(row => ({
        ...row,
        recent_complaint_rank: Number(row.recent_complaint_rank)
      }));
    } else {
      return NextResponse.json({ message: "Invalid query type" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Advanced query error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
