"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import InProgress from "@/components/InProgress";
import { useParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

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
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    async function sendMessage(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
    
        if (!message.trim() || !ticket) {
            return;
        }
    
        setSending(true);
    
        try {
            const res = await fetchWithAuth(
                `/api/user/support/tickets/${ticket.id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                    }),
                }
            );
    
            const data = await res.json();
    
            if (data.success) {
                setMessage("");
    
                setTicket((prev) =>
                    prev
                        ? {
                              ...prev,
                              messages: [
                                  ...prev.messages,
                                  data.data,
                              ],
                          }
                        : prev
                );
            } else {
                console.error(
                    data.error || "Failed to send message"
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    }

    useEffect(() => {
        async function loadTicket() {
            try {
                const ticketId = params["ticket-id"];

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
        <div className="p-4 md:p-8 min-h-[92vh] flex flex-col">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-my-deep-blue mb-1">
                    {ticket.subject}
                </h1>
                <p className="text-gray-500">{ticket.category}</p>
            </div>
    
            <div className="mb-6 p-4 rounded-xl bg-my-blue/5 border border-my-blue/10">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-my-blue text-white flex items-center justify-center">
                        <ShieldCheck size={22} />
                    </div>
    
                    <div>
                        <p className="font-semibold text-my-deep-blue">
                            Support Team
                        </p>
                        <p className="text-sm text-gray-500">
                            Responses from our support staff will appear below.
                        </p>
                    </div>
                </div>
            </div>
    
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {ticket.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.senderType === "USER"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-130 rounded-xl p-4 ${
                                msg.senderType === "USER"
                                    ? "bg-my-blue text-my-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            <p>{msg.message}</p>
    
                            <p className="text-xs mt-2 opacity-70">
                                {new Date(msg.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
    
            <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t border-gray-200 px-2">
                <form onSubmit={sendMessage}>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Write your Message..."
                        className="w-full rounded-xl outline outline-gray-300 p-4 resize-none focus:outline-my-deep-blue/30 transition-all"
                    />
    
                    <div className="flex justify-end mt-3">
                        <button
                            type="submit"
                            disabled={!message.trim() || sending}
                            className="bg-my-blue hover:bg-my-deep-blue cursor-pointer text-white px-5 py-3 rounded-xl disabled:opacity-50 duration-300 transition-colors"
                        >
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}