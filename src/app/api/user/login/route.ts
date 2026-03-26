import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 401 }
            );
        }

        const PEPPER = process.env.BCRYPT_PEPPER;
        const passwordMatches = await bcrypt.compare(password + PEPPER, user.password);

        if (!passwordMatches) {
            return NextResponse.json(
                { success: false, error: "Password is incorrect" },
                { status: 401 }
            );
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });

        const response = NextResponse.json(
            {
                success: true,
                message: "Logged in successfully",
                user: { id: user.id, email: user.email },
                accessToken,
            },
            { status: 200 }
        );

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}