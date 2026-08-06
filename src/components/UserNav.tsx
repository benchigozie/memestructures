"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell, CircleUserRound } from "lucide-react"
import PopUp from "@/components/PopUp";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const UserNav = () => {
    const [currentPage, setCurrentPage] = useState<"overview" | "">("overview");
    const [menuState, setMenuState] = useState<boolean>(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [profileMenuState, setProfileMenuState] = useState(false);

    const toggleProfileMenu = () => {
        setProfileMenuState(!profileMenuState);
    }

    useEffect(() => {
        fetchUnreadCount();

    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await fetchWithAuth("/api/notifications/unread-count");

            if (!res.ok) return;

            const data = await res.json();
            setUnreadCount(data.count);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async () => {
        try {
            await fetchWithAuth("/api/notifications/mark-read", {
                method: "PATCH",
            });
            setUnreadCount?.(0);
        } catch (err) {
            console.error(err);
        }
    };

    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMenu = () => {
        console.log("toggling menu");
        setMenuState(!menuState);
    }

    const navLinks = [
        { name: "Overview", href: "/dashboard/user/overview", whiteIcon: "/images/kycwhite.png", blueIcon: "/images/kycblue.png" },
        { name: "Asset Categories", href: "/dashboard/user/assets", whiteIcon: "/images/assetwhite.png", blueIcon: "/images/assetblue.png" },
        { name: "Wallet", href: "/dashboard/user/wallet", whiteIcon: "/images/walletwhite.png", blueIcon: "/images/walletblue.png" },
        { name: "Transactions", href: "/dashboard/user/transactions", whiteIcon: "/images/transactionwhite.png", blueIcon: "/images/transactionblue.png" },
        { name: "Support", href: "/dashboard/user/support", whiteIcon: "/images/supportwhite.png", blueIcon: "/images/supportblue.png" },
    ]

    const { user } = useAuth();

    return (
        <section >
            <div className="h-screen hidden lg:block fixed top-0 left-0 w-56 bg-my-white/80 backdrop-blur-sm border-r border-gray-200 p-4">
                <div className="flex flex-col justify-between h-full">
                    <nav className="mt-14 flex py-4 gap-2 flex-col">
                        {
                            navLinks.map((page) => (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-300 ${currentPage === page.name
                                        ? "bg-my-deep-blue text-white"
                                        : "text-my-deep-blue hover:bg-gray-200"
                                        }`}
                                    onClick={() => setCurrentPage(page.name as "overview" | "")}
                                >
                                    <div>
                                        {
                                            currentPage === page.name ?
                                                <Image
                                                    src={page.whiteIcon}
                                                    alt={`${page.name} icon`}
                                                    width={20}
                                                    height={20}
                                                />
                                                :
                                                <Image
                                                    src={page.blueIcon}
                                                    alt={`${page.name} icon`}
                                                    width={20}
                                                    height={20}
                                                />
                                        }
                                    </div>
                                    <p>{page.name}</p>
                                </Link>
                            ))
                        }

                    </nav>
                    <div
                        className="py-2 px-4 cursor-pointer hover:bg-my-gray/10 outline outline-my-deep-blue/30 rounded-lg mt-auto"
                        onClick={() => setShowLogoutPopup(true)}
                    >
                        <button>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <section className="fixed top-0 w-full z-30 backdrop-blur-xl bg-my-white/60">
                <div className="w-full flex h-15 justify-between items-center lg:py-3 py-2 px-4 mx-auto relative">
                    <Link href="/" className="">
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={150}
                            height={40}
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="text-my-deep-blue relative">
                                <div onClick={markAsRead}>
                                    <Link href={"/dashboard/user/notifications"}>
                                        <Bell size={28} className="cursor-pointer" />
                                    </Link>
                                </div>
                                {unreadCount > 0 && (
                                    <div className="w-4 h-4 rounded-full bg-my-blue absolute -top-0.5 right-px text-[10px] text-my-white flex items-center justify-center">
                                        <p className="w-full text-center">
                                            {unreadCount > 99 ? "99" : unreadCount}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>

                                <button onClick={toggleProfileMenu} className="relative w-11 rounded-full h-11 bg-my-gray/10 flex text-my-deep-blue items-center justify-center cursor-pointer">
                                    <div>{user?.initials}</div>
                                </button>
                            </div>
                            <AnimatePresence>
                                {
                                    profileMenuState && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -10,
                                                scale: 0.95
                                            }}
                                            transition={{
                                                duration: 0.18,
                                                ease: "easeOut"
                                            }}
                                            className="flex flex-col items-center py-6 absolute top-full right-4 bg-my-white shadow-lg shadow-my-gray/10 rounded-lg mt-2 z-50"
                                        >

                                            <div className="w-15 h-15 bg-linear-240 from-my-blue to-my-deep-blue rounded-full flex items-center justify-center text-my-white text-xl font-semibold">
                                                <div>{user?.initials}</div>
                                            </div>
                                            <div className="flex flex-col py-2.5 px-10">
                                                <p>{user?.name}</p>
                                                <p>{user?.email}</p>
                                            </div>
                                            <div className="px-8 py-2.5 w-full">
                                                <div className="bg-my-gray/10 h-px w-full"></div>
                                            </div>

                                            <div className="w-full">
                                                <Link href={"/dashboard/user/profile"}>
                                                    <button className="py-2.5 px-10 hover:bg-my-blue-white/30 transition-all text-center w-full cursor-pointer">
                                                        Profile
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="w-full">
                                                <Link href={"/dashboard/user/profile"}>
                                                    <button className="py-2.5 px-10 hover:bg-my-blue-white/30 transition-all text-center w-full cursor-pointer">
                                                        Account Settings
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className="w-full">
                                                <Link href={"/dashboard/user/profile"}>
                                                    <button className="py-2.5 px-10 hover:bg-my-blue-white/30 transition-all text-center w-full cursor-pointer">
                                                        Change Password
                                                    </button>
                                                </Link>
                                            </div>
                                            <button

                                                className="py-2.5 px-10 hover:bg-my-blue-white/30 transition-all text-center w-full cursor-pointer rounded-lg border-my-gray/40 mx-2"
                                                onClick={() => setShowLogoutPopup(true)}
                                            >
                                                Logout
                                            </button>

                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>

                        </div>

                        <div onClick={toggleMenu} className="flex flex-col space-y-1 cursor-pointer lg:hidden items-end mr-5">
                            <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                            <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                            <div className="h-0.5 w-4 bg-my-deep-blue rounded-b-full"></div>
                        </div>
                    </div>
                    <div onClick={toggleMenu} className={`mt-3 mx-auto duration-500 top-full bg-my-white  absolute py-6 w-[90vw] rounded-2xl flex flex-col border border-my-blue-white ${menuState ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="py-2 px-6 hover:bg-my-blue-white/30 transition-all text-center"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <button

                            className="py-2 px-6 hover:bg-my-blue-white/30 transition-all text-center"
                            onClick={() => setShowLogoutPopup(true)}
                        >
                            Logout
                        </button>
                    </div>

                </div>
                {
                    showLogoutPopup && (
                        <PopUp
                            title="Confirm Logout"
                            message="Are you sure you want to log out of your account?"
                            onClose={() => setShowLogoutPopup(false)}
                            onConfirm={handleLogout}
                        />
                    )
                }
            </section>
        </section>
    )
}

export default UserNav