import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FirmsBar from "@/components/FirmsBar";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <FirmsBar />
      <Features />
      <Showcase />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
