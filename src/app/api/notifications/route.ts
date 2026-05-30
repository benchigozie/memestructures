
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(req: Request) {
    try {
        const user = await getUserFromRequest();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        console.log("Received cursor:", searchParams.get("cursor"));

        const cursor = searchParams.get("cursor");

        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 20,

            ...(cursor && {
                cursor: {
                    id: cursor,
                },
                skip: 1,
            }),
        });

        const nextCursor =
            notifications.length === 20
                ? notifications[notifications.length - 1].id
                : null;

        return NextResponse.json({
            success: true,
            notifications,
            nextCursor,
        });

    } catch {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
}