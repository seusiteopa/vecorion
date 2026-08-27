import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ServicesOverview from "@/components/sections/ServicesOverview";
import Differentiators from "@/components/sections/Differentiators";
import CredibilitySection from "@/components/sections/CredibilitySection";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <Differentiators />
      <CredibilitySection />
      <FaqAccordion limit={4} />
      <CtaBanner />
    </>
  );
}
