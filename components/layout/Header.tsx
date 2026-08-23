import Link from "next/link";
import Container from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Logo from "@/components/ui/Logo";
import { NAV_ITEMS } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

/**
 * Header fixo (sticky). Mantém o CTA de WhatsApp sempre visível,
 * conforme decisão da Etapa 3 — nenhuma versão do menu deve escondê-lo.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label={`Ir para a página inicial da Vecorion`} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink/80 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-300 hover:text-brand hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton />
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
