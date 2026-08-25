import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import { HOW_IT_WORKS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Portfólio",
  description: "Conheça o processo da Vecorion enquanto nosso portfólio de projetos cresce.",
};

/**
 * Decisão pendente da Etapa 2 (opção b escolhida como padrão): como a Vecorion
 * ainda não tem cases publicáveis, a página fica no menu mas mostra o processo
 * de trabalho em vez de projetos. Basta popular um array de "cases" aqui
 * quando existirem, sem alterar a navegação ou o restante da estrutura.
 */
export default function PortfolioPage() {
  return (
    <section className="section-y">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Portfólio"
            title="Nossos projetos estão a caminho"
            description="Somos uma empresa nova — em breve este espaço vai mostrar os sites que criamos para nossos clientes. Enquanto isso, veja como trabalhamos."
          />
        </Reveal>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((item, index) => (
            <li key={item.step}>
              <Reveal delay={index * 100} className="h-full">
                <Card surface="mist">
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
            Quero ser um dos primeiros projetos
          </Button>
        </div>
      </Container>
    </section>
  );
}
