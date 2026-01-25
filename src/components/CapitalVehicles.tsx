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
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Growth Alpha Fund</h3>
                                <div className="py-1 px-2 bg-red-100 rounded-md flex items-center">
                                    <p className="text-xs text-red-600">AGGRESSIVE</p>
                                </div>
                            </div>
                            <p>Systematic exposure to early-stage narratives and low-cap momentum leaders. Best for capital expansion.</p>
                            <div className="flex justify-between">
                                <p className="text-xs text-my-gray/70">TARGET: 40% ROI</p>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>Request</span><span>Prospectus</span></p>
                                    <Image src="/images/rightarrow.png" alt="" width={15} height={15} className="ml-3" />
                                </div>
                            </div>
                            <div className="w-2 h-full bg-red-400 absolute left-0"></div>
                        </div>
                        <div
                            className='overflow-clip group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-7 justify-center relative'
                        >
                            <div className="flex justify-between">
                                <h3 className="text-my-deep-blue text-xl md:text-2xl">Stability Basket</h3>
                                <div className="py-1 px-2 bg-green-100 rounded-md flex items-center">
                                    <p className="text-xs text-green-600">BALANCED</p>
                                </div>
                            </div>
                            <p>Curated selection of high-liquidity meme assets with established market-making support.</p>
                            <div className="flex justify-between">
                                <p className="text-xs text-my-gray/70">TARGET:  22% ROI</p>
                                <div className="py-1 px-2 flex justify-end items-end">
                                    <p className="text-my-blue flex flex-col lg:flex-row gap-1"><span>Request</span><span>Prospectus</span></p>
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