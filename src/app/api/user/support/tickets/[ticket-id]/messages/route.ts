import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(
    req: Request,
    context: { params: Promise<{ "ticket-id": string }> }
) {
    const { "ticket-id": ticketId } = await context.params;

    try {
        const user = await getUserFromRequest();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json(
                { success: false, error: "Message cannot be empty" },
                { status: 400 }
            );
        }

        
        const ticket = await prisma.supportTicket.findFirst({
            where: {
                id: ticketId,
                userId: user.id,
            },
        });

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: "Ticket not found" },
                { status: 404 }
            );
        }

       
        const newMessage = await prisma.supportMessage.create({
            data: {
                ticketId,
                senderId: user.id,
                senderType: "USER",
                message: message.trim(),
            },
        });

        return NextResponse.json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, error: "Failed to send message" },
            { status: 500 }
        );
    }
}