import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear all data — fresh start, no dummy content
  await prisma.post.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.workspace.deleteMany();

  console.log("Database cleared. Ready for onboarding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
