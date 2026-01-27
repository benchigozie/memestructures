import LatestBlog from "@/components/LatestBlog"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog posts",
    description: "",
  };

function page() {
    return (
        <div>       
            <LatestBlog />
        </div>
    )
}

export default page