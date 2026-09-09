import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ServiceShowcase from "@/components/ServiceShowcase";
import LatestWork from "@/components/LatestWork";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Packages from "@/components/Packages";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <ServiceShowcase />
      <LatestWork />
      <Portfolio />
      <Process />
      <WhyChooseUs />
      <Packages />
      <Reviews />
      <FAQ />
      <Contact />
      <FinalCTA />
      <Footer />
    </main>
  );
}
