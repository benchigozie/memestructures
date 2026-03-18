import Image from "next/image"

function CapitalVehicles() {
    return (
        <section className='bg-my-white mt-16 md:mt-24' >
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Capital Deployment Vehicles</h2>
                <div className='mt-14'>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div
                            className='overflow-clip group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-7 justify-center relative'
                        >
                            <div className="flex justify-between">
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Diversified Investment Fund</h3>
                                <div className="py-1 px-2 bg-red-100 rounded-md flex items-center h-max">
                                    <p className="text-xs text-red-600">AGGRESSIVE</p>
                                </div>
                            </div>
                            <p>DIF is a multi-asset investment vehicle designed to capture asymmetric upside while maintaining disciplined risk management through structured diversification.</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-my-gray/75">Minimum Investment: $35,000</p>
                                    <p className="text-sm text-my-gray/75">Maximum Investment: $1,000,000</p>
                                    <p className="text-sm text-my-gray/75">Lock-Up Period: 12 Months</p>
                                    <p className="text-sm text-my-gray/75">Target Return: 50% ROI per cycle</p>
                                </div>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>See</span><span>More</span></p>
                                    <Image src="/images/rightarrow.png" alt="" width={15} height={15} className="ml-3" />
                                </div>
                            </div>
                            <div className="w-2 h-full bg-red-400 absolute left-0"></div>
                        </div>
                        <div
                            className='overflow-clip group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-7 justify-center relative'
                        >
                            <div className="flex justify-between">
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Diversified Income Asset Fund</h3>
                                <div className="py-1 px-2 bg-green-100 rounded-md flex items-center h-max">
                                    <p className="text-xs text-green-600">BALANCED</p>
                                </div>
                            </div>
                            <p>DIAF is an income-focused investment strategy designed to generate consistent cash flow while preserving capital through diversified, income-producing assets.</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-my-gray/75">Minimum Investment: $100,000</p>
                                    <p className="text-sm text-my-gray/75">Maximum Investment: Open / Unlimited</p>
                                    <p className="text-sm text-my-gray/75">Lock-Up Period: 24 Months</p>
                                    <p className="text-sm text-my-gray/75">Target Return: 0.25% Weekly Passive Income</p>
                                </div>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>See</span><span>More</span></p>
                                    <Image src="/images/rightarrow.png" alt="" width={15} height={15} className="ml-3" />
                                </div>
                            </div>
                            <div className="w-2 h-full bg-green-400 absolute left-0"></div>
                        </div>
                        <div
                            className='overflow-clip group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-7 justify-center relative'
                        >
                            <div className="flex justify-between">
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Equity & Digital Growth Fund</h3>
                                <div className="py-1 px-2 bg-red-100 rounded-md flex items-center h-max">
                                    <p className="text-xs text-red-600">AGGRESSIVE</p>
                                </div>
                            </div>
                            <p>EDF is a growth-oriented multi-asset portfolio focused on long-term capital appreciation through diversified exposure to traditional and alternative assets.</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-my-gray/75">Minimum Investment: $65,000</p>
                                    <p className="text-sm text-my-gray/75">Maximum Investment: $5,000,000</p>
                                    <p className="text-sm text-my-gray/75">Lock-Up Period: 18 Months</p>
                                    <p className="text-sm text-my-gray/75">Target Return: 50% ROI per cycle</p>
                                </div>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>See</span><span>More</span></p>
                                    <Image src="/images/rightarrow.png" alt="" width={15} height={15} className="ml-3" />
                                </div>
                            </div>
                            <div className="w-2 h-full bg-red-400 absolute left-0"></div>
                        </div>
                        <div
                            className='overflow-clip group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-7 justify-center relative'
                        >
                            <div className="flex justify-between">
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Emerging Markets Strategy Fund</h3>
                                <div className="py-1 px-2 bg-green-100 rounded-md flex items-center h-max">
                                    <p className="text-xs text-green-600">BALANCED</p>
                                </div>
                            </div>
                            <p>EMSF is a short-duration, alternative-focused investment strategy designed to capture high-growth opportunities across real assets, agriculture, and digital markets.</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-my-gray/75">Minimum Investment: $5,000</p>
                                    <p className="text-sm text-my-gray/75">Maximum Investment: $30,000</p>
                                    <p className="text-sm text-my-gray/75">Lock-Up Period: 6 Months</p>
                                    <p className="text-sm text-my-gray/75">Target Return: 15% ROI per cycle</p>
                                </div>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>See</span><span>More</span></p>
                                    <Image src="/images/rightarrow.png" alt="" width={15} height={15} className="ml-3" />
                                </div>
                            </div>
                            <div className="w-2 h-full bg-green-400 absolute left-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CapitalVehicles