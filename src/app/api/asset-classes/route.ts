import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const assetClasses = await prisma.assetClass.findMany({
      where: {
        isPublished: true,
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        acronym: true,

        // Marketing
        headline: true,
        shortDescription: true,
        description: true,

        // Branding
        icon: true,
        themeColor: true,
        backgroundColor: true,
        textColor: true,

        // Investment details
        fundType: true,
        riskProfile: true,
        allocationSource: true,
        investmentHorizon: true,

        minimumInvestment: true,
        maximumInvestment: true,

        lockupPeriod: true,
        targetReturn: true,
      },
    });


    return NextResponse.json(assetClasses);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch asset classes",
      },
      {
        status: 500,
      }
    );
  }
}