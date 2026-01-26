import AboutHero from "@/components/AboutHero";
import Team from "@/components/Team";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description: "",
  };

function page() {
    return (
        <div>
            <AboutHero />
            <Team />
        </div>
    )
}

export default page