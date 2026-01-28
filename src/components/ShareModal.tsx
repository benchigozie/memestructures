"use client";

import { useState } from "react";
import {
    X,
    Link,
    Send,
} from "lucide-react";
import Image from "next/image";



type ShareModalProps = {
    title: string;
    onClose: () => void;
};

export default function ShareModal({ title, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);


    const copyLink = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-my-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Share this post</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="flex gap-3 text-my-deep-blue">
                    <a
                        href={`https://x.com/intent/tweet?url=${url}&text=${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl border hover:bg-my-gray/10 transition w-max"
                    >
                        <Image src="/images/x.png" height={18} width={18} alt="" />
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl border hover:bg-my-gray/10 transition w-max"
                    >
                        <Image src="/images/linkedin.png" height={18} width={18} alt="" />
                    </a>
                    <a
                        href={`https://t.me/share/url?url=${url}&text=${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl border hover:bg-my-gray/10 transition w-max"
                    >
                        <Send size={18} />
                    </a>
                    <a
                        href={`https://wa.me/?text=${text}%20${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl border hover:bg-my-gray/10 transition w-max"
                    >
                         <Image src="/images/whatsapp.png" height={18} width={18} alt="" />
                    </a>
                </div>

                <button
                    onClick={copyLink}
                    className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl border hover:bg-my-gray/10 transition hover:cursor-pointer"
                >
                    <Link size={18} />
                    {copied ? "Link copied ✓" : "Copy link"}
                </button>

                {copied && (
                    <p className="text-xs text-center text-my-gray mt-2">
                        Paste it anywhere you like
                    </p>
                )}
            </div>
        </div>
    );
}
