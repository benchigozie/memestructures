import { sanityClient } from "@/lib/sanityClient";
import { urlFor } from "@/lib/sanityImage";
import Link from "next/link";
import Image from "next/image";



const latestPostsQuery = `
    *[_type == "post" && publishedAt <= now()]
  | order(publishedAt desc)[0...6] {
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

async function LatestBlog() {

    const [latestPosts] = await Promise.all([
        sanityClient.fetch(latestPostsQuery, {}, {
            next: {
                //tags: ["posts"],
                revalidate: 60
            }
        }),
    ]);
    const trimmedLatestPosts: Post[] = latestPosts.slice(0, 6);
    const recentPost: Post = trimmedLatestPosts[0];

    return (
        <section className='bg-my-white mt-20 md:mt-24' >
            <div className='max-w-6xl mx-auto px-4'>
                <h1 className='text-4xl md:text-6xl text-my-deep-blue font-bold mt-1 md:mt-5 text-center'>Blog Posts</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:mt-16">
                    <div className="bg-my-deep-blue rounded-3xl mr-0 md:mr-4 h-80">
                        <img
                            src={urlFor(recentPost.mainImage).width(800).height(600).url()}
                            alt={recentPost.title}
                            className="w-full h-full object-cover rounded-3xl"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                        <p className="text-lg">
                            {new Date(recentPost.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <h2 className="text-2xl text-my-deep-blue">{recentPost.title}</h2>
                        <p>
                            {recentPost.description}
                        </p>
                        <Link href={`/blog/${recentPost.slug}`}>
                            <button className="mt-6 hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors dutation-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl w-max">Read More</button>
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-20">
                    {trimmedLatestPosts.map((post: Post) =>
                    (
                        <div className="flex flex-col gap-4" key={post._id}>
                            <div className="bg-my-deep-blue h-56 rounded-2xl">
                                <img src={urlFor(post.mainImage).width(400).height(200).url()} alt="Blog placeholder" width={300} height={200} className="rounded-2xl w-full h-50 object-cover" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl text-my-deep-blue">{post.title}</h3>
                                <p>{post.description}</p>
                                <p>
                                    {new Date(recentPost.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <Link href={`/blog/${post.slug}`}>
                                    <button className="mt-3 hover:cursor-pointer hover:bg-my-deep-blue hover:text-my-white transition-colors dutation-300 text-my-deep-blue px-3 md:px-5 py-2 md:py-3 border border-my-deep-blue rounded-2xl w-max">Read More</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-lg font-medium underline underline-offset-5 mt-12 md:mt-18 hover:cursor-pointer hover:text-my-blue hover:scale-103 transition-all duration-300">See More Blogs</p>
            </div>
        </section>
    )
}

export default LatestBlog