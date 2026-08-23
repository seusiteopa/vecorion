"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BadgeStatus from "./BadgeStatus";
import { PRIORIDADE_LABEL, STATUS_LABEL } from "@/lib/diagnostico/constants";
import type { Solicitacao } from "@/lib/diagnostico/types";

type TabelaSolicitacoesProps = {
  solicitacoes: Solicitacao[];
};

function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(iso),
  );
}

export default function TabelaSolicitacoes({ solicitacoes }: TabelaSolicitacoesProps) {
  const searchParams = useSearchParams();
  const filtroStatus = searchParams.get("status");

  const lista = filtroStatus ? solicitacoes.filter((s) => s.status === filtroStatus) : solicitacoes;

  if (lista.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 bg-paper p-10 text-center text-sm text-ink/60">
        {filtroStatus
          ? `Nenhuma solicitação com status "${STATUS_LABEL[filtroStatus as keyof typeof STATUS_LABEL]}" no momento.`
          : "Nenhuma solicitação recebida ainda."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-black/5 bg-paper">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-black/5 text-xs font-semibold uppercase tracking-widest text-ink/60">
          <tr>
            <th className="px-5 py-3">Empresa</th>
            <th className="px-5 py-3">Problema</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Prioridade</th>
            <th className="px-5 py-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((solicitacao) => (
            <tr key={solicitacao.id} className="border-b border-black/5 last:border-0 hover:bg-mist/60">
              <td className="px-5 py-4">
                <Link
                  href={`/diagnostico/admin/solicitacao/${solicitacao.id}`}
                  className="font-semibold text-ink hover:text-brand hover:underline"
                >
                  {solicitacao.cliente.empresa}
                </Link>
                <p className="text-xs text-ink/60">{solicitacao.cliente.nome}</p>
              </td>
              <td className="max-w-xs truncate px-5 py-4 text-ink/70">{solicitacao.problema}</td>
              <td className="px-5 py-4">
                <BadgeStatus status={solicitacao.status} />
              </td>
              <td className="px-5 py-4 text-ink/70">
                {solicitacao.prioridade ? PRIORIDADE_LABEL[solicitacao.prioridade] : "—"}
              </td>
              <td className="px-5 py-4 text-ink/60">{formatarData(solicitacao.criadoEm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
