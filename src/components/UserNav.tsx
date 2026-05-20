"use client"

import Image from "next/image"
import Link from "next/link"


import { useState } from "react"

const UserNav = () => {
    const [currentPage, setCurrentPage] = useState<"overview" | "" >("overview");
    const [menuState, setMenuState] = useState<boolean>(false);

    const toggleMenu = () => {
        console.log("toggling menu");
        setMenuState(!menuState);
    }

    const navLinks = [
        { name: "overview", href: "/dashboard/user" },
        { name: "Asset Categories", href: "/dashboard/user/assets" },
    ]

    return (
        <section >
            <div className="h-screen hidden md:block fixed top-0 left-0 w-56 bg-my-white/80 backdrop-blur-sm border-r border-gray-200 p-4">
                <div>
                    <Image
                        src="/images/memestructureslogo.png"
                        alt="Meme Structures Logo"
                        width={180}
                        height={50}
                    />
                    <nav className="mt-10 flex gap-2 flex-col">
                        {
                            navLinks.map((page) => (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-300 ${
                                        currentPage === page.name
                                            ? "bg-my-deep-blue text-white"
                                            : "text-my-deep-blue hover:bg-gray-200"
                                    }`}
                                    onClick={() => setCurrentPage(page.name as "overview" | "")}
                                >
                                    <div>
                                        {
                                          currentPage === page.name ? 
                                            <Image
                                                src="/images/kycwhite.png"
                                                alt={`${page.name} icon`}
                                                width={20}
                                                height={20}
                                            />
                                            :
                                            <Image
                                                src="/images/kycblue.png"
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
                </div>
            </div>
            <section className="fixed top-0 w-full z-30 backdrop-blur-xl bg-my-white/60">
            <div className="w-full flex justify-between items-center lg:py-4 py-2 px-3 max-w-7xl mx-auto relative md:hidden">
                <Link href="/" className="">
                    <Image
                        src="/images/memestructureslogo.png"
                        alt="Meme Structures Logo"
                        width={150}
                        height={40}
                    />
                </Link>
                <div onClick={toggleMenu} className="flex flex-col space-y-1 cursor-pointer lg:hidden items-end mr-5">
                    <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                    <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                    <div className="h-0.5 w-4 bg-my-deep-blue rounded-b-full"></div>
                </div>

                <div onClick={toggleMenu} className={`mt-3 mr-2 duration-500 top-full bg-my-white  absolute py-6 right-0 w-42 rounded-2xl flex flex-col border border-my-blue-white ${menuState ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    {navLinks.map((link) => {
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="py-2 px-6 hover:bg-my-blue-white/30 transition-all"
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
        </section>
    )
}

export default UserNav