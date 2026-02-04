import { ChartNoAxesColumn, TrendingUp } from 'lucide-react'
import ProgressBar from './ProgressBar'
import Image from 'next/image'

function Results() {
    return (
        <section className='bg-my-white'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-7'>
                    <div className='bg-my-white shadow-my-gray/20 shadow-2xl rounded-3xl p-10'>
                        <div className='w-max flex gap-3'>
                            <ChartNoAxesColumn size={17} className='text-my-blue' />
                            <p className='text-xs'>ASSET CLASS PERFORMANCE</p>
                        </div>
                        <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-5'>Performance Snapshot</h2>
                        <div className='text-sm flex gap-16 text-center justify-center mt-10'>
                           <Image src="/images/memechart.png" alt='' width={600} height={600} className='h-80 object-cover rounded-3xl overflow-clip'/>
                        </div>
                        <div className='flex items-center gap-3 py-2 w-max pt-11'>
                            <div className='z-10 w-2.5 relative h-2.5 bg-my-blue rounded-full'>
                                <div className=' absolute z-0 w-2.5 h-2.5 bg-my-gray/60 rounded-full animate-pulse-ring'>
                                </div>
                            </div>
                            <p className='text-my-deep-blue font-bold text-xs md:text-sm'>Outperformed Projections by +9%</p>
                        </div>
                        <p className='text-xs'>*Verified on-chain. Executed with structure, not speculation.</p>
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

export default Results