import CapitalVehicles from "@/components/CapitalVehicles";
import CTA from "@/components/CTA";
import FAQs from "@/components/FAQs";
import FixedCTA from "@/components/FixedCTA";
import FourLensFramework from "@/components/FourLensFramework";
import Hero from "@/components/Hero";
import InvestorProfile from "@/components/InvestorProfile";
import JoinCommunity from "@/components/JoinCommunity";
import OnboardingProcess from "@/components/OnboardingProcess";
import Results from "@/components/Results";
import StructureBeforeDeployment from "@/components/StructureBeforeDeployment";
import YieldStrategy from "@/components/YieldStrategy";

export default function Home() {
  return (
    <div>
      
        
        <Hero />
        <StructureBeforeDeployment />
        
        <FourLensFramework />
        <InvestorProfile />
        <OnboardingProcess />
        <CTA />
        <FAQs />
     
    </div>
  );
}
