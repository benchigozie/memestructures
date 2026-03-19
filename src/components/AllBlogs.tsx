import { sanityClient } from "@/lib/sanityClient";
import { urlFor } from "@/lib/sanityImage";
import Link from "next/link";
import Image from "next/image";



const latestPostsQuery = `
    *[_type == "post" && publishedAt <= now()]
  | order(publishedAt desc)[$start...$end] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    description,
    mainImage,
  }
`;

type Post = {
    _id: string;
    title: string;
    slug: string;
    publishedAt: string;
    description: string;
    mainImage: any;
};

async function AllBlogs({ searchParams }: { searchParams: Promise<{ page?: string }> }) {

    const params = await searchParams;

    const numberOfPosts = 24;
    const page = Math.max(1, Number(params.page) || 1);
    const start = (page - 1) * numberOfPosts;
    const end = start + numberOfPosts + 1;

    const [latestPosts] = await Promise.all([
        sanityClient.fetch(latestPostsQuery, { start, end }, {
            next: {
                //tags: ["posts"],
                revalidate: 60
            }
        }),
    ]);
    const trimmedLatestPosts: Post[] = latestPosts.slice(0, numberOfPosts);



    return (
        <section className='bg-my-white pt-17 md:pt-24' >
            <div className='max-w-6xl mx-auto px-6'>
                <h1 className='text-4xl md:text-6xl text-my-deep-blue font-bold mt-5 text-center'>All Blogs</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-20">
                    {trimmedLatestPosts.map((post: Post) =>
                    (
                        <div className="flex flex-col gap-4" key={post._id}>
                            <div className="bg-my-deep-blue h-max rounded-2xl">
                                <Image src={urlFor(post.mainImage).width(600).height(400).url()} alt="Blog placeholder" width={300} height={200} className="rounded-2xl w-full object-cover" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl text-my-deep-blue">{post.title}</h3>
                                <p>{post.description}</p>
                                <p>
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <Link href={`/blog/${post.slug}`}>
                                    <button className="mt-3 hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors duration-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl w-max">Read More</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center gap-4 mt-16">

  {page > 1 && (
    <Link href={`/blog?page=${page - 1}`}>
      <button className="px-4 py-2 border border-my-deep-blue rounded-xl hover:bg-my-deep-blue hover:text-my-white transition">
        Prev
      </button>
    </Link>
  )}

  <span className="text-my-deep-blue ring-1 ring-my-deep-blue px-4 py-2 rounded-xl">
    {page}
  </span>

  {latestPosts.length > numberOfPosts && (
    <Link href={`/blog?page=${page + 1}`}>
      <button className="px-4 py-2 border border-my-deep-blue rounded-xl hover:bg-my-deep-blue hover:text-my-white transition">
        Next
      </button>
    </Link>
  )}
</div>
            </div>
        </section>
    )
}

export default AllBlogs;