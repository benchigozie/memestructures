type Card = {
    value: string
    label: string
}

function HeroCards() {

    const cards: Card[] = [
        { value: "39%", label: "ROI DELIVERED" },
        { value: "$1M+", label: "TOTAL PROFIT" },
        { value: "51.6%", label: "CAGR" },
        { value: "$14.2M", label: "FUNDS UNDER MGMT" },
    ]

    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 md:gap-7 gap-3 mt-16 text-center'>
            {
                cards.map((card) => (
                    <div
                        className='group bg-my-white shadow-my-gray/20 hover:shadow-my-gray/10 hover:cursor-pointer hover:-translate-y-3 shadow-2xl rounded-3xl px-6 py-8 transition-all duration-300'
                        key={card.label}
                    >
                        <p
                            className="font-bold text-my-blue text-3xl md:text-5xl group-hover:scale-110 transition-transform duration-300"
                        >{card.value}</p>
                        <p className='text-sm'>{card.label}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default HeroCards