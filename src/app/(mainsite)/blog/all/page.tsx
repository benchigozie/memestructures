import AllBlogs from "@/components/AllBlogs";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All Blogs",
    description: "",
  };

function page({ searchParams }: { searchParams: { page?: string } }) {
    return (
        <div>       
            <AllBlogs searchParams={Promise.resolve(searchParams)} />
        </div>
    )
}

export default page