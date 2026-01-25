import CapitalVehicles from "@/components/CapitalVehicles";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InvestorProfile from "@/components/InvestorProfile";
import Results from "@/components/Results";
import YieldStrategy from "@/components/YieldStrategy";

export default function Home() {
  return (
    <div className="bg-my-white">
      <main>
        <Header />
        <Hero />
        <Results />
        <YieldStrategy />
        <CapitalVehicles />
        <InvestorProfile />
      </main>
    </div>
  );
}
