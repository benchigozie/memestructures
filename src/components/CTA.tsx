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
                    <h2 className="text-my-white text-3xl md:text-5xl font-bold max-w-xl">Secure your slot and start investing today.</h2>
                    <p className="text-xl max-w-3xl text-my-white/60">Join a community of sophisticated investors who invest with structure in alternative assets  and benefit from Professional management.</p>
                    <div className="mt-4 flex gap-2">
                        <Button buttonText="Join Community" btnType="primary"/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA