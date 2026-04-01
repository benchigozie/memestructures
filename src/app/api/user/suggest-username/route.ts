import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {

    console.log("Received username suggestion request");
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    const base = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const suggestions: string[] = [];

    while (suggestions.length < 3) {
      const random = Math.floor(100 + Math.random() * 900);

      const username = `${base}_${random}`;

      const exists = await prisma.user.findUnique({
        where: { username }
      });

      if (!exists && !suggestions.includes(username)) {
        suggestions.push(username);
      }
    }

    return NextResponse.json({
      suggestions
    });

  } catch (err) {
    console.error("Suggestion error:", err);

    return NextResponse.json(
      { error: "Could not generate suggestions" },
      { status: 500 }
    );
  }
}