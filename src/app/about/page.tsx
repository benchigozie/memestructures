import AboutHero from "@/components/AboutHero";
import JoinCommunity from "@/components/JoinCommunity";
import Team from "@/components/Team";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn More About MemeStructures - Our Mission, Vision, and the Team Behind the Platform",
  };

function page() {
    return (
        <div>
            <AboutHero />
            <Team />
            <JoinCommunity />
        </div>
    )
}

export default page