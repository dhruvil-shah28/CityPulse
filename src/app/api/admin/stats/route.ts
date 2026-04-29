import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Basic Stats (Aggregations)
    const stats = await prisma.complaint.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const totalCount = await prisma.complaint.count();
    
    // 2. Complex SQL: Window Functions & Ranking
    // Demonstrating RANK() to find top problem areas (addresses with most complaints)
    const topAreas = await prisma.$queryRaw<any[]>`
      SELECT 
        address, 
        COUNT(id) as count,
        RANK() OVER (ORDER BY COUNT(id) DESC) as rank
      FROM "Complaint"
      WHERE address IS NOT NULL
      GROUP BY address
      LIMIT 5;
    `;

    // 3. Complex SQL: JOINS and Grouping for Trends
    const monthlyTrends = await prisma.$queryRaw<any[]>`
      SELECT 
        TO_CHAR("createdAt", 'Mon') as month,
        COUNT(id) as count,
        EXTRACT(MONTH FROM "createdAt") as month_num
      FROM "Complaint"
      GROUP BY month, month_num
      ORDER BY month_num ASC;
    `;

    // 4. Category Distribution (JOIN)
    const categoryDistribution = await prisma.$queryRaw<any[]>`
      SELECT 
        c.name, 
        COUNT(comp.id) as count
      FROM "Category" c
      LEFT JOIN "Complaint" comp ON c.id = comp."categoryId"
      GROUP BY c.name
      ORDER BY count DESC;
    `;

    // 5. Resolution Rate calculation
    const resolvedCount = stats.find(s => s.status === 'RESOLVED')?._count.id || 0;
    const resolutionRate = totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0;

    // Formatting BigInt from queryRaw to Number
    const formattedTopAreas = topAreas.map(a => ({
      ...a,
      count: Number(a.count),
      rank: Number(a.rank)
    }));

    const formattedMonthlyTrends = monthlyTrends.map(m => ({
      ...m,
      count: Number(m.count)
    }));

    const formattedCategoryDist = categoryDistribution.map(c => ({
      ...c,
      count: Number(c.count)
    }));

    return NextResponse.json({
      overview: {
        total: totalCount,
        pending: stats.find(s => s.status === 'PENDING')?._count.id || 0,
        inProgress: stats.find(s => s.status === 'IN_PROGRESS')?._count.id || 0,
        resolved: resolvedCount,
        resolutionRate: resolutionRate.toFixed(1),
        avgResponseTime: "2.4 days" // Mock for now
      },
      charts: {
        trends: formattedMonthlyTrends,
        categories: formattedCategoryDist,
        areas: formattedTopAreas,
        status: stats.map(s => ({ name: s.status, value: s._count.id }))
      }
    });

  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
