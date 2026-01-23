
import Button from './Button'
import { ChartNoAxesColumn, TrendingUp } from 'lucide-react'
import ProgressBar from './ProgressBar'

function Hero() {
    return (
        <section className='bg-my-white'>
            <div className='max-w-6xl mx-auto px-4 pt-16'>
                <div className='flex flex-col justify-center gap-6 min-h-[80vh] max-w-4xl mx-auto text-center'>
                    <div className='flex items-center justify-center gap-3 px-4 py-2 border border-my-blue-white bg-my-blue-white/50 w-max mx-auto rounded-full'>
                        <div className='w-2.5 h-2.5 bg-my-blue rounded-full'></div>
                        <p className='text-my-blue text-xs md:text-sm'>INSTITUTIONAL GRADE MEME ASSET</p>
                    </div>
                    <h1 className='text-5xl md:text-7xl font-bold text-my-deep-blue'>Invest <span className='italic text-my-blue mr-1'>Smarter</span> in the Meme Economy.</h1>
                    <p className='max-w-4xl text-lg' >MemeStructures provides sophisticated access to high-growth memecoin funds, powered by professional risk management and on-chain intelligence.</p>
                    <div className='flex md:items-center flex-col md:flex-row justify-center gap-3 mt-5'>
                        <Button buttonText="Open Account" btnType="primary" className='w-full' />
                        <Button buttonText="View Performance" btnType="secondary" className='shadow-sm w-full' />
                    </div>
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-4 md:gap-7 gap-3 mt-16 text-center'>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl px-6 py-8'>
                        <p className='font-bold text-my-blue text-3xl md:text-5xl'>39%</p>
                        <p className='text-sm'>ROI DELIVERED</p>
                    </div>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl px-6 py-8'>
                        <p className='font-bold text-my-blue text-3xl md:text-5xl'>$1M+ </p>
                        <p className='text-sm'>TOTAL PROFIT</p>
                    </div>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl px-6 py-8'>
                        <p className='font-bold text-my-blue text-3xl md:text-5xl'>51.6%</p>
                        <p className='text-sm'>CAGR</p>
                    </div>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl px-6 py-8'>
                        <p className='font-bold text-my-blue text-3xl md:text-5xl'>$14.2M</p>
                        <p className='text-sm'>FUNDS UNDER MGMT</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-7'>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl p-10'>
                        <div className='w-max flex gap-3'>
                            <ChartNoAxesColumn size={17} className='text-my-blue' />
                            <p className='text-xs'>GROWTH ALPHA PERFORMANCE</p>
                        </div>
                        <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-5'>Alpha Generation</h2>
                        <div className='text-sm flex gap-16 text-center mt-24 justify-center'>
                            <div className='flex flex-col gap-5 pt-10'>
                                <p>30%</p>
                                <p>Projected <br />Annual ROI</p>
                            </div>
                            <div className='flex flex-col gap-10'>
                                <div className='py-1 px-3 bg-my-blue rounded-xl w-max'>
                                    <p className='text-my-white'>+39%</p>
                                </div>
                                <p className='text-my-blue'>Actual <br />Performance</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3 py-2 w-max pt-11'>
                            <div className='w-2.5 h-2.5 bg-my-blue rounded-full'></div>
                            <p className='text-my-deep-blue font-bold text-xs md:text-sm'>+9% Net Alpha vs. Projections</p>
                        </div>
                        <p className='text-xs'>*Verified on-chain performance comparing initial algorithmic projections against finalized fund outcomes for Q3-Q4 2024.</p>
                    </div>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl p-10 flex flex-col gap-8 justify-center'>
                        <div className='flex justify-between'>
                            <div className='w-max'>
                                <p className='text-xs'>RISK CONTROLS</p>
                                <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-3'>Volatility Damping</h2>
                            </div>
                            <div className='p-2 bg-my-blue-white/30 rounded-xl w-max h-max flex items-center justify-center'>
                                <TrendingUp className='text-my-blue' size={27} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='font-bold text-sm flex justify-between'>
                                <p>Benchmark Drawdown (Market)</p>
                                <p className='text-my-deep-blue'>15.0%</p>
                            </div>
                            <ProgressBar progress={75} colour="bg-my-gray/30" height='h-3' />
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='font-bold text-sm flex justify-between'>
                                <p className='font-bold text-sm text-my-deep-blue'>MemeStructures Optimized Drawdown</p>
                                <p className='text-my-blue'>8.2%</p>
                            </div>
                            <ProgressBar progress={75} colour="bg-my-blue" height='h-5' />
                        </div>
                        <p className='text-xs text-center'>Our proprietary rebalancing engine limits exposure during high-volatility tail events.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero