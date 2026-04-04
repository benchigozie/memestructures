import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ available: false });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  return NextResponse.json({
    available: !existing,
  });
}