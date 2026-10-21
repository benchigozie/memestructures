import Link from "next/link"

function Team() {
    return (
        <section className='bg-my-white pt-16 md:pt-24' id="team" >
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Meet The Team</h2>
                <div className="mt-10 flex flex-col gap-4 md:gap-7">
                    <div className="bg-my-white rounded-3xl shadow-md p-7 md:p-16 shadow-my-gray/10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        <div className="h-62 w-62 bg-my-gray/10 rounded-full shrink-0"></div>
                        <div>
                            <h3 className="mt-6 text-3xl text-my-deep-blue font-semibold">Weyinmi Akwara</h3>
                            <p className="mt-2 text-lg font-medium">Co-Founder & Chief Executive Officer at MemeStructures Ltd.</p>
                            <p className="mt-4">Weyinmi Akwara is the Co-founder and CEO of MemeStructures. With a background in asset management, stock picking, and corporate leadership, he brings analytical expertise and strategic vision to the team.</p>
                            <Link href="/team/weyinmi-akwara">
                                <button className="mt-6 hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors dutation-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl">See More</button>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-my-white rounded-3xl shadow-md p-7 md:p-16 shadow-my-gray/10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        <div className="h-62 w-62 bg-my-gray/10 rounded-full shrink-0"></div>
                        <div>
                            <h3 className="mt-6 text-3xl text-my-deep-blue font-semibold">Oghenetejiri Ohwode</h3>
                            <p className="mt-2 text-lg font-medium">Co-Founder and Managing Director · Cape Town, South Africa</p>
                            <p className="mt-4">A builder across logistics and real estate, Oghenetejiri brings an operator’s discipline to the financial governance, reporting, and stewardship of pooled capital.</p>
                            <Link href="/team/oghenetejiri-ohwode">
                                <button className="mt-6 mx-auto hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors dutation-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl">See More</button>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-my-white rounded-3xl shadow-md p-7 md:p-16 shadow-my-gray/10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        <div className="h-62 w-62 bg-my-gray/10 rounded-full shrink-0"></div>
                        <div>
                            <h3 className="mt-6 text-3xl text-my-deep-blue font-semibold">Chukwuka Chibuike</h3>
                            <p className="mt-2 text-lg font-medium">Chief Investment Officer · Lagos, Nigeria</p>
                            <p className="mt-4">Grounded in Lagos real estate, Chukuka brings a dealmaker’s scrutiny to sourcing investment opportunities and an owner’s commitment to seeing each one through to results.</p>
                            <Link href="/team/chukwuka-chibuike">
                                <button className="mt-6 mx-auto hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors dutation-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl">See More</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Team