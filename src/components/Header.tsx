"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

type NavLink = {
    name: string
    path: string
}

function Header() {

    const pathname = usePathname();

    const [menuState, setMenuState] = useState<boolean>(false);

    const toggleMenu = () => {
        setMenuState(!menuState);
    }

    const navLinks: NavLink[] = [
        { name: "Home", path: "/" },
        { name: "Invest", path: "/invest" },
        { name: "About Us", path: "/about" },
        { name: "Team", path: "/services" },
        { name: "Blog", path: "/blog" },
    ]

    return (
        <section className="fixed top-0 w-full z-30 backdrop-blur-xl bg-my-white/60">
            <div className="w-full flex justify-between items-center lg:py-4 py-3 px-3 max-w-7xl mx-auto relative">
                <Link href="/" className="">
                    <Image
                        src="/images/memestructureslogo.png"
                        alt="Meme Structures Logo"
                        width={200}
                        height={50}
                    />
                </Link>
                <div className="max-w-100 w-full lg:flex justify-between hidden">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.path;

                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                    ? "border border-my-gray/40" : ""
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="lg:flex hidden">
                    <button className="px-5 py-3 bg-my-blue-white text-my-blue rounded-full font-semibold transition-colors duration-300 hover:cursor-pointer">
                        Client Login
                    </button>
                </div>
                <div onClick={toggleMenu} className="flex flex-col space-y-1 cursor-pointer lg:hidden items-end mr-5">
                    <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                    <div className="h-0.5 w-6 bg-my-deep-blue rounded-b-full"></div>
                    <div className="h-0.5 w-4 bg-my-deep-blue rounded-b-full"></div>
                </div>

                <div onClick={toggleMenu} className={`mt-3 mr-2 duration-500 top-full bg-my-white/60 backdrop-blur-3xl  absolute py-6 right-0 w-42 rounded-2xl flex flex-col border border-my-blue-white ${menuState ? "opacity-100 visible" : "opacity-0 invisible"} lg:hidden`}>
                    {navLinks.map((link) => {
                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="py-2 px-6 hover:bg-my-blue-white/30 transition-all"
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default Header