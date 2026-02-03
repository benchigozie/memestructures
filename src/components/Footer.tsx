import Image from 'next/image'
import Link from 'next/link'

function Footer() {
    return (
        <section className='bg-my-white mt-16 md:mt-24' >
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-28 border-t border-b border-my-gray/15 md:px-3 py-10 md:py-20'>
                    <div className="flex flex-col">
                        <div className='w-60 md:w-76'>
                            <Image
                                src="/images/memestructureslogo.png"
                                alt="Meme Structures Logo"
                                width={300}
                                height={50}
                            />
                        </div>
                        <p className='max-w-lg text-[15px]'>Transforming speculative energy into structured wealth. We apply private equity discipline to the most dynamic asset class in history.</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                            <h5 className='font-semibold'>LINKS</h5>
                            <ul className='mt-3 space-y-1'>
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <Link href="/about">About Us</Link>
                                </li>
                                <li>
                                    <Link href="/about#team">Team</Link>
                                </li>
                                <li>
                                    <Link href="/blog">Blog</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className='font-semibold'>CONTACT</h5>
                            <ul className='mt-3 space-y-1'>
                                <li>
                                    <a href="https://facebook.com/memestructures">Facebook</a>
                                </li>
                                <li>
                                    <a href="https://instagram.com/memestructures">Instagram</a>
                                </li>
                                <li>
                                    <a href="https://discord.com/channels/@me/1402087469561938133">Discord</a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/company/memestructures/">Linkedin</a>
                                </li>
                                <li>
                                    <a href="https://t.me/memestructures">Telegram</a>
                                </li>
                                <li>
                                    <a href=" https://x.com/memestructures">X</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='text-center text-sm text-my-gray/70 py-6'>
                    &copy;  2024–2026 MemeStructures. All rights reserved.
                </div>
            </div>
        </section>
    )
}

export default Footer