import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { CONTACT, LEGAL_LINKS, NAV_ITEMS, SITE } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "Instagram", href: CONTACT.instagram },
  { label: "Facebook", href: CONTACT.facebook },
  { label: "YouTube", href: CONTACT.youtube },
  { label: "LinkedIn", href: CONTACT.linkedin },
].filter((link) => Boolean(link.href));

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-ink text-paper/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Logo tone="light" />
          <p className="text-sm text-paper/60">{SITE.description}</p>
        </div>

        <nav aria-label="Navegação do rodapé" className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-paper">Navegação</span>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-paper/60 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-paper">Contato</span>
          <span className="text-sm text-paper/60">{CONTACT.phoneDisplay}</span>
          {CONTACT.email && <span className="text-sm text-paper/60">{CONTACT.email}</span>}
          <span className="text-sm text-paper/60">Atendimento: sempre aberto (online)</span>
        </div>

        {SOCIAL_LINKS.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-paper">Redes sociais</span>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-paper/60 hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </Container>

      <div className="border-t border-paper/10 py-6">
        <Container className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-paper/55">
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <nav aria-label="Links legais" className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-paper/55 hover:text-paper/70">
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </footer>
  );
}
