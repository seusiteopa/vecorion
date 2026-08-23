import type { Analise, Solicitacao } from "./types";

/**
 * ATENÇÃO: este arquivo não é mais usado pelas páginas do painel a partir da
 * Etapa 9 — as páginas reais consultam `lib/servidor/supabase/consultas.ts`.
 * Mantido apenas como fixture de referência, útil para desenvolver telas de UI
 * isoladamente sem depender de um projeto Supabase configurado. Seguro de
 * remover quando não for mais necessário.
 */
const SOLICITACOES_MOCK: Solicitacao[] = [
  {
    id: "sol-001",
    cliente: {
      nome: "Marina Alves",
      empresa: "Alves Distribuidora",
      email: "marina@alvesdistribuidora.com.br",
      whatsapp: "5511988887777",
      cargo: "Gerente de Operações",
      segmento: "Distribuição / Atacado",
    },
    problema:
      "Recebemos pedidos por WhatsApp e depois copiamos manualmente para uma planilha, o que gera erro de digitação e atraso.",
    processoAtual:
      "O cliente manda o pedido pelo WhatsApp, um funcionário confere e digita na planilha, depois avisa o financeiro.",
    faixaPessoas: "6-20",
    frequencia: "varias_vezes_dia",
    ferramentas: ["WhatsApp", "Excel"],
    objetivo: ["automatizar_processo", "reduzir_erros"],
    impactoEsperado: ["economizar_tempo", "reduzir_erros"],
    status: "novo",
    prioridade: null,
    criadoEm: "2026-08-12T14:30:00-03:00",
  },
  {
    id: "sol-002",
    cliente: {
      nome: "Carlos Eduardo Lima",
      empresa: "Lima Contabilidade",
      email: "carlos@limacontabilidade.com.br",
      whatsapp: "5511977776666",
      cargo: "Sócio",
      segmento: "Serviços contábeis",
    },
    problema: "Cada cliente manda documento por um canal diferente e a equipe perde tempo organizando tudo.",
    processoAtual:
      "Documentos chegam por e-mail, WhatsApp e Google Drive, sem padrão — a equipe organiza manualmente em pastas.",
    faixaPessoas: "2-5",
    frequencia: "diariamente",
    ferramentas: ["E-mail", "WhatsApp", "Google Drive"],
    objetivo: ["organizar_informacoes", "usar_ia"],
    impactoEsperado: ["economizar_tempo", "melhorar_organizacao"],
    status: "em_analise",
    prioridade: "media",
    criadoEm: "2026-08-10T09:15:00-03:00",
  },
  {
    id: "sol-003",
    cliente: {
      nome: "Fernanda Costa",
      empresa: "Studio Costa Arquitetura",
      email: "fernanda@studiocosta.com.br",
      whatsapp: "5511966665555",
      cargo: "Arquiteta / Fundadora",
      segmento: "Arquitetura e design de interiores",
    },
    problema:
      "Não temos site nem sistema de agendamento — tudo é combinado por mensagem, e às vezes esquecemos horário.",
    processoAtual: "Cliente entra em contato pelo Instagram, agendamos por mensagem de texto sem calendário centralizado.",
    faixaPessoas: "1",
    frequencia: "semanalmente",
    ferramentas: ["WhatsApp"],
    objetivo: ["criar_site", "criar_sistema"],
    impactoEsperado: ["atender_mais_clientes", "melhorar_controle"],
    status: "proposta_enviada",
    prioridade: "alta",
    criadoEm: "2026-08-05T16:50:00-03:00",
  },
  {
    id: "sol-004",
    cliente: {
      nome: "Roberto Nunes",
      empresa: "Nunes Transportes",
      email: "roberto@nunestransportes.com.br",
      whatsapp: "5511955554444",
      cargo: "Diretor",
      segmento: "Logística e transporte",
    },
    problema: "Relatório de entregas é feito manualmente toda semana, consome quase um dia inteiro de trabalho.",
    processoAtual: "Cada motorista informa entregas por WhatsApp, um funcionário compila tudo numa planilha ao fim da semana.",
    faixaPessoas: "21-50",
    frequencia: "semanalmente",
    ferramentas: ["WhatsApp", "Excel", "Sistema próprio"],
    objetivo: ["automatizar_processo", "integrar_sistemas"],
    impactoEsperado: ["economizar_tempo", "melhorar_controle"],
    status: "em_desenvolvimento",
    prioridade: "alta",
    criadoEm: "2026-07-28T11:00:00-03:00",
  },
  {
    id: "sol-005",
    cliente: {
      nome: "Juliana Prado",
      empresa: "Prado Estética",
      email: "juliana@pradoestetica.com.br",
      whatsapp: "5511944443333",
      cargo: "Proprietária",
      segmento: "Estética e bem-estar",
    },
    problema: "Confirmação de agendamento e lembrete de horário são feitos manualmente, um por um.",
    processoAtual: "Recepcionista liga ou manda mensagem individual para cada cliente confirmar o horário do dia seguinte.",
    faixaPessoas: "2-5",
    frequencia: "diariamente",
    ferramentas: ["WhatsApp", "Sistema próprio"],
    objetivo: ["automatizar_processo", "reduzir_trabalho_manual"],
    impactoEsperado: ["economizar_tempo", "reduzir_erros"],
    status: "concluido",
    prioridade: "baixa",
    criadoEm: "2026-07-15T08:40:00-03:00",
  },
];

const ANALISES_MOCK: Analise[] = [
  {
    id: "an-001",
    solicitacaoId: "sol-002",
    versao: 1,
    gargalos: "Ausência de canal único de recebimento de documentos gera retrabalho manual de organização.",
    oportunidades: "Centralizar recebimento em um único ponto de entrada, com classificação automática por tipo de documento.",
    solucoesSugeridas: "Portal de upload único para clientes, com organização automática por pasta/cliente.",
    automacoesSugeridas: "Classificação automática de documento por tipo (nota fiscal, comprovante, contrato) usando IA.",
    aplicacoesIa: "Leitura e categorização automática de documentos recebidos.",
    complexidade: "media",
    estimativaInicial: "Estimativa inicial: 3 a 5 semanas, sujeita a revisão humana antes de qualquer proposta.",
    perguntasPendentes: [
      "Quantos clientes ativos enviam documento regularmente?",
      "Existe algum sistema de gestão contábil já em uso que precise se integrar?",
    ],
    geradoEm: "2026-08-11T10:00:00-03:00",
  },
];

/** Simula uma chamada assíncrona real (rede/banco) — substituída por chamada real na Etapa 9+. */
export async function listarSolicitacoes(): Promise<Solicitacao[]> {
  return SOLICITACOES_MOCK;
}

export async function buscarSolicitacaoPorId(id: string): Promise<Solicitacao | undefined> {
  return SOLICITACOES_MOCK.find((s) => s.id === id);
}

export async function buscarAnaliseVigente(solicitacaoId: string): Promise<Analise | undefined> {
  return ANALISES_MOCK.find((a) => a.solicitacaoId === solicitacaoId);
}
