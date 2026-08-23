import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { MODULO_BASE_PATH, MODULO_SITE } from "@/lib/diagnostico/constants";

/**
 * Hero exclusivo do módulo — reaproveita Container/Reveal/Button do Portal
 * (decisão C07 da consolidação), sem criar nenhum componente base novo.
 */
export default function ModuloHero() {
  return (
    <section className="section-y bg-ink text-paper">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-tint">
            {MODULO_SITE.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            {MODULO_SITE.title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-2xl text-base opacity-80 sm:text-lg">{MODULO_SITE.subtitle}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`${MODULO_BASE_PATH}/formulario`} variant="primary">
              Analisar meu processo
            </Button>
            <Link
              href="#metodologia"
              className="inline-flex items-center justify-center rounded-card border border-paper/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              Ver metodologia
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
