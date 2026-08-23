import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/sobre" },
  title: "Sobre",
  description: "Conheça a história, a missão e os valores da Vecorion.",
};

const VALUES = [
  "Inovação constante",
  "Simplicidade",
  "Ética e transparência",
  "Foco no cliente",
  "Qualidade",
  "Aprendizado contínuo",
  "Acessibilidade",
];

export default function SobrePage() {
  return (
    <>
      <section className="section-y">
        <Container className="flex flex-col gap-16">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Nossa história"
              title="Sobre a Vecorion"
              description="Nascemos em 2026 para unir tecnologia, inteligência artificial e inovação a favor de pessoas, profissionais e pequenos negócios."
            />
          </Reveal>

          <div className="mx-auto grid max-w-3xl gap-8">
            <Reveal>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Missão</h3>
                <p className="text-ink/70">
                  Apoiar pessoas e pequenos negócios com tecnologia simples, acessível e humana,
                  ajudando cada ideia a ganhar vida no mundo digital.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <h3 className="mb-2 text-xl font-semibold">O que nos diferencia</h3>
                <p className="text-ink/70">
                  Unimos tecnologia, inteligência artificial e atendimento próximo às pessoas,
                  criando soluções simples e acessíveis pensadas para resolver problemas reais.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div>
                <h3 className="mb-4 text-xl font-semibold">Nossos valores</h3>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {VALUES.map((value) => (
                    <li
                      key={value}
                      className="rounded-card border border-black/5 bg-mist px-4 py-3 text-sm text-ink/80 transition-colors hover:border-brand/20 hover:bg-brand-50"
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
