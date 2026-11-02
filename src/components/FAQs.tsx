"use client"

import { X } from 'lucide-react'
import { useState } from 'react'
import { CircleMinus } from 'lucide-react'

type Card = {
    question: string,
    answer: string,
}

const cards: Card[] = [
    { question: "Why is MemeStructures needed?", answer: "MemeStructures bridges the gap between Alternative investment assets and investors searching for high-potential investment opportunities. MemeStructures offers the opportunity to invest in different alternative asset classes, which consists of projects from different sectors, providing exposure to a wide array of investment possibilities in the fast-evolving financial landscape." },
    { question: "Does it cost anything to become a member?", answer: "MemeStructures does not operate an open membership programme. Access to our funds is available exclusively to members and investors of United Wealth Alliance (UWA). To participate in a MemeStructures fund, you must first be an active member of UWA in good standing, or an approved investor introduced through the Alliance. UWA membership carries its own obligations and governance requirements, which are set independently by the Alliance. Once eligible through UWA, participation in a MemeStructures fund is subject to the specific fund's minimum commitment, subscription terms, and lock-up conditions as set out in the fund documentation." },
    { question: 'Does Memestructures recommend investments?', answer: "MemeStructures does not recommend investments to members or the public. All investment decisions for the funds we manage are made by the Board of United Wealth Alliance, applying the Alliance's own governance framework and methodology. MemeStructures's role is to structure, administer, and report on the fund vehicles that hold those investments." },
    { question: 'Who should invest in the asset class categories?', answer: "Investment in MemeStructures asset class categories is open to United Wealth Alliance members in good standing who meet the eligibility requirements set out by UWA for the relevant fund. Each fund carries its own subscription conditions, minimum commitment, lock-up period, and risk profile. Members must satisfy both UWA's standing requirements and the specific fund's terms before participating." },
    { question: 'Is there a minimum investment amount?', answer: "Yes. Each MemeStructures fund carries a minimum investment amount, which is determined by the UWA Board. Minimums vary by fund, reflecting the strategy, risk profile, and structure of the specific vehicle and are set out in the subscription documents for each fund." },
    { question: 'What risks are associated with MemeStructures', answer: "Investing through any MemeStructures fund involves risk and MemeStructures manages these risks through disciplined governance, transparent reporting, independent audits, and the UWA Board's own risk oversight framework." },
]

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className='bg-my-white mt-18'>
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-4xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>FAQs</h2>
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