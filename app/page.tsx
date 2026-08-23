import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import ServicesOverview from "@/components/sections/ServicesOverview";
import Differentiators from "@/components/sections/Differentiators";
import CredibilitySection from "@/components/sections/CredibilitySection";
import DiagnosticoTeaser from "@/components/sections/DiagnosticoTeaser";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ServicesOverview />
      <Differentiators />
      <CredibilitySection />
      <DiagnosticoTeaser />
      <FaqAccordion limit={4} />
      <CtaBanner />
    </>
  );
}
