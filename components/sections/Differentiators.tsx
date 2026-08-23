import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { DIFFERENTIATORS } from "@/lib/constants";

export default function Differentiators() {
  return (
    <section className="section-y">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Diferenciais" title="Por que a Vecorion" />

        <div className="grid gap-8 sm:grid-cols-3">
          {DIFFERENTIATORS.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <span aria-hidden="true" className="mx-auto h-1 w-8 rounded-full bg-brand sm:mx-0" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-ink/70">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
