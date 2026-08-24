import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { buscarServicoPublicoPorId } from "@/lib/servidor/supabase/consultas-servicos";
import ServicoBriefingForm from "@/components/servicos/ServicoBriefingForm";

export const metadata: Metadata = {
  title: "Preencher briefing",
  robots: { index: false, follow: false }, // fluxo de captação, sem valor de indexação (mesmo padrão do Diagnóstico)
};

export default async function ServicoBriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const servico = await buscarServicoPublicoPorId(id);

  if (!servico) return notFound();

  return (
    <section className="section-y">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow={servico.nome}
            title="Conte pra gente o seu projeto"
            description="Sem precisar de termos técnicos — descreva com suas próprias palavras o que você precisa."
          />
        </Reveal>
        <Reveal delay={100}>
          <ServicoBriefingForm servicoId={servico.id} servicoNome={servico.nome} />
        </Reveal>
      </Container>
    </section>
  );
}
