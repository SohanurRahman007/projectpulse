import FAQSection from "@/components/landing/FAQSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <FAQSection />
    </div>
  );
}
