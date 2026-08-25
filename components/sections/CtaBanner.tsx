import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

type CtaBannerProps = {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function CtaBanner({
  title = "Vamos tirar sua ideia do papel",
  description = "Veja nossos serviços e escolha o que mais combina com o seu projeto.",
  ctaHref = "/servicos",
  ctaLabel = "Ver serviços",
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-brand text-paper section-y">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 opacity-10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/icon-white.svg" alt="" className="w-72 sm:w-96" />
      </div>

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            <h2 className="max-w-xl text-3xl font-semibold sm:text-4xl">{title}</h2>
            <p className="max-w-md opacity-90">{description}</p>
            <Button href={ctaHref} variant="secondary" className="border-paper text-paper hover:bg-paper hover:text-brand">
              {ctaLabel}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
