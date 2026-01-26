import Image from 'next/image'

type Card = {
    number: number;
    heading: string;
    text: string;
}

function OnboardingProcess() {

    const cards: Card[] = [
        { number: 1 , heading: "KYC & Sign Up", text: "Secure verification and institutional-grade wallet link." },
        { number: 2 , heading: "Strategy Review", text: "Consult our fund performance data and strategy whitepapers." },
        { number: 3 , heading: "Allocate Capital", text: "Deploy funds into your selected MemeStructures vehicle." },
        { number: 4 , heading: "Growth Tracking", text: "Real-time monitoring via your dedicated client portal." },
    ]

    return (
        <section className='bg-my-white mt-16 md:mt-24' >
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Onboarding Process</h2>
                <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            className='p-5 md:p-10 transition-all duration-300 flex flex-col gap-6 justify-center items-center text-center relative'
                        >
                            <div className="p-4 rounded-full bg-white shadow-md shadow-my-gray/20 w-max">
                               <p className='w-8 h-8 text-3xl text-my-blue font-semibold'>{card.number}</p>
                            </div>
                            <h3 className="mt-3 text-2xl text-my-deep-blue font-semibold">{card.heading}</h3>
                            <p>{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OnboardingProcess