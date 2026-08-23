import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { NAV_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procura não existe ou foi movida.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden section-y">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center opacity-[0.05]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/icon-blue.svg" alt="" className="w-[700px] max-w-none" />
      </div>

      <Container className="relative flex flex-col items-center gap-6 text-center">
        <span className="font-display text-7xl font-bold text-brand">404</span>
        <h1 className="text-3xl font-bold sm:text-4xl">Página não encontrada</h1>
        <p className="max-w-md text-ink/70">
          O endereço que você acessou não existe ou foi movido. Confira os links abaixo ou volte
          para o início.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-card border border-black/10 px-4 py-2 font-medium text-ink transition-colors hover:border-brand hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <WhatsAppButton className="mt-4" />
      </Container>
    </section>
  );
}
