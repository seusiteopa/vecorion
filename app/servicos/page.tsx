import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import CtaBanner from "@/components/sections/CtaBanner";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/servicos" },
  title: "Serviços",
  description: "Sites institucionais e páginas de alta conversão, sob medida para o seu negócio.",
};

export default function ServicosPage() {
  return (
    <>
      <section className="section-y">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="O que fazemos"
              title="Nossos serviços"
              description="Soluções digitais pensadas para apresentar sua empresa e gerar resultado real."
            />
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {SERVICES.map((service, index) => (
              <Reveal key={service.slug} delay={index * 100}>
                <Card surface="mist" className="gap-4 p-8">
                  <h2 className="text-xl font-semibold">{service.title}</h2>
                  <p className="text-sm text-ink/70">{service.summary}</p>
                  <WhatsAppButton
                    variant="ghost"
                    message={`Olá! Quero saber mais sobre "${service.title}".`}
                  >
                    Pedir orçamento →
                  </WhatsAppButton>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-card border border-black/5 bg-paper p-8 text-center">
              <h3 className="text-lg font-semibold">Preço único</h3>
              <p className="text-sm text-ink/70">
                Sem mensalidade escondida: você fecha um valor único para o seu projeto, definido
                conforme o escopo combinado no orçamento.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBanner
        title="Pronto para tirar seu site do papel?"
        description="Conte pra gente o que você precisa e receba um orçamento sem compromisso."
      />
    </>
  );
}
