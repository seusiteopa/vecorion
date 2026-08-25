import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/lib/constants";

/**
 * Primeiro elemento da Home. Precisa comunicar em segundos o que é e para quem é
 * (decisão de UX da Etapa 3). CTA primário (WhatsApp) e secundário (âncora) lado a lado.
 *
 * Elemento de assinatura visual: o próprio ícone da marca (infinito + globo) ampliado
 * e esmaecido ao fundo, reforçando a identidade sem competir com o texto — em vez de
 * um gradiente genérico, usa um ativo real da marca.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-mist section-y">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-10 flex justify-center opacity-[0.06]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/icon-blue.svg" alt="" className="h-auto w-[140%] max-w-none sm:w-[900px]" />
      </div>

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {SITE.tagline}
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-xl text-base text-ink/70 sm:text-lg">{SITE.description}</p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/servicos" variant="primary">
              Ver nossos serviços
            </Button>
            <Button href="#como-funciona" variant="secondary">
              Ver como funciona
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
