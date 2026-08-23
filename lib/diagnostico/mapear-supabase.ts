import type { Analise, Solicitacao } from "@/lib/diagnostico/types";

/**
 * O Supabase retorna a relação `clientes` como objeto (N:1) ou array, dependendo
 * de como a chave estrangeira é interpretada — trata os dois casos defensivamente
 * em vez de assumir um formato só, para não quebrar quando o schema real for
 * criado (Etapa 9 não tem acesso a um projeto Supabase ao vivo para confirmar
 * o formato exato nesta etapa).
 */
function extrairClienteUnico<T>(clientes: T | T[] | null | undefined): T | undefined {
  if (!clientes) return undefined;
  return Array.isArray(clientes) ? clientes[0] : clientes;
}

type LinhaListaSupabase = {
  id: string;
  problema: string;
  status: Solicitacao["status"];
  prioridade: Solicitacao["prioridade"];
  criado_em: string;
  clientes:
    | { nome: string; empresa: string; email: string; telefone: string; cargo: string | null; segmento: string | null }
    | { nome: string; empresa: string; email: string; telefone: string; cargo: string | null; segmento: string | null }[]
    | null;
};

/** Usado pelo dashboard — lista resumida (Etapa 7, contrato GET /solicitacoes). */
export function mapearListaSolicitacoes(linhas: LinhaListaSupabase[]): Solicitacao[] {
  return linhas.map((linha) => {
    const cliente = extrairClienteUnico(linha.clientes);
    return {
      id: linha.id,
      cliente: {
        nome: cliente?.nome ?? "",
        empresa: cliente?.empresa ?? "",
        email: cliente?.email ?? "",
        whatsapp: cliente?.telefone ?? "",
        cargo: cliente?.cargo ?? "",
        segmento: cliente?.segmento ?? "",
      },
      problema: linha.problema,
      processoAtual: "",
      faixaPessoas: "1",
      frequencia: "eventualmente",
      ferramentas: [],
      objetivo: [],
      impactoEsperado: [],
      status: linha.status,
      prioridade: linha.prioridade,
      criadoEm: linha.criado_em,
    };
  });
}

type LinhaDetalheSupabase = LinhaListaSupabase & {
  processo_atual: string;
  faixa_pessoas: Solicitacao["faixaPessoas"];
  frequencia: Solicitacao["frequencia"];
  objetivo: Solicitacao["objetivo"];
  impacto_esperado: Solicitacao["impactoEsperado"];
  solicitacao_ferramentas?: { ferramentas: { nome: string } | { nome: string }[] }[] | null;
};

/** Usado na tela de detalhe (Etapa 7, contrato GET /solicitacoes/[id]). */
export function mapearDetalheSolicitacao(linha: LinhaDetalheSupabase): Solicitacao {
  const cliente = extrairClienteUnico(linha.clientes);
  const ferramentas = (linha.solicitacao_ferramentas ?? [])
    .map((v) => extrairClienteUnico(v.ferramentas)?.nome)
    .filter((nome): nome is string => Boolean(nome));

  return {
    id: linha.id,
    cliente: {
      nome: cliente?.nome ?? "",
      empresa: cliente?.empresa ?? "",
      email: cliente?.email ?? "",
      whatsapp: cliente?.telefone ?? "",
      cargo: cliente?.cargo ?? "",
      segmento: cliente?.segmento ?? "",
    },
    problema: linha.problema,
    processoAtual: linha.processo_atual,
    faixaPessoas: linha.faixa_pessoas,
    frequencia: linha.frequencia,
    ferramentas,
    objetivo: linha.objetivo,
    impactoEsperado: linha.impacto_esperado,
    status: linha.status,
    prioridade: linha.prioridade,
    criadoEm: linha.criado_em,
  };
}

type LinhaAnaliseSupabase = {
  id: string;
  solicitacao_id: string;
  versao: number;
  gargalos: string | null;
  oportunidades: string | null;
  solucoes_sugeridas: string | null;
  automacoes_sugeridas: string | null;
  aplicacoes_ia: string | null;
  complexidade: Analise["complexidade"] | null;
  estimativa_inicial: string | null;
  perguntas_pendentes: string[] | null;
  gerado_em: string;
};

export function mapearAnalise(linha: LinhaAnaliseSupabase): Analise {
  return {
    id: linha.id,
    solicitacaoId: linha.solicitacao_id,
    versao: linha.versao,
    gargalos: linha.gargalos ?? "",
    oportunidades: linha.oportunidades ?? "",
    solucoesSugeridas: linha.solucoes_sugeridas ?? "",
    automacoesSugeridas: linha.automacoes_sugeridas ?? "",
    aplicacoesIa: linha.aplicacoes_ia ?? "",
    complexidade: linha.complexidade ?? "baixa",
    estimativaInicial: linha.estimativa_inicial ?? "",
    perguntasPendentes: linha.perguntas_pendentes ?? [],
    geradoEm: linha.gerado_em,
  };
}
