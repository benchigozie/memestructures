import { prisma } from "@/lib/prisma";

async function main() {

  console.log("Clearing database...");

  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  await prisma.user.create({
    data: {
      name: "Ben Admin",
      email: "benmarrk@gmail.com",
      password: "Mrbarbie1",
      accountType: "DEV"
    }
  });
    console.log("Seed admin inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });