/**
 * Tipos do módulo Diagnóstico, espelhando o modelo de dados da Etapa 3.
 * Nenhum destes tipos depende de banco de dados real — são o contrato entre
 * o front-end (Etapa 8) e o back-end que ainda será construído (Etapa 9+).
 */

export type FaixaPessoas = "1" | "2-5" | "6-20" | "21-50" | "50+";

export type Frequencia =
  | "varias_vezes_dia"
  | "diariamente"
  | "semanalmente"
  | "mensalmente"
  | "eventualmente";

export type Objetivo =
  | "automatizar_processo"
  | "criar_sistema"
  | "criar_site"
  | "integrar_sistemas"
  | "usar_ia"
  | "reduzir_trabalho_manual"
  | "reduzir_erros"
  | "organizar_informacoes"
  | "aumentar_produtividade"
  | "nao_sei_ainda"
  | "outro";

export type ImpactoEsperado =
  | "economizar_tempo"
  | "reduzir_custos"
  | "aumentar_produtividade"
  | "aumentar_vendas"
  | "atender_mais_clientes"
  | "reduzir_erros"
  | "melhorar_organizacao"
  | "melhorar_controle"
  | "outro";

export type ContatoPreferido = "whatsapp" | "email" | "ligacao" | "reuniao_online";

export type StatusSolicitacao =
  | "novo"
  | "em_analise"
  | "proposta_enviada"
  | "em_desenvolvimento"
  | "concluido";

export type Prioridade = "baixa" | "media" | "alta";

export type Complexidade = "baixa" | "media" | "alta" | "muito_alta";

/** Conteúdo completo capturado pelo formulário de 10 etapas. */
export type DadosFormulario = {
  // Etapa 1 — Identificação
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
  cargo: string;
  siteEmpresa: string;
  segmento: string;

  // Etapa 2 — Problema
  problema: string;

  // Etapa 3 — Processo atual
  processoAtual: string;

  // Etapa 4 — Pessoas envolvidas
  faixaPessoas: FaixaPessoas | "";
  pessoasEnvolvidasDescricao: string;

  // Etapa 5 — Frequência
  frequencia: Frequencia | "";
  tempoGasto: string;

  // Etapa 6 — Ferramentas
  ferramentas: string[];
  ferramentasManter: string;

  // Etapa 7 — Objetivo
  objetivo: Objetivo[];

  // Etapa 8 — Impacto
  impactoEsperado: ImpactoEsperado[];

  // Etapa 9 — Arquivos
  arquivos: File[];

  // Etapa 10 — Contato
  contatoPreferido: ContatoPreferido | "";
  melhorHorario: string;
};

export const DADOS_FORMULARIO_VAZIO: DadosFormulario = {
  nome: "",
  empresa: "",
  email: "",
  whatsapp: "",
  cargo: "",
  siteEmpresa: "",
  segmento: "",
  problema: "",
  processoAtual: "",
  faixaPessoas: "",
  pessoasEnvolvidasDescricao: "",
  frequencia: "",
  tempoGasto: "",
  ferramentas: [],
  ferramentasManter: "",
  objetivo: [],
  impactoEsperado: [],
  arquivos: [],
  contatoPreferido: "",
  melhorHorario: "",
};

/** Representação de uma solicitação já existente, usada no painel administrativo. */
export type Solicitacao = {
  id: string;
  cliente: {
    nome: string;
    empresa: string;
    email: string;
    whatsapp: string;
    cargo: string;
    segmento: string;
  };
  problema: string;
  processoAtual: string;
  faixaPessoas: FaixaPessoas;
  frequencia: Frequencia;
  ferramentas: string[];
  objetivo: Objetivo[];
  impactoEsperado: ImpactoEsperado[];
  status: StatusSolicitacao;
  prioridade: Prioridade | null;
  criadoEm: string;
};

export type Analise = {
  id: string;
  solicitacaoId: string;
  versao: number;
  gargalos: string;
  oportunidades: string;
  solucoesSugeridas: string;
  automacoesSugeridas: string;
  aplicacoesIa: string;
  complexidade: Complexidade;
  estimativaInicial: string;
  perguntasPendentes: string[];
  geradoEm: string;
};
