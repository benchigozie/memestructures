import { RefreshCw } from "lucide-react";
import { ArrowUpFromLine } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Button from "./Button";

type Card = {
    icon: LucideIcon,
    heading: string,
    text: string,
}



function YieldStrategy() {

    const cards: Card[] = [
        { icon: ArrowUpFromLine, heading: "The 1:3 Risk-Reward Mandate", text: "Our quant models only green-light positions where the validated upside is triple the maximum calculated drawdown. We don't bet; we structure." },
        { icon: RefreshCw, heading: "Narrative Rotation Engine", text: 'Alternative assets move in waves. Our rotation engine identifies fading narratives and shifts liquidity into emerging "zero-to-one" trends before retail entry.' },
    ]

    return (
        <section className='bg-my-white mt-18'>
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Sophisticated Yield Strategy</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mt-14'>
                    {
                        cards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    className='group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 hover:cursor-pointer shadow-2xl rounded-3xl p-10 transition-all duration-300 flex flex-col gap-6 justify-center'
                                    key={card.heading}
                                >
                                    <div className="group-hover:bg-my-blue p-4 rounded-3xl bg-my-blue-white/60 w-max transition-colors duration-300">
                                        <Icon size={30} className="text-my-blue group-hover:text-my-blue-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-lg md:text-xl text-my-deep-blue font-bold">{card.heading}</h3>
                                    <p>{card.text}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="p-8 md:p-12 lg:p-18 bg-my-blue rounded-4xl mt-14  md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-8 justify-center">
                        <div className="bg-my-white/30 px-5 py-1 rounded-full w-max">
                            <p className="text-white text-xs font-medium tracking-widest">ACTIVE FUND ANALYSIS</p>
                        </div>
                        <p className="text-my-white font-bold text-8xl tracking-tighter">DIF</p>
                        <p className="text-my-blue-white text-xl">The Diversified Investment Fund: Capture yield from the foundational investment protocols.</p>
                        <div className="flex flex-col md:flex-row gap-2">
                            <Button buttonText="View Dashboard" btnType="secondary" className="w-full md:w-max shadow-lg shadow-my-gray/20" bgColour="bg-my-white" colour="text-my-blue" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-3 md:gap-5">
                            <div className="bg-my-white/30 p-10 rounded-4xl gap-2 flex flex-col items-center justify-center text-my-white">
                                <p className="text-xs">LIVE RETURN</p>
                                <p className="font-bold text-3xl lg:text-5xl">+112%</p>
                            </div>
                            <div className="bg-my-white/30 p-10 rounded-4xl gap-2 flex flex-col items-center justify-center text-my-white">
                                <p className="text-xs">SHARPE RATIO</p>
                                <p className="font-bold text-3xl lg:text-5xl">3.4</p>
                            </div>
                            <div className="bg-my-white/30 p-10 col-span-2 rounded-4xl gap-2 flex flex-col items-center justify-center text-my-white">
                                <p className="text-xs">INVEST PERIOD</p>
                                <p className="font-bold text-2xl lg:text-3xl">Nov 2024 - 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default YieldStrategy