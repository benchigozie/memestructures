import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: Request) {

  console.log("Received POST request to create asset class.");
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    if (user.accountType !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    const {
      name,
      slug,
      acronym,

      headline,
      shortDescription,
      description,

      icon,
      coverImage,
      themeColor,
      backgroundColor,
      textColor,

      fundType,
      riskProfile,
      allocationSource,
      investmentHorizon,
      lockupPeriod,

      minimumInvestment,
      maximumInvestment,
      targetAllocationPercent,
      targetReturn,

      riskDisclosure,

      displayOrder,
      isPublished,
      isActive,

      criteria,
      flowSteps,
      requirements,
      universes,
      fees,
    } = await req.json();

    const assetClass = await prisma.assetClass.create({
      data: {
        // Identity
        name,
        slug,
        acronym,


        // Marketing
        headline,
        shortDescription,
        description,

        // Branding
        icon,
        coverImage,
        themeColor,
        backgroundColor,
        textColor,

        // Investment
        fundType,
        riskProfile,
        allocationSource,
        investmentHorizon,
        lockupPeriod,

        minimumInvestment: Number(minimumInvestment),
        maximumInvestment: maximumInvestment
          ? Number(maximumInvestment)
          : null,

        targetAllocationPercent: targetAllocationPercent
          ? Number(targetAllocationPercent)
          : null,

        targetReturn,

        fees: {
          create: fees,
        },
        // Risk & Publishing
        riskDisclosure,
        displayOrder,
        isPublished,
        isActive,

        // Relations
        criteria: {
          create: criteria,
        },

        flowSteps: {
          create: flowSteps,
        },

        requirements: {
          create: requirements,
        },

        universes: {
          create: universes,
        },
      },

      include: {
        fees: true,
        criteria: true,
        flowSteps: true,
        requirements: true,
        universes: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Asset class created successfully.",
      data: assetClass,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}