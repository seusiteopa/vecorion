import { redirect } from "next/navigation";
import { obterPerfilAdminAtual } from "@/lib/servidor/auth/sessao";
import PainelSidebar from "@/components/diagnostico/admin/PainelSidebar";

/**
 * Verificação de sessão real (Etapa 9), no lugar exato reservado pelo TODO da
 * Etapa 8/7: "verificado no layout, não em cada página individualmente". O
 * middleware (middleware.ts) já cobre a checagem básica de sessão antes disso —
 * aqui a checagem é completa (inclui presença ativa em `perfis_admin`).
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const perfil = await obterPerfilAdminAtual();

  if (!perfil) {
    redirect("/diagnostico/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <PainelSidebar nomeUsuario={perfil.nome} />
      <main className="flex-1 bg-mist px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
