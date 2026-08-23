import type { StatusSolicitacao } from "@/lib/diagnostico/types";
import { ErroValidacao } from "@/lib/servidor/erros";

/**
 * Camada de Domínio (Etapa 2/7): regras que não dependem de nenhuma tecnologia
 * específica. Nenhuma automação muda o status sozinha — inclusive a análise por IA
 * (regra de negócio já fixada desde a Etapa 2) — por isso não existe aqui nenhuma
 * função que derive status automaticamente a partir de uma análise.
 */

export const STATUS_VALIDOS: StatusSolicitacao[] = [
  "novo",
  "em_analise",
  "proposta_enviada",
  "em_desenvolvimento",
  "concluido",
];

/**
 * Toda `solicitacao` nasce com status "novo" — regra de negócio nº1 da Etapa 3.
 * Nenhuma outra origem de criação é permitida.
 */
export const STATUS_INICIAL: StatusSolicitacao = "novo";

/**
 * Transições permitidas no funil. Modelado como avanço/recuo livre entre os 5 status
 * (nenhuma regra de negócio documentada nas etapas anteriores exige um fluxo estrito
 * de máquina de estados unidirecional — a equipe pode, por exemplo, voltar um lead de
 * "em análise" para "novo" se precisar reclassificar). O que a regra de negócio proíbe
 * é uma transição para um status que não existe, não a direção da transição.
 */
export function validarTransicaoStatus(novoStatus: string): asserts novoStatus is StatusSolicitacao {
  if (!STATUS_VALIDOS.includes(novoStatus as StatusSolicitacao)) {
    throw new ErroValidacao(`Status inválido: "${novoStatus}".`, "status");
  }
}
