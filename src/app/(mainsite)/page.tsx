import FAQs from "@/components/FAQs";
import FourLensFramework from "@/components/FourLensFramework";
import Hero from "@/components/Hero";
import InvestorProfile from "@/components/InvestorProfile";
import OnboardingProcess from "@/components/OnboardingProcess";
import StructureBeforeDeployment from "@/components/StructureBeforeDeployment";


export default function Home() {
  return (
    <div>
         
        <Hero />
        <StructureBeforeDeployment />
        
        <FourLensFramework />
        <InvestorProfile />
        <OnboardingProcess />
      
        <FAQs />
     
    </div>
  );
}
