import Image from 'next/image'

function Footer() {
    return (
        <section className='bg-my-white mt-16 md:mt-24' >
            <div className='max-w-7xl mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-28 border-t border-b border-my-gray/15 md:px-3 py-10 md:py-20'>
                    <div className="flex flex-col">
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={300}
                            height={50}
                        />
                        <p className='max-w-lg text-[15px]'>Transforming speculative energy into structured wealth. We apply private equity discipline to the most dynamic asset class in history.</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                            <h5 className='font-semibold'>PLATFORM</h5>
                            <ul className='mt-3 space-y-1'>
                                <li>Performance</li>
                                <li>Audit Report</li>
                                <li>Risk Engine</li>
                                <li>Client Portal</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className='font-semibold'>CONTACT</h5>
                            <ul className='mt-3 space-y-1'>
                                <li>Twitter</li>
                                <li>Discord</li>
                                <li>Email Support</li>
                                <li>Whitepaper</li>
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