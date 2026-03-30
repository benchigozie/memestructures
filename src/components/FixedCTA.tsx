import Image from "next/image"
import Link from "next/link"

function FixedCTA() {
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 pb-5 z-30 w-full">
            <div
                className='overflow-clip group bg-my-white shadow-md hover:shadow-my-gray/20 rounded-full px-6 py-3  transition-all duration-300 flex justify-between gap-4 md:gap-14 max-w-2xl mx-auto'
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
                <button className="bg-my-blue text-sm text-my-white font-semibold px-6 py-4 rounded-full shadow-lg hover:shadow-my-gray/30 transition-shadow duration-300 flex gap-2">
                    <Link href="/register">
                        <p>Invest Now</p>
                        <Image src="/images/bluewhitearrow.png" alt="" width={16} height={16} className="inline-block self-end" />
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default FixedCTA