import Image from "next/image"

function BlogHero() {
  return (
    <div className="relative mt-18 md:mt-18.5 h-48 md:h-64 bg-amber-600">
        <div className="w-full h-full overflow-hidden absolute top-0 left-0">
            <Image className="w-full h-full object-cover" src="/images/bloghero.webp" alt="" width={1200} height={400} />
        </div>
        <div className="w-full bg-black/60 h-full overflow-hidden absolute top-0 left-0"></div>
        <div className="overflow-hidden absolute top-8 md:top-15 left-12 md:left-20">
            <h1 className="text-5xl md:text-8xl font-bold text-my-white">BLOG</h1>
        </div>
    </div>
  )
}

export default BlogHero