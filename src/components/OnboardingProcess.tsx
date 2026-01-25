import Image from 'next/image'

type Card = {
    icon: string;
    heading: string;
    text: string;
}

function OnboardingProcess() {

    const cards: Card[] = [
        { icon: '/images/searchicon.png', heading: "Yield Seeking", text: "You want high-convexity returns without managing thousands of daily on-chain alerts." },
        { icon: "/images/structure.png", heading: "Structure First", text: "You appreciate the alpha in memes but require the rigor of institutional fund structures." },
        { icon: "/images/shield.png", heading: "Risk Intelligent", text: "You understand that in the meme economy, drawdown protection is the true source of profit." },
    ]

    return (
        <section className='bg-my-white mt-16 md:mt-24' >
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className='text-3xl md:text-5xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Onboarding Process</h2>
                <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {cards.map((card) => (
                        <div
                            className='p-5 md:p-10 transition-all duration-300 flex flex-col gap-6 justify-center items-center text-center relative'
                        >
                            <div className="p-4 rounded-full bg-white shadow-md shadow-my-gray/20 w-max">
                                <Image src={card.icon} alt="" width={40} height={40} />
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