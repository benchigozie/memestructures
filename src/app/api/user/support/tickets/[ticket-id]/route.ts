import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(
    req: Request,
    context: { params: Promise<{ "ticket-id" : string }> }
) {

    const params = await context.params;
    try {
        const user = await getUserFromRequest();


        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Not authenticated",
                },
                { status: 401 }
            );
        }

     
        const ticketId = params["ticket-id"];

        const ticket = await prisma.supportTicket.findFirst({
            where: {
                id: ticketId,
                userId: user.id,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

     

        if (!ticket) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Ticket not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch ticket",
            },
            { status: 500 }
        );
    }
}