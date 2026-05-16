import Image from "next/image"
import { ChartPie, Landmark, Sprout, TrendingUp } from "lucide-react"

const page = () => {
    return (
        <div className="p-4 md:p-10">
            <section className="fex flex-col gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl text-my-deep-blue font-bold mb-1">Asset Class Offerings</h1>
                <p className="text-gray-600 text-[17px]">Curated Investment Vehicles designed for modern architectural portfolio. Select a fund category to explore detailed strategies, risk profiles, and historical perfomance metrics.</p>
            </section>
            <section className="fex flex-col gap-4 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-my-white rounded-lg shadow-md flex flex-col gap-6  shadow-mauve-200 p-6 md:p-8 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl  bg-purple-100 text-xs text-purple-800">
                                <Landmark width={20} height={20} color="#6e11b0" />
                            </div>
                            <div className="py-1 px-3 rounded-full  bg-purple-100 text-xs text-purple-800">AGGRESSIVE</div>
                        </div>
                        <h2 className="text-lg md:text-xl text-my-deep-blue font-medium mb-1">
                            Diversified Invesment Fund (DIF)
                        </h2>
                        <p className="text-my-gray/70">
                            DIF is a multi-asset investment vehicle designed to capture asymmetric upside while maintaining disciplined risk management through structures diversification
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MIN INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$35,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MAX INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$1,000,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">LOCK-UP PERIOD</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">12 Months</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">TARGET RETURN</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">50% ROI</span>
                            </div>
                        </div>
                        <button className="rounded-lg hover:bg-blue-100 hover:text-my-blue text-my-white text-sm font-medium py-3 text-center bg-my-blue transition-colors duration-300 cursor-pointer">
                            Invest Now
                        </button>
                    </div>
                    <div className="bg-my-white rounded-lg shadow-md flex flex-col gap-6  shadow-mauve-200 p-6 md:p-8 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl  bg-blue-100 text-xs text-my-blue">
                                <ChartPie width={20} height={20} />
                            </div>
                            <div className="py-1 px-3 rounded-full  bg-purple-100 text-xs text-purple-800">BALANCED</div>
                        </div>
                        <h2 className="text-lg md:text-xl text-my-deep-blue font-medium mb-1">
                            Diversified Invesment Asset Fund (DIAF)
                        </h2>
                        <p className="text-my-gray/70">
                            DIAF is an income-focused investment strategy designed to generate consistent cash flow while preserveing capital through diversified income-producing assets.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MIN INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$100,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MAX INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">Unlimited</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">LOCK-UP PERIOD</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">24 Months</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">TARGET RETURN</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">0.25% Weekly</span>
                            </div>
                        </div>
                        <button className="rounded-lg hover:bg-blue-100 hover:text-my-blue text-my-white text-sm font-medium py-3 text-center bg-my-blue transition-colors duration-300 cursor-pointer">
                            Invest Now
                        </button>
                    </div>
                    <div className="bg-my-white rounded-lg shadow-md flex flex-col gap-6  shadow-mauve-200 p-6 md:p-8 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl  bg-purple-100 text-xs text-purple-800">
                                <Sprout width={20} height={20} color="#6e11b0" />
                            </div>
                            <div className="py-1 px-3 rounded-full  bg-purple-100 text-xs text-purple-800">AGGRESSIVE</div>
                        </div>
                        <h2 className="text-lg md:text-xl text-my-deep-blue font-medium mb-1">
                            Equity And Digital Growth Fund (EDF)
                        </h2>
                        <p className="text-my-gray/70">
                            EDF is a growth-oriented multi-asset port-folio focused on long-term capital appreciation through diversified exposure to traditional and alternative assets.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MIN INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$65,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MAX INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$5,000,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">LOCK-UP PERIOD</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">18 Months</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">TARGET RETURN</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">50% ROI</span>
                            </div>
                        </div>
                        <button className="rounded-lg hover:bg-blue-100 hover:text-my-blue text-my-white text-sm font-medium py-3 text-center bg-my-blue transition-colors duration-300 cursor-pointer">
                            Invest Now
                        </button>
                    </div>
                    <div className="bg-my-white rounded-lg shadow-md flex flex-col gap-6  shadow-mauve-200 p-6 md:p-8 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl  bg-purple-100 text-xs text-purple-800">
                                <TrendingUp width={20} height={20} color="#6e11b0" />
                            </div>
                            <div className="py-1 px-3 rounded-full  bg-purple-100 text-xs text-purple-800">BALANCED</div>
                        </div>
                        <h2 className="text-lg md:text-xl text-my-deep-blue font-medium mb-1">
                            Emerging Markets Strategy Fund (EMSF)
                        </h2>
                        <p className="text-my-gray/70">
                            EMSF is a short-duration, alternative-focused investment strategy designed to capture high-growth opportunities accross real assets, agriculture and digital market
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MIN INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$5,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">MAX INVESTMEST</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">$30,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">LOCK-UP PERIOD</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">6 Months</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">TARGET RETURN</span>
                                <span className="font-medium md:text-[17px] text-my-deep-blue">15% ROI</span>
                            </div>
                        </div>
                        <button className="rounded-lg hover:bg-blue-100 hover:text-my-blue text-my-white text-sm font-medium py-3 text-center bg-my-blue transition-colors duration-300 cursor-pointer">
                            Invest Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page