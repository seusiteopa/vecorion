import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import CtaBanner from "@/components/sections/CtaBanner";
import { listarServicosAtivos } from "@/lib/servidor/supabase/consultas-servicos";

export const metadata: Metadata = {
  alternates: { canonical: "/servicos" },
  title: "Serviços",
  description: "Serviços sob medida para o seu negócio — escolha um e conte o que você precisa.",
};

/**
 * Migrado de lista fixa (`lib/constants.ts`, SERVICES) para leitura real
 * do catálogo cadastrado na Plataforma Vecorion (banco compartilhado) —
 * todo serviço criado por lá aparece aqui automaticamente, sem precisar
 * editar código deste site a cada novo serviço.
 *
 * Preço não é exibido de propósito — mantém a prática já estabelecida
 * deste site ("preço único, definido conforme o escopo combinado no
 * orçamento"), não uma limitação técnica.
 */
export default async function ServicosPage() {
  const servicos = await listarServicosAtivos();

  return (
    <>
      <section className="section-y">
        <Container className="flex flex-col gap-14">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="O que fazemos"
              title="Nossos serviços"
              description="Escolha um serviço e conte pra gente o que você precisa — preparamos um orçamento sob medida."
            />
          </Reveal>

          {servicos.length === 0 ? (
            <p className="text-center text-sm text-ink/60">
              Nenhum serviço disponível no momento. Fale com a gente pelo WhatsApp.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {servicos.map((servico, index) => (
                <Reveal key={servico.id} delay={index * 100}>
                  <Card surface="mist" className="gap-4 p-8">
                    <h2 className="text-xl font-semibold">{servico.nome}</h2>
                    {servico.descricao && <p className="text-sm text-ink/70">{servico.descricao}</p>}
                    <Link
                      href={`/servicos/${servico.id}/briefing`}
                      className="text-sm font-semibold text-brand underline-offset-4 hover:text-brand-light hover:underline"
                    >
                      Preencher briefing →
                    </Link>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}

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
        title="Pronto para tirar seu projeto do papel?"
        description="Conte pra gente o que você precisa e receba um orçamento sem compromisso."
        ctaHref="/contato"
        ctaLabel="Falar com a gente"
      />
    </>
  );
}
