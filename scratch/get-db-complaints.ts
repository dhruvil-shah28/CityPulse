
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const complaints = await prisma.complaint.findMany({
    take: 5,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log("Database Complaints:", JSON.stringify(complaints, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
