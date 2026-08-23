import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Reveal from "@/components/ui/Reveal";
import ContactRedirectForm from "@/components/sections/ContactRedirectForm";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/contato" },
  title: "Contato",
  description: "Fale com a Vecorion pelo WhatsApp e conheça nosso processo de trabalho.",
};

export default function ContatoPage() {
  return (
    <section className="section-y">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <div className="flex flex-col gap-6">
            <SectionHeading
              align="left"
              as="h1"
              eyebrow="Fale com a gente"
              title="Vamos conversar sobre o seu projeto"
              description="Atendimento 100% online, para todo o Brasil. Sempre aberto."
            />

            <div className="flex flex-col gap-3">
              <WhatsAppButton className="w-fit">Falar no WhatsApp</WhatsAppButton>
              <span className="text-sm text-ink/60">{CONTACT.phoneDisplay}</span>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand hover:text-brand-light"
              >
                @vecorion no Instagram
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <ContactRedirectForm />
        </Reveal>
      </Container>
    </section>
  );
}
