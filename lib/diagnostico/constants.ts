import type {
  ContatoPreferido,
  FaixaPessoas,
  Frequencia,
  ImpactoEsperado,
  Objetivo,
  Prioridade,
  StatusSolicitacao,
} from "./types";

/** Rota base do módulo — nome provisório de trabalho (pendência C01, Etapa 5 da consolidação). */
export const MODULO_BASE_PATH = "/diagnostico";

export const MODULO_SITE = {
  eyebrow: "Diagnóstico Digital",
  title: "Sua empresa ainda perde tempo com processos que poderiam ser digitais?",
  subtitle:
    "Nós analisamos seus processos, identificamos oportunidades de digitalização e construímos soluções utilizando IA, automação e tecnologia.",
};

export const METODOLOGIA = [
  { step: "01", title: "Entender", description: "Entendemos como o processo funciona atualmente." },
  {
    step: "02",
    title: "Mapear",
    description: "Identificamos pessoas, ferramentas, tarefas, gargalos e informações.",
  },
  {
    step: "03",
    title: "Projetar",
    description: "Estruturamos a melhor experiência e o funcionamento do produto.",
  },
  {
    step: "04",
    title: "Automatizar",
    description: "Identificamos tarefas repetitivas que podem ser executadas automaticamente.",
  },
  {
    step: "05",
    title: "Inteligência",
    description: "Identificamos onde a IA pode analisar, organizar, gerar ou auxiliar decisões.",
  },
  { step: "06", title: "Construir", description: "Desenvolvemos o produto, sistema, site ou automação." },
  { step: "07", title: "Testar", description: "Validamos todas as funcionalidades e fluxos." },
  { step: "08", title: "Entregar", description: "Publicamos, documentamos e entregamos a solução." },
] as const;

/**
 * O card "Desenvolvimento Web" aponta para /servicos do Portal em vez de repetir a
 * descrição — decisão C04 (Etapa 5 da consolidação), para não duplicar a mesma oferta
 * em dois lugares da plataforma com textos diferentes.
 */
export const SERVICOS_MODULO = [
  { title: "Product Design", description: "Transformação de ideias em produtos digitais estruturados.", href: null },
  { title: "UX/UI", description: "Criação de experiências simples e interfaces profissionais.", href: null },
  {
    title: "Desenvolvimento Web",
    description: "Sites, landing pages e sistemas web — veja nossos serviços completos.",
    href: "/servicos",
  },
  { title: "Automação", description: "Transformação de processos manuais em fluxos automatizados.", href: null },
  { title: "IA", description: "Aplicação de inteligência artificial em processos e produtos.", href: null },
  { title: "Integrações", description: "Conexão entre diferentes ferramentas e sistemas.", href: null },
] as const;

export const FERRAMENTAS_DISPONIVEIS = [
  "WhatsApp",
  "Excel",
  "Google Sheets",
  "Google Drive",
  "E-mail",
  "CRM",
  "ERP",
  "Sistema próprio",
  "Banco de dados",
  "Outro",
];

export const FAIXAS_PESSOAS: { value: FaixaPessoas; label: string }[] = [
  { value: "1", label: "1 pessoa" },
  { value: "2-5", label: "2 a 5 pessoas" },
  { value: "6-20", label: "6 a 20 pessoas" },
  { value: "21-50", label: "21 a 50 pessoas" },
  { value: "50+", label: "Mais de 50 pessoas" },
];

export const FREQUENCIAS: { value: Frequencia; label: string }[] = [
  { value: "varias_vezes_dia", label: "Várias vezes ao dia" },
  { value: "diariamente", label: "Diariamente" },
  { value: "semanalmente", label: "Semanalmente" },
  { value: "mensalmente", label: "Mensalmente" },
  { value: "eventualmente", label: "Eventualmente" },
];

export const OBJETIVOS: { value: Objetivo; label: string }[] = [
  { value: "automatizar_processo", label: "Automatizar o processo" },
  { value: "criar_sistema", label: "Criar um sistema" },
  { value: "criar_site", label: "Criar um site" },
  { value: "integrar_sistemas", label: "Integrar sistemas" },
  { value: "usar_ia", label: "Utilizar IA" },
  { value: "reduzir_trabalho_manual", label: "Reduzir trabalho manual" },
  { value: "reduzir_erros", label: "Reduzir erros" },
  { value: "organizar_informacoes", label: "Organizar informações" },
  { value: "aumentar_produtividade", label: "Aumentar produtividade" },
  { value: "nao_sei_ainda", label: "Não sei ainda" },
  { value: "outro", label: "Outro" },
];

export const IMPACTOS: { value: ImpactoEsperado; label: string }[] = [
  { value: "economizar_tempo", label: "Economizar tempo" },
  { value: "reduzir_custos", label: "Reduzir custos" },
  { value: "aumentar_produtividade", label: "Aumentar produtividade" },
  { value: "aumentar_vendas", label: "Aumentar vendas" },
  { value: "atender_mais_clientes", label: "Atender mais clientes" },
  { value: "reduzir_erros", label: "Reduzir erros" },
  { value: "melhorar_organizacao", label: "Melhorar organização" },
  { value: "melhorar_controle", label: "Melhorar controle" },
  { value: "outro", label: "Outro" },
];

export const CONTATOS_PREFERIDOS: { value: ContatoPreferido; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
  { value: "ligacao", label: "Ligação" },
  { value: "reuniao_online", label: "Reunião online" },
];

export const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  proposta_enviada: "Proposta enviada",
  em_desenvolvimento: "Em desenvolvimento",
  concluido: "Concluído",
};

/** Ordem fixa usada nos contadores do dashboard — reflete o funil comercial. */
export const STATUS_ORDEM: StatusSolicitacao[] = [
  "novo",
  "em_analise",
  "proposta_enviada",
  "em_desenvolvimento",
  "concluido",
];

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

/**
 * Tipos e tamanho máximo de arquivo aceitos no upload (Etapa 9 do formulário).
 * Limite exato ainda é uma pendência registrada (Etapa 3, dúvida 3) — 10MB é um valor
 * de trabalho conservador, fácil de ajustar num único lugar quando confirmado.
 */
export const UPLOAD_TIPOS_ACEITOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const UPLOAD_TAMANHO_MAXIMO_MB = 10;
