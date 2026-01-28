import { NextResponse } from "next/server";

export async function POST(req: Request) {
  
  try {
    const body = await req.json();

    const response = await fetch(process.env.NEXT_PUBLIC_EXCEL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
