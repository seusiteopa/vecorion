import Container from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Reveal from "@/components/ui/Reveal";

type CtaBannerProps = {
  title?: string;
  description?: string;
};

export default function CtaBanner({
  title = "Vamos tirar sua ideia do papel",
  description = "Fale agora com a gente pelo WhatsApp e receba os próximos passos.",
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
            <WhatsAppButton
              variant="secondary"
              className="border-paper text-paper hover:bg-paper hover:text-brand"
            >
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
