import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import { SERVICES } from "@/lib/constants";

export default function ServicesOverview() {
  return (
    <section className="section-y bg-mist">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow="O que fazemos" title="Serviços" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service, index) => (
            <Reveal key={service.slug} delay={index * 100}>
              <Card className="group gap-3 p-8">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-ink/70">{service.summary}</p>
                <Link
                  href="/servicos"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-light"
                >
                  Saiba mais
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
