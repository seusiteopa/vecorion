import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { SERVICOS_MODULO } from "@/lib/diagnostico/constants";

export default function ServicosModuloSection() {
  return (
    <section className="section-y">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="O que fazemos"
            title="Do problema à solução completa"
            description="Product Design, UX/UI, automação, IA e integrações — tudo o que pode ser necessário para resolver o seu processo."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICOS_MODULO.map((servico, index) => (
            <Reveal key={servico.title} delay={index * 60}>
              <Card surface="mist" className="gap-3 p-6">
                <h3 className="text-lg font-semibold">{servico.title}</h3>
                <p className="text-sm text-ink/70">{servico.description}</p>
                {servico.href && (
                  <Link
                    href={servico.href}
                    className="mt-1 text-sm font-semibold text-brand hover:text-brand-light hover:underline"
                  >
                    Ver serviços completos →
                  </Link>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
