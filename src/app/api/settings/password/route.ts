import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const {
            currentPassword,
            newPassword,
        } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Current password and new password are required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Password must be at least 8 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        const PEPPER = process.env.BCRYPT_PEPPER;

        if (!PEPPER) {
            throw new Error("Missing Password Pepper");
        }

        const authUser = await getUserFromRequest();

        if (!authUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated.",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                id: authUser.id,
            },
            select: {
                id: true,
                password: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword + PEPPER,
            user.password
        );

        if (!passwordMatches) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Current password is incorrect.",
                },
                {
                    status: 400,
                }
            );
        }

        const samePassword = await bcrypt.compare(
            newPassword + PEPPER,
            user.password
        );

        if (samePassword) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Your new password must be different from your current password.",
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(
            newPassword + PEPPER,
            10
        );

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        console.error("Change password error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Could not update password.",
            },
            {
                status: 500,
            }
        );
    }
}