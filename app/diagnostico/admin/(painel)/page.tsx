import { Suspense } from "react";
import CartaoContador from "@/components/diagnostico/admin/CartaoContador";
import TabelaSolicitacoes from "@/components/diagnostico/admin/TabelaSolicitacoes";
import { STATUS_LABEL, STATUS_ORDEM } from "@/lib/diagnostico/constants";
import { listarSolicitacoes } from "@/lib/servidor/supabase/consultas";
import { mapearListaSolicitacoes } from "@/lib/diagnostico/mapear-supabase";

// Sempre dinâmica — dado muda a cada solicitação recebida, e depende da sessão do
// administrador (RLS), então nunca deve ser cacheada estaticamente.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const linhas = await listarSolicitacoes();
  const solicitacoes = mapearListaSolicitacoes(linhas as Parameters<typeof mapearListaSolicitacoes>[0]);

  const contagemPorStatus = STATUS_ORDEM.map((status) => ({
    status,
    quantidade: solicitacoes.filter((s) => s.status === status).length,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink/60">Visão geral do funil de diagnósticos recebidos.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {contagemPorStatus.map(({ status, quantidade }) => (
          <CartaoContador
            key={status}
            label={STATUS_LABEL[status]}
            quantidade={quantidade}
            href={`/diagnostico/admin?status=${status}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink">Solicitações</h2>
        <Suspense fallback={<p className="text-sm text-ink/60">Carregando...</p>}>
          <TabelaSolicitacoes solicitacoes={solicitacoes} />
        </Suspense>
      </div>
    </div>
  );
}
