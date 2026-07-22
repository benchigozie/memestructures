import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(request: Request) {

  try {
    const user = await getUserFromRequest();

    if (!user || (user.accountType !== "ADMIN" && user.accountType !== "DEV")) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const assetClasses = await prisma.assetClass.findMany({
      include: {
        fees: true,
        criteria: true,
        flowSteps: true,
        requirements: true,
        universes: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(assetClasses);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch asset classes.",
      },
      {
        status: 500,
      }
    );
  }
}