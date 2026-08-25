import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import { listarServicosAtivos } from "@/lib/servidor/supabase/consultas-servicos";

/**
 * Migrado de lista fixa (`lib/constants.ts`, SERVICES) para leitura real
 * do catálogo da Plataforma — mesma fonte de dado que `/servicos` já usa.
 * Cada card leva direto pro briefing daquele serviço (não só pra listagem
 * geral) — a pessoa já demonstrou interesse específico ao clicar aqui.
 */
export default async function ServicesOverview() {
  const servicos = await listarServicosAtivos();

  if (servicos.length === 0) return null;

  return (
    <section className="section-y bg-mist">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow="O que fazemos" title="Serviços" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {servicos.map((servico, index) => (
            <Reveal key={servico.id} delay={index * 100}>
              <Card className="group gap-3 p-8">
                <h3 className="text-xl font-semibold">{servico.nome}</h3>
                {servico.descricao && <p className="text-sm text-ink/70">{servico.descricao}</p>}
                <Link
                  href={`/servicos/${servico.id}/briefing`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-light"
                >
                  Preencher briefing
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
