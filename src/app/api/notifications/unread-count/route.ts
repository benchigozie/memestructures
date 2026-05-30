
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let count = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    if (count > 99) {
      count = 99;
    }
    

    return NextResponse.json({
      success: true,
      count,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}