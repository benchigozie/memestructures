import formatDate from "@/utils/formatDate";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextComponents } from "@portabletext/react";
import { sanityClient } from "@/lib/sanityClient";
import Image from "next/image";
import { urlFor } from "@/lib/sanityImage";
import ShareButton from "@/components/ShareButton";

type Category = {
    _id: string;
    title: string;
};

type Author = {
    name: string;
    role?: string;
    image: any;
};

type Post = {
    _id: string;
    title: string;
    publishedAt: string;
    description: string;
    views: number;
    mainImage: any;
    body: PortableTextBlock[];
    author: Author;
    categories?: Category[];
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

const postQuery = `
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  publishedAt,
  body,
  mainImage,
  description,
  "author": author->{
    name,
    role,
    image
  }
}
`;

const ptComponents: PortableTextComponents = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
  
        return (
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Blog Image"}
            className="rounded-lg w-full object-cover my-4"
          />
        );
      },
    },
  };

async function page({ params }: PageProps) {

    const { slug } = await params;

    const post = await sanityClient.fetch<Post>(
        postQuery,
        { slug },
        {
            next: {
                //tags: ["posts"],
                revalidate: /*3600*/60,
            },
        }
    );


    if (!post) {
        return <div className="pt-40 text-center mt-24">Post not found</div>;
    }


    return (
        <section className='bg-my-white px-3 py-4' >
            <div className="flex flex-col gap-4 max-w-3xl mx-auto mt-16 md:mt-24 rounded-3xl p-4 md:p-12 shadow-lg shadow-my-gray/20">
                <div className="flex flex-col gap-7">
                    <h1 className="text-my-deep-blue text-2xl md:text-4xl font-bold mt-4">{post.title}</h1>
                    <div className="flex items-center gap-3 md:gap-5 mt-4 divide-my-black divide-y">
                        <div>
                            <Image src={urlFor(post.author.image).width(100).url()} alt={post.author?.name || "Author"} width={100} height={100} className="rounded-full object-cover w-16 h-16" />
                        </div>
                        <div>
                            <p>Author:<span className="ml-3 text-my-lime">{post.author.name}</span></p>
                            <p>Published on {formatDate(post.publishedAt, "long").month}  {formatDate(post.publishedAt, "long").day}, {formatDate(post.publishedAt, "long").year}</p>
                        </div>
                    </div>
                    <Image src={urlFor(post.mainImage).width(800).url()} alt={post.title} width={800} height={400} className="rounded-lg object-cover mx-auto w-full" />
                </div>
                <div className="prose text-green-gray prose-strong:text-my-gray prose-ul:marker:text-my-deep-blue prose-ol:marker:text-my-deep-blue max-w-none mt-6 text-lg">
                    <PortableText value={post.body} components={ptComponents} />
                </div>
                <div>
                    <ShareButton title={post.title} text={post.description} />
                </div>
            </div>
        </section>
    )
}

export default page