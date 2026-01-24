import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
      </main>
    </div>
  );
}
