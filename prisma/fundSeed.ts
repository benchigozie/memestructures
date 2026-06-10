import prisma from "@/lib/prisma";
import { funds } from "@/data/funds";

export async function seedFunds() {
  console.log("Seeding funds...");

  for (const fund of funds) {
    await prisma.fund.upsert({
      where: {
        slug: fund.slug,
      },
      update: {
        name: fund.name,
        slug: fund.slug,
        minInvestment: fund.minInvestment,
        maxInvestment: fund.maxInvestment,
        isActive: true,
      },
      create: {
        slug: fund.slug,
        name: fund.name,
        minInvestment: fund.minInvestment,
        maxInvestment: fund.maxInvestment,
        isActive: true,
      },
    });
  }

  console.log("Funds seeded successfully.");
}