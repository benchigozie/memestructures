import Image from 'next/image'
import React from 'react'

function page() {
    return (
        <section className='bg-my-white px-6' >
            <div className="flex flex-col gap-4 max-w-5xl mx-auto mt-16 md:mt-24 rounded-3xl p-4 md:p-12 shadow-lg shadow-my-gray/20">
                <div className="flex flex-col items-center">
                    <div className='w-62 h-62 rounded-full bg-my-gray' />
                    <h1 className="text-my-deep-blue text-2xl md:text-4xl font-bold mt-8">Weyinmi Akwara</h1>
                    <p className='md:text-lg border-b border-my-gray/20 w-full text-center pb-6'>Co-Founder & Chief Executive Officer at MemeStructures Ltd.</p>
                    <p className='text-my-deep-blue mt-8 text-lg text-center'>"Most people think great investors are born with a silver spoon. I wasn’t. In the same way, most investors start with charts. I started with a library shelf."</p>
                    <div className='flex flex-col gap-4 mt-8'>
                        <p>
                            Weyinmi Akwara is the Co-founder and Chief Executive Officer of MemeStructures.
                            Prior to MemeStructures, Weyinmi sat at the board for 4 consecutive years as an Executive Director/Chairman
                            of a family-owned sand dredging company. Weyinmi grew up in Warri, Nigeria, in a family of eight — a father
                            with a sharp business instinct, and a mother who believed deeply in education. That mix shaped who I am today.
                        </p>
                        <p>
                            In high school, I wasn’t the top student. But I was curious — always looking for opportunities.
                            I started small — I flipped cell phones as a middleman. Got into trouble a few times, sure. But I learned two priceless lessons early:
                        </p>
                        <ul className='list-disc list-inside marker:text-my-deep-blue'>
                            <li>How to spot value</li>
                            <li>How to take calculated risks</li>
                        </ul>
                        <p>
                            Some of those profits went into my dad’s small propeller business, which later became a sand dredging company. When I saw real returns from that investment, it hit me:
                            “Money works harder when you give it direction.” My mother, being the head of the library, kept me close to the library.
                            One afternoon, I stumbled upon “As a Man Thinketh” by James Allen — and that book completely rewired my mind and changed how I thought about life, work, and wealth.
                            It taught me that success begins in thought before it becomes reality.
                            That mindset carried me to Cyprus, where I partly studied Computer Science and Mathematics, and later, into a short stint in Business School, where my obsession with finance took over.
                            I began my asset management career through active private stock picking across sectors and built a portfolio with decent returns due to my zeal to analyze numbers, company structures, balance sheets, and annual reports.
                            Before heading to Cyprus, I was deep into the stock market — studying value investing, and made my first win with Okomu Oil on the Nigerian Stock Exchange.
                            It wasn’t <span className='font-semibold'>"luck"</span>. It was structured.
                            That trade changed everything. It gave me the confidence to start helping friends and family invest. That’s when I realized:
                            <span className='font-semibold'>“Finance isn’t about numbers — it’s about empowerment.”</span>
                        </p>
                        <p>
                            From a library shelf to global markets, the lesson stays the same:
                            Success starts with structure.
                            In 2024, I met Mr. Precious Ohwode, and together we turned that idea into a company — <span className='font-semibold'>MemeStructures</span>.
                            Our mission? To bring structure, discipline, and education into the chaotic world of cryptocurrency investing.
                            But I wasn’t done learning. My curiosity led me into cryptocurrency.
                            Like many, I started with Altcoins… then got burned by Memecoins. I made money, lost money, and learnt fast.
                            But those losses became my best teachers.
                            Instead of quitting (as I always remember my dad’s words — “Quitters never win and Winners never Quit”), after years of trial and error, I built something that worked — a new system.
                            A disciplined, structured approach I called <span className='font-semibold'>The Basket Strategy</span> — trading multiple Memecoins at once while risking only 10% of my capital.
                            If even 4 out of 10 succeeded, I stayed profitable.
                            That changed everything.
                        </p>
                        <p>
                            Today, MemeStructures helps investors reduce risk, diversify intelligently, and gain consistent returns through our proven basket strategy.
                            And it all started… in a small library in Warri, with a young boy reading As a Man Thinketh.
                            Weyinmi also serves on the board as the current Chairman of United Wealth Alliance, an organization that builds morals unto liberty through capitalism and personal development.
                            The right structure can turn volatility into opportunity. Whether in crypto, business, or life — strategy always beats emotion.
                            A native of Delta State, Nigeria, Weyinmi embraces a school of thought that believes self-education is the power behind all education. He currently holds a degree in demonstrating his thoughts through leadership.
                            If you’re passionate about turning chaos into clarity in your investment journey, let’s connect.
                        </p>
                    </div>
                    <div>
                        <a href="mailto:weyinmi.akwara@memestructures.com?subject=Hello%20Weyinmi&body=I%20saw%20your%20profile%20and%20want%20to%20connect."  className="mt-10 inline-block text-my-deep-blue border border-my-deep-blue px-3 duration-300 md:px-5 py-2 md:py-3 rounded-2xl hover:bg-my-deep-blue hover:text-my-white transition-colors">
                            Lets Connect
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page