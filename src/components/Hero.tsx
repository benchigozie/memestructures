
import Link from 'next/link'
import Button from './Button'
import HeroCards from './HeroCards'

function Hero() {

    return (
        <section className='bg-my-white'>
            <div className='max-w-6xl mx-auto px-4 pt-16'>
                <div className='flex flex-col justify-center gap-6 min-h-[80vh] max-w-4xl mx-auto text-center'>
                    <div className='flex items-center justify-center gap-3 px-4 py-2 border border-my-blue-white bg-my-blue-white/50 w-max mx-auto rounded-full'>
                        <div className='z-10 w-2.5 relative h-2.5 bg-my-blue rounded-full'>
                            <div className=' absolute z-0 w-2.5 h-2.5 bg-my-gray/60 rounded-full animate-pulse-ring'>
                            </div>
                        </div>
                        <p className='text-my-blue text-xs md:text-sm'>INSTITUTIONAL GRADE ASSET CLASSES</p>
                    </div>
                    <h1 className='text-5xl md:text-7xl font-bold text-my-deep-blue'>Invest  <span className='italic text-my-blue mr-1'>Smarter</span> In Alternative Asset Classes.</h1>
                    <p className='max-w-4xl text-lg' >MemeStructures provides sophisticated access to high-growth alternative asset classes, powered by professional risk management and on-chain intelligence.</p>
                    <div className='flex md:items-center flex-col md:flex-row justify-center gap-3 mt-5'>
                        <Link href="/register">
                            <Button buttonText="Invest Now" btnType="primary" className='w-full' />
                        </Link>
                        <Link href="/login">
                            <Button buttonText="login" btnType="secondary" className='shadow-sm w-full px-8' />
                        </Link>
                    </div>
                </div>
                <HeroCards />
            </div>
        </section>
    )
}

export default Hero