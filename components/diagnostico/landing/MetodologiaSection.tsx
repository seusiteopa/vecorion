import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { METODOLOGIA } from "@/lib/diagnostico/constants";

/**
 * Metodologia de 8 etapas — decisão C02 (Etapa 5 da consolidação): apresentada como
 * aprofundamento da metodologia de 4 etapas do Portal (Strategy/Wireframe/Design/Code),
 * nunca como um processo concorrente. Por isso a nota de rodapé explícita abaixo.
 */
export default function MetodologiaSection() {
  return (
    <section id="metodologia" className="section-y bg-mist">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Como transformamos um problema em uma solução"
            title="Metodologia do diagnóstico"
            description="Um aprofundamento do nosso processo de trabalho, específico para projetos de automação e IA."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METODOLOGIA.map((etapa, index) => (
            <Reveal key={etapa.step} delay={index * 60}>
              <Card className="gap-3 p-6">
                <span className="text-sm font-semibold text-brand">{etapa.step}</span>
                <h3 className="text-lg font-semibold">{etapa.title}</h3>
                <p className="text-sm text-ink/70">{etapa.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto max-w-2xl text-center text-sm text-ink/60">
            Esse é o mesmo espírito da nossa metodologia de Estratégia, Wireframe, Design e
            Desenvolvimento — aqui detalhado para projetos que envolvem automação e
            inteligência artificial.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
