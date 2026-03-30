import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateAccessToken, generateEmailVerificationLink, generateRefreshToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/email";


export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { fullName, email, password, phone, referralCode, company } = body;

        console.log("Signup request body:", body);

        if (company) {
            return NextResponse.json(
                { success: false, error: "Invalid submission" },
                { status: 400 }
            );
        }

        if (!fullName || !email || !password || !phone) {
            return NextResponse.json(
                { success: false, error: "All required fields must be filled" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 409 }
            );
        }

        const PEPPER = process.env.BCRYPT_PEPPER;
        if (!PEPPER) {
            throw new Error("Missing Password Pepper");
        }
        const hashedPassword = await bcrypt.hash(password + PEPPER, 10);

        const user = await prisma.user.create({
            data: {
                name: fullName.trim(),
                email: normalizedEmail,
                password: hashedPassword
            }
        });

        console.log("New user created:", { id: user.id, email: user.email });

        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });
        const emailVerificationLink = generateEmailVerificationLink((user.id));

        console.log("Generated tokens and verification link for user")

        await sendVerificationEmail(user.email, emailVerificationLink);

        const response = NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: { id: user.id, email: user.email },
                accessToken
            },
            { status: 201 }
        );

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 40 * 60,
        });

        return response;

    } catch (error) {
        console.error("Signup error:", error);

        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}