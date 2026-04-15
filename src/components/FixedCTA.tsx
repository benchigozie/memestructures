import Image from "next/image"
import Link from "next/link"

function FixedCTA() {
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 pb-5 z-30 w-full">
            <div
                className='overflow-clip group bg-my-white shadow-md hover:shadow-my-gray/20 rounded-full p-3 md:p4 transition-all duration-300 flex justify-between gap-4 md:gap-14 max-w-2xl mx-2 md:mx-auto'
            >
                <div className="flex gap-2 justify-center items-center text-center relative">
                    <div className='z-10 w-2.5 relative h-2.5 bg-green-600 rounded-full'>
                        <div className='absolute -z-10 w-2.5 h-2.5 bg-my-gray/60 rounded-full animate-pulse-ring'>
                        </div>
                    </div>
                    <p className="text-xs md:text-sm">LIVE FUND ACTIVITY</p>
                </div>
                <div className="flex-col hidden md:flex">
                    <p className="text-xs">CURRENT GROWTH</p>
                    <p className="text-xl text-my-blue">+39.4% YTD</p>
                </div>
                <Link href="/register">
                    <button className="bg-my-blue cursor-pointer text-sm text-my-white font-semibold px-4 md:px-6 py-2.5 md:py-4 rounded-full shadow-lg hover:shadow-my-blue/40 transition-shadow duration-300 flex gap-2">

                        <p>Invest Now</p>
                        <Image src="/images/bluewhitearrow.png" alt="" width={16} height={16} className="inline-block self-end" />
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default FixedCTA