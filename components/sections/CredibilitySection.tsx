import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/**
 * Compensa a ausência de depoimentos/avaliações (empresa nova, conforme briefing).
 * Estrutura já preparada para receber depoimentos reais assim que existirem —
 * basta popular TESTIMONIALS em lib/constants.ts e mapear aqui.
 */
export default function CredibilitySection() {
  return (
    <section className="section-y bg-ink text-paper">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Compromisso"
            title="Um processo transparente, do início ao fim"
            description="Somos uma empresa em expansão: cada projeto é tratado com o mesmo cuidado que gostaríamos de receber. Acompanhamento próximo, prazos claros e comunicação direta em cada etapa."
          />
        </Reveal>
      </Container>
    </section>
  );
}
