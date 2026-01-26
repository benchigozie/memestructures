import AboutHero from "@/components/AboutHero";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description: "",
  };

function page() {
    return (
        <div>
            <AboutHero />
            
        </div>
    )
}

export default page