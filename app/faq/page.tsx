import type { Metadata } from "next";
import FaqAccordion from "@/components/sections/FaqAccordion";
import CtaBanner from "@/components/sections/CtaBanner";
import { FAQ_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Perguntas frequentes",
  description: "Tire suas dúvidas sobre os serviços e o processo de trabalho da Vecorion.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqAccordion headingAs="h1" />
      <CtaBanner
        title="Ainda com dúvidas?"
        description="Veja nossos serviços ou fale direto com a gente pelo ícone de WhatsApp no canto da tela."
        ctaHref="/contato"
        ctaLabel="Falar com a gente"
      />
    </>
  );
}
