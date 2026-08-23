import Link from "next/link";
import { notFound } from "next/navigation";
import BadgeStatus from "@/components/diagnostico/admin/BadgeStatus";
import BlocoAnaliseIA from "@/components/diagnostico/admin/BlocoAnaliseIA";
import {
  FAIXAS_PESSOAS,
  FREQUENCIAS,
  IMPACTOS,
  OBJETIVOS,
  PRIORIDADE_LABEL,
} from "@/lib/diagnostico/constants";
import { buscarAnaliseVigente, buscarSolicitacaoDetalhada } from "@/lib/servidor/supabase/consultas";
import { mapearAnalise, mapearDetalheSolicitacao } from "@/lib/diagnostico/mapear-supabase";
import { ErroNaoEncontrado } from "@/lib/servidor/erros";

function rotulo<T extends string>(lista: { value: T; label: string }[], valor: T) {
  return lista.find((item) => item.value === valor)?.label ?? valor;
}

export const dynamic = "force-dynamic";

export default async function DetalheSolicitacaoPage({ params }: { params: { id: string } }) {
  let linhaSolicitacao;
  try {
    linhaSolicitacao = await buscarSolicitacaoDetalhada(params.id);
  } catch (erro) {
    if (erro instanceof ErroNaoEncontrado) notFound();
    throw erro;
  }

  const solicitacao = mapearDetalheSolicitacao(
    linhaSolicitacao as Parameters<typeof mapearDetalheSolicitacao>[0],
  );

  const linhaAnalise = await buscarAnaliseVigente(solicitacao.id);
  const analise = linhaAnalise
    ? mapearAnalise(linhaAnalise as Parameters<typeof mapearAnalise>[0])
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/diagnostico/admin" className="text-sm text-ink/60 hover:text-brand hover:underline">
          ← Voltar à lista
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-black/5 bg-paper p-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">{solicitacao.cliente.empresa}</h1>
          <p className="text-sm text-ink/60">
            {solicitacao.cliente.nome} · {solicitacao.cliente.cargo || "Cargo não informado"}
          </p>
          <p className="text-sm text-ink/60">
            {solicitacao.cliente.email} · {solicitacao.cliente.whatsapp}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BadgeStatus status={solicitacao.status} />
          <span className="text-sm text-ink/60">
            Prioridade: {solicitacao.prioridade ? PRIORIDADE_LABEL[solicitacao.prioridade] : "não definida"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-card border border-black/5 bg-paper p-6">
          <Secao titulo="Problema" texto={solicitacao.problema} />
          <Secao titulo="Processo atual" texto={solicitacao.processoAtual} />
          <Secao titulo="Pessoas envolvidas" texto={rotulo(FAIXAS_PESSOAS, solicitacao.faixaPessoas)} />
          <Secao titulo="Frequência" texto={rotulo(FREQUENCIAS, solicitacao.frequencia)} />
          <Secao titulo="Ferramentas" texto={solicitacao.ferramentas.join(", ")} />
          <Secao
            titulo="Objetivo"
            texto={solicitacao.objetivo.map((o) => rotulo(OBJETIVOS, o)).join(", ")}
          />
          <Secao
            titulo="Impacto esperado"
            texto={solicitacao.impactoEsperado.map((i) => rotulo(IMPACTOS, i)).join(", ")}
          />
        </div>

        <BlocoAnaliseIA solicitacaoId={solicitacao.id} analiseExistente={analise} />
      </div>
    </div>
  );
}

function Secao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-black/5 pb-4 last:border-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">{titulo}</span>
      <p className="text-sm text-ink/80">{texto || "—"}</p>
    </div>
  );
}
