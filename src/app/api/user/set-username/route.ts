import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 });
    }

    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let payload: any;

    try {
        payload = verifyToken(token, "access");
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.name === "EXPIRED" ? "Session expired" : "Invalid token" }, { status: 401 });
    }

    

    const existing = await prisma.user.findUnique({ where: { username } });

    if (existing) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: { username },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        kycStatus: true,
        accountType: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Set username error:", err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}