import Image from "next/image"
import Button from "./Button"



function CTA() {
    return (
        <section className='bg-my-white mt-18'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className="p-6 md:p-12 lg:p-18 bg-my-deep-blue rounded-4xl mt-14  md:mt-28 flex flex-col items-center gap-10 text-center">
                    <div>
                        <Image
                            src="/images/memestructureslogo.png"
                            alt="Meme Structures Logo"
                            width={300}
                            height={50}
                        />
                    </div>
                    <h2 className="text-my-white text-3xl md:text-5xl font-bold max-w-xl">Secure your seat in the meme economy.</h2>
                    <p className="text-xl max-w-3xl text-my-white/60">Join a community of sophisticated investors who treat memecoins as a structured asset class. Professional management. Quant precision.</p>
                    <div className="mt-4 flex gap-2">
                        <Button buttonText="Get Started" btnType="primary"/>
                        <Button buttonText="Download Strategy" btnType="secondary" bgColour="bg-my-white/10" colour="text-my-white"/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA