"use client";

import InProgress from '@/components/InProgress';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useEffect, useState } from 'react';

type Notification = {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
};

const page = () => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const res = await fetchWithAuth("/api/notifications");

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();

            setNotifications(data.notifications);
            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreNotifications = async () => {
        if (!nextCursor) return;

        try {
            const res = await fetchWithAuth(
                `/api/notifications?cursor=${nextCursor}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();

            setNotifications(prev => [
                ...prev,
                ...data.notifications,
            ]);

            setNextCursor(data.nextCursor);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="p-4">
                <div className="max-w-2xl">
                    <section className="flex flex-col gap-4 mb-6">
                        <h1 className="text-xl md:text-3xl text-my-deep-blue font-bold mb-1 text-center">
                            Notifications
                        </h1>

                        {loading && (
                            <InProgress message="Loading notifications" />
                        )}

                        {!loading && notifications.length === 0 && (
                            <p className="text-center text-gray-500">
                                No notifications yet.
                            </p>
                        )}

                        {notifications.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className="border border-my-gray/10 rounded-xl p-4"
                                    >
                                        <h3 className="font-medium text-my-deep-blue">
                                            {notification.title}
                                        </h3>

                                        <p>{notification.message}</p>

                                        <small>
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        )}

                        {nextCursor && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={loadMoreNotifications}
                                    className="bg-my-blue text-white hover:bg-my-deep-blue cursor-pointer duration-300 transition-colors px-4 py-2 rounded-lg"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default page