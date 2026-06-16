"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import Link from "next/link";

type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";

type Ticket = {
    id: string;
    subject: string;
    category: string;
    status: TicketStatus;
    createdAt: string;
};

const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-blue-100 text-blue-700",
    CLOSED: "bg-gray-100 text-gray-700",
};

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        async function getTickets() {
            try {
                const res = await fetchWithAuth(
                    "/api/user/support/tickets"
                );

                const data = await res.json();

                if (data.success) {
                    setTickets(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getTickets();
    }, []);

    if (loading) {
        return (
            <InProgress message="Loading your support tickets" />
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-my-deep-blue">
                My Support Tickets
            </h1>
            <p className="mb-6">Click on a ticket to open</p>

            {tickets.length === 0 ? (
                <div className="bg-white rounded-lg p-6 shadow">
                    <p>No support tickets found.</p>
                </div>
            ) : (
                <div className="space-y-4 flex flex-col">
                    {tickets.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/dashboard/user/support/tickets/${ticket.id}`}
                        >
                            <div

                                className="border border-my-gray/10 hover:border-my-gray/40 cursor-pointer rounded-xl p-4"
                                onClick={() => { }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="font-semibold text-lg">
                                            {ticket.subject}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {ticket.category}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${statusStyles[ticket.status]
                                            }`}
                                    >
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mt-3">
                                    {new Date(
                                        ticket.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}