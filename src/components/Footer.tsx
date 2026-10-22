import Image from 'next/image';
import Link from 'next/link';

function Footer() {
    return (
        <footer className="bg-my-white pt-16 md:pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 border-t border-b border-my-gray/15 py-12 md:py-20">
                    
                    {/* Brand Info Column */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div>
                            <div className="w-52 sm:w-64">
                                <Image
                                    src="/images/memestructureslogo.png"
                                    alt="Meme Structures Logo"
                                    width={300}
                                    height={50}
                                    className="w-auto h-auto object-contain"
                                    priority
                                />
                            </div>
                            <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed opacity-90">
                                Transforming speculative energy into structured wealth. We apply private equity discipline to the most dynamic asset class in history.
                            </p>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-12">
                        {/* Navigation Links */}
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider mb-4">
                                Links
                            </h5>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <Link href="/" className="hover:text-my-blue transition-colors duration-200">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-my-blue transition-colors duration-200">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about#team" className="hover:text-my-blue transition-colors duration-200">
                                        Team
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="hover:text-my-blue transition-colors duration-200">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social / Contact Links */}
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider mb-4">
                                Contact
                            </h5>
                            <ul className="space-y-2.5 text-sm">
                                <li>
                                    <a 
                                        href="https://x.com/memestructures" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        X (Twitter)
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://t.me/memestructures" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        Telegram
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://discord.com/channels/@me/1402087469561938133" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        Discord
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://www.linkedin.com/company/memestructures/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://instagram.com/memestructures" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://facebook.com/memestructures" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-my-blue transition-colors duration-200"
                                    >
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 py-8 gap-4">
                    <p className="text-center sm:text-left">
                        &copy; 2024–2026 MemeStructures. All rights reserved.
                    </p>
                    <p className="text-center sm:text-right opacity-80">
                        Institutional Asset Management Frameworks
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;