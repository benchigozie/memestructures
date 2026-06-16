"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import { useParams } from "next/navigation";

type Message = {
    id: string;
    senderType: "USER" | "ADMIN";
    message: string;
    createdAt: string;
};

type Ticket = {
    id: string;
    subject: string;
    status: string;
    category: string;
    messages: Message[];
};

export default function TicketPage() {

    const params = useParams();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTicket() {
            try {
                const ticketId  = params["ticket-id"];

                console.log("this is params:", params)
                const res = await fetchWithAuth(
                    `/api/user/support/tickets/${ticketId}`
                );

                const data = await res.json();

                if (data.success) {
                    setTicket(data.data);
                    console.log("this is data:", data.data, data.data.messages);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadTicket();
    }, [params]);

    if (loading) {
        return (
            <InProgress message="Loading conversation" />
        );
    }

    if (!ticket) {
        return (
            <div className="p-6">
                Ticket not found.
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-my-deep-blue mb-1">
                    {ticket.subject}
                </h1>

                <p className="text-gray-500">
                    {ticket.category}
                </p>
            </div>

            <div className="space-y-4">
                {ticket.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.senderType === "USER"
                                ? "justify-start"
                                : "justify-end"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] rounded-xl p-4 ${
                                msg.senderType === "USER"
                                    ? "bg-gray-100"
                                    : "bg-my-blue text-white"
                            }`}
                        >
                            <p>{msg.message}</p>

                            <p className="text-xs mt-2 opacity-70">
                                {new Date(
                                    msg.createdAt
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}