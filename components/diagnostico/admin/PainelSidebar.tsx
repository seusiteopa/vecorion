"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

const ITENS = [{ label: "Dashboard", href: "/diagnostico/admin" }];

type PainelSidebarProps = {
  nomeUsuario?: string;
};

/**
 * Navegação própria da área administrativa (Etapa 5/7: "sem Header/Footer público").
 * Fundo em `ink`, reaproveitando o tom escuro de marca já validado em vez de um
 * cinza neutro genérico de dashboard — decisão registrada na Etapa 9.
 */
export default function PainelSidebar({ nomeUsuario }: PainelSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/diagnostico/auth/logout", { method: "POST" });
    router.push("/diagnostico/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-8 bg-ink px-6 py-8 text-paper sm:w-64 sm:min-h-screen">
      <Logo tone="light" />

      {nomeUsuario && <p className="text-sm text-paper/60">Olá, {nomeUsuario}</p>}

      <nav className="flex flex-col gap-1" aria-label="Navegação do painel">
        {ITENS.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              className={`rounded-card px-4 py-2.5 text-sm font-medium transition-colors ${
                ativo ? "bg-brand text-paper" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={sair}
          className="text-sm font-medium text-paper/50 transition-colors hover:text-paper"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
