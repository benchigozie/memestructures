import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import  prisma  from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { identifier, password } = body;

        console.log("this is the login request body:", body);

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, error: "Email/Username and password are required" },
                { status: 400 }
            );
        }

        const normalizedIdentifier = identifier.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let user;

        if (emailRegex.test(normalizedIdentifier)) {
            user = await prisma.user.findUnique({
              where: { email: normalizedIdentifier },
            });
          } else {
            user = await prisma.user.findUnique({
              where: { username: normalizedIdentifier },
            });
          }

        if (user && !user?.emailVerified) {
            return NextResponse.json(
              { success: false, error: "Your email is not verified",  user: { email: user.email } },
              { status: 403 }
            );
        }

        console.log("User found in database:", user);   
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 401 }
            );
        }

        const PEPPER = process.env.BCRYPT_PEPPER;
        const passwordMatches = await bcrypt.compare(password + PEPPER, user.password);

        console.log("Password match result:", passwordMatches);

        if (!passwordMatches) {
            return NextResponse.json(
                { success: false, error: "The password you entered is incorrect" },
                { status: 401 }
            );
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });

        const response = NextResponse.json(
            {
                success: true,
                message: "Logged in successfully",
                user: { id: user.id, name: user.name,  email: user.email, username: user.username, kycStatus: user.kycStatus, accountType: user.accountType },
            },
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 5 * 60,
          });

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