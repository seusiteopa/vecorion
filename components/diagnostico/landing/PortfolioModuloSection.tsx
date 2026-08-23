import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Nenhum case real foi fornecido em nenhuma etapa deste projeto (mesma pendência já
 * registrada para /portfolio do Portal). Em vez de inventar um case fictício — o que
 * seria enganoso para quem visita o site — esta seção documenta o formato esperado
 * (problema → processo → solução → resultado) como um estado vazio honesto, pronta
 * para ser preenchida assim que o primeiro case real do módulo existir.
 */
export default function PortfolioModuloSection() {
  return (
    <section className="section-y bg-mist">
      <Container className="flex flex-col items-center gap-8 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="Projetos e soluções"
            title="Em breve, cases reais de diagnóstico"
            description="Cada projeto aqui mostrará o problema original, o processo antigo, a solução construída e o resultado alcançado."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="grid max-w-3xl gap-4 rounded-card border border-dashed border-ink/15 bg-paper p-8 sm:grid-cols-4">
            {["Problema", "Processo", "Solução", "Resultado"].map((label) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                  {label}
                </span>
                <span className="text-xs text-ink/60">a preencher</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <WhatsAppButton variant="ghost" message="Olá! Quero saber mais sobre cases do Diagnóstico Digital.">
            Quer ser o primeiro case? Fale com a gente →
          </WhatsAppButton>
        </Reveal>
      </Container>
    </section>
  );
}
