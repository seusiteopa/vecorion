import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/**
 * Único ponto de descoberta do módulo Diagnóstico a partir do Portal nesta fase —
 * decisão C06 (consolidação, Etapa 5): card na Home em vez de item no menu principal,
 * evitando expandir a navegação antes do módulo estar validado com uso real.
 */
export default function DiagnosticoTeaser() {
  return (
    <section className="section-y">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-card border border-black/5 bg-mist p-8 text-center sm:p-12">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand">
              Diagnóstico Digital
            </span>
            <h2 className="max-w-xl text-2xl font-semibold sm:text-3xl">
              Tem um processo que está consumindo tempo?
            </h2>
            <p className="max-w-lg text-sm text-ink/70 sm:text-base">
              Você não precisa saber qual tecnologia utilizar. Conte-nos o que está
              acontecendo e nós analisamos o processo para identificar possíveis soluções.
            </p>
            <Button href="/diagnostico" variant="primary">
              Analisar meu processo
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
