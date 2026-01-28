"use client";

import { useState } from "react";
import ShareModal from "./ShareModal";

type ShareButtonProps = {
    title: string;
    text?: string;
};


export default function ShareButton({ title, text }: ShareButtonProps) {

    const [open, setOpen] = useState(false);

    const openShareFallback = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setOpen(true);
    };
    const handleShare = async () => {

        if (!navigator.share) {
            openShareFallback();
            return;
        }

        try {
            await navigator.share({
                title,
                text,
                url: window.location.href,
            });
        } catch (err) {
            console.error("Share cancelled", err);
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="px-4 py-2 mt-6 rounded-xl border border-my-deep-blue text-my-deep-blue hover:bg-my-deep-blue hover:text-white transition hover:cursor-pointer"
            >
                Share Post
            </button>
            {open && (
                <ShareModal
                    title={title}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
