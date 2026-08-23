import { STATUS_LABEL } from "@/lib/diagnostico/constants";
import type { StatusSolicitacao } from "@/lib/diagnostico/types";

/**
 * A cor de marca (brand) já significa "ação primária" em todo o site — por isso o
 * status usa tons neutros/progressivos em vez de reaproveitar o azul aqui, evitando
 * ambiguidade de significado (decisão de UX da Etapa 5/9).
 */
const ESTILO_STATUS: Record<StatusSolicitacao, string> = {
  novo: "bg-brand-50 text-brand",
  em_analise: "bg-mist text-ink/70",
  proposta_enviada: "bg-ink/10 text-ink",
  em_desenvolvimento: "bg-ink text-paper",
  concluido: "bg-ink/5 text-ink/60",
};

export default function BadgeStatus({ status }: { status: StatusSolicitacao }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${ESTILO_STATUS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
