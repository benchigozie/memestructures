import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  console.log("Fetching asset class with slug:", slug);

  try {
    const asset = await prisma.assetClass.findUnique({
      where: {
        slug,
      },
      include: {
        fees: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        criteria: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        flowSteps: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        requirements: {
          orderBy: {
            displayOrder: "asc",
          },
        },
        universes: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });

    if (!asset) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset class not found",
        },
        { status: 404 }
      );
    }

    if (!asset.isPublished || !asset.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset class not available",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch asset class",
      },
      { status: 500 }
    );
  }
}