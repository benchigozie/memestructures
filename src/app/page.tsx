import CapitalVehicles from "@/components/CapitalVehicles";
import CTA from "@/components/CTA";
import FixedCTA from "@/components/FixedCTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InvestorProfile from "@/components/InvestorProfile";
import OnboardingProcess from "@/components/OnboardingProcess";
import Results from "@/components/Results";
import YieldStrategy from "@/components/YieldStrategy";

export default function Home() {
  return (
    <div className="bg-my-white">
      <main>
      <FixedCTA />
        <Header />
        <Hero />
        <Results />
        <YieldStrategy />
        <CapitalVehicles />
        <InvestorProfile />
        <OnboardingProcess />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
