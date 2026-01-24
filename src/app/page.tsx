import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <main>
        <Header />
        <Hero />
        <Results />
      </main>
    </div>
  );
}
