import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import { HOW_IT_WORKS } from "@/lib/constants";

/**
 * Maior alavanca de conversão identificada nas Etapas 1-3: explicar o processo
 * em linguagem simples reduz a insegurança do cliente leigo em tecnologia.
 */
export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-y">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Nosso processo"
            title="Como funciona"
            description="Um método claro, em 4 etapas, do primeiro contato até o site no ar."
          />
        </Reveal>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item, index) => (
            <li key={item.step} className="h-full">
              <Reveal delay={index * 100} className="h-full">
                <Card>
                  <span className="text-sm font-semibold text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-ink/70">{item.description}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="flex justify-center">
          <Button href="/servicos" variant="primary">
            Quero começar meu projeto
          </Button>
        </div>
      </Container>
    </section>
  );
}
