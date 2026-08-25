import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Recebemos seu processo",
  robots: { index: false, follow: false },
};

export default function ConfirmacaoPage() {
  return (
    <section className="section-y">
      <Container className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <Reveal>
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand"
          >
            ✓
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-3xl font-semibold sm:text-4xl">Recebemos seu processo.</h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="text-base text-ink/70 sm:text-lg">
            Suas informações foram recebidas. Vamos analisar o processo, identificar possíveis
            gargalos e avaliar oportunidades de digitalização, automação e inteligência
            artificial.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <span className="inline-flex items-center gap-2 rounded-card bg-mist px-4 py-2 text-sm font-semibold text-ink">
            Status: <span className="text-brand">Análise recebida</span>
          </span>
        </Reveal>

        <Reveal delay={260}>
          <Button href="/" variant="secondary">
            Voltar para o site
          </Button>
        </Reveal>

        <Reveal delay={320}>
          <Link href="/diagnostico" className="text-sm text-ink/60 hover:text-brand hover:underline">
            ← Voltar para o Diagnóstico Digital
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
