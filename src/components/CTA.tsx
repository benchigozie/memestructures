import Image from "next/image"
import Button from "./Button"
import Link from "next/link"

function CTA() {
    return (
        <section className='bg-my-white py-12 md:py-20'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6'>
                <div className="relative overflow-hidden bg-my-deep-blue rounded-3xl sm:rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col items-center gap-6 md:gap-8 text-center shadow-2xl shadow-my-deep-blue/20">
   
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-my-blue/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-my-blue/15 rounded-full blur-3xl pointer-events-none" />


                    <div className="relative z-10 w-48 sm:w-60 md:w-64">
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={300}
                            height={50}
                            className="w-auto h-auto object-contain"
                            priority
                        />
                    </div>

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h2 className="text-my-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Invest With Patience, Manage With Discipline
                        </h2>
                        <p className="text-base md:text-xl text-my-white/70 max-w-2xl mx-auto leading-relaxed">
                            MemeStructures exists to bring structure to long-term capital allocation
                        </p>
                        <p className="text-base text-my-white/70 max-w-2xl mx-auto leading-relaxed">
                           Through disciplined research, selective deployment and aligned incentives, we manage member capital with a focus on long-term opportunity.
                        </p>
                    </div>


                    <div className="relative z-10 pt-2 flex items-center justify-center">
                    <Link href="/login">
                        <Button buttonText="Member Login" btnType="primary" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA