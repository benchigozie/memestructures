import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}