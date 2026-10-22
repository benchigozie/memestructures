import Image from "next/image"
import Button from "./Button"

function CTA() {
    return (
        <section className='bg-my-white py-12 md:py-20'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6'>
                <div className="relative overflow-hidden bg-my-deep-blue rounded-3xl sm:rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col items-center gap-6 md:gap-8 text-center shadow-2xl shadow-my-deep-blue/20">
                    
                    {/* Decorative subtle background glow (pure CSS) */}
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-my-blue/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-my-blue/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Logo Wrapper */}
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

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h2 className="text-my-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Secure your slot and start investing today.
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-my-white/70 max-w-2xl mx-auto leading-relaxed">
                            Join a community of sophisticated investors who invest with structure in alternative assets and benefit from professional management.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="relative z-10 pt-2 flex items-center justify-center">
                        <Button buttonText="Join Community" btnType="primary" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA