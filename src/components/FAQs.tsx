"use client"

import { X } from 'lucide-react'
import { useState } from 'react'
import { CircleMinus } from 'lucide-react'

type Card = {
    question: string,
    answer: string,
}

const cards: Card[] = [
    { question: "Why is MemeStructures needed?", answer: "MemeStructures bridges the gap between innovative Memecoin projects and investors are searching for high-potential investment opportunities. MemeStructures offers the opportunity to invest in different asset classes of Memecoin, which consists of projects from different developers, providing exposure to a wide array of investment possibilities in the fast-evolving cryptocosm." },
    { question: "Does it cost anything to become a member?", answer: 'Becoming a member requires investing in one of the broad asset class categories offered by MemeStructures.' },
    { question: 'Does Memestructures recommend investments?', answer: 'All investment asset class decisions are made solely at the discretion of the investors and MemeStructures does not provide exclusive recommendations to investors on which asset class to choose.' },
    { question: 'Who should invest in the asset class categories?', answer: 'The Asset class categories on MemeStructures are best suited for conservative investors and aggressive investors.' },
    { question: 'Why is there a minimum investment amount', answer: "The minimum investment is set to ensure that only committed investors participate in our Asset class which will help maintain a focused investor base, which is critical for the success of each developer's project." },
    { question: 'What risks are associated with memecoin investments', answer: 'Investing in Memecoins can be highly speculative and involves substantial risks but with MemeStructures, fixed potential returns are assured on each asset class category due to our in-depth analytical understanding of the Cryptocosm.' },
]

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className='bg-my-white mt-18'>
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>FAQs</h2>
                <div className='grid grid-cols-1 gap-2 md:gap-3 mt-14'>
                    {
                        cards.map((card, i) => {
                            return (
                                <div
                                    className='group bg-my-white shadow-my-gray/10 hover:shadow-my-gray/30 cursor-pointer shadow-2xl rounded-3xl px-10 p-6 transition-all duration-300 flex flex-col justify-center'
                                    key={card.question}
                                    onClick={() => toggle(i)}
                                >
                                    <div className='flex justify-between'>
                                        <h3 className="text-lg md:text-xl text-my-deep-blue font-bold">{card.question}</h3>
                                        <div className={`rounded-full flex items-center justify-center transition-all duration-300 ${ openIndex === i ? 'rotate-90': ''}`}>
                                            <CircleMinus size={25} />
                                        </div>
                                    </div>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openIndex === i
                                            ? "grid-rows-[1fr] opacity-100 mt-4"
                                            : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-lg font-light">
                                                {card.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FAQs