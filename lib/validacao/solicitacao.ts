import { z } from "zod";
import { UPLOAD_TAMANHO_MAXIMO_MB, UPLOAD_TIPOS_ACEITOS } from "@/lib/diagnostico/constants";

/**
 * Validação de servidor — a única que realmente importa para a segurança (Etapa 2/7:
 * "a do navegador pode ser contornada"). Espelha a validação de cliente da Etapa 8,
 * mas é avaliada de novo aqui, sem confiar em nada que veio da requisição.
 */

const FAIXAS_PESSOAS_VALIDAS = ["1", "2-5", "6-20", "21-50", "50+"] as const;
const FREQUENCIAS_VALIDAS = [
  "varias_vezes_dia",
  "diariamente",
  "semanalmente",
  "mensalmente",
  "eventualmente",
] as const;
const OBJETIVOS_VALIDOS = [
  "automatizar_processo",
  "criar_sistema",
  "criar_site",
  "integrar_sistemas",
  "usar_ia",
  "reduzir_trabalho_manual",
  "reduzir_erros",
  "organizar_informacoes",
  "aumentar_produtividade",
  "nao_sei_ainda",
  "outro",
] as const;
const IMPACTOS_VALIDOS = [
  "economizar_tempo",
  "reduzir_custos",
  "aumentar_produtividade",
  "aumentar_vendas",
  "atender_mais_clientes",
  "reduzir_erros",
  "melhorar_organizacao",
  "melhorar_controle",
  "outro",
] as const;
const CONTATOS_VALIDOS = ["whatsapp", "email", "ligacao", "reuniao_online"] as const;

export const schemaCriarSolicitacao = z.object({
  // Etapa 1 — Identificação
  nome: z.string().trim().min(1, "Informe o nome.").max(200),
  empresa: z.string().trim().min(1, "Informe a empresa.").max(200),
  email: z.string().trim().email("Informe um e-mail válido.").max(200),
  whatsapp: z.string().trim().min(8, "Informe um WhatsApp válido.").max(30),
  cargo: z.string().trim().max(200).optional().default(""),
  siteEmpresa: z.string().trim().max(300).optional().default(""),
  segmento: z.string().trim().max(200).optional().default(""),

  // Etapa 2/3 — Problema e processo
  problema: z.string().trim().min(1, "Descreva o problema.").max(5000),
  processoAtual: z.string().trim().min(1, "Descreva o processo atual.").max(5000),

  // Etapa 4 — Pessoas
  faixaPessoas: z.enum(FAIXAS_PESSOAS_VALIDAS, { message: "Faixa de pessoas inválida." }),
  pessoasEnvolvidasDescricao: z.string().trim().max(2000).optional().default(""),

  // Etapa 5 — Frequência
  frequencia: z.enum(FREQUENCIAS_VALIDAS, { message: "Frequência inválida." }),
  tempoGasto: z.string().trim().max(500).optional().default(""),

  // Etapa 6 — Ferramentas
  ferramentas: z.array(z.string().trim().min(1)).min(1, "Selecione ao menos uma ferramenta."),
  ferramentasManter: z.string().trim().max(1000).optional().default(""),

  // Etapa 7/8 — Objetivo e impacto
  objetivo: z.array(z.enum(OBJETIVOS_VALIDOS)).min(1, "Selecione ao menos um objetivo."),
  impactoEsperado: z.array(z.enum(IMPACTOS_VALIDOS)).min(1, "Selecione ao menos um impacto esperado."),

  // Etapa 10 — Contato
  contatoPreferido: z.enum(CONTATOS_VALIDOS, { message: "Canal de contato inválido." }),
  melhorHorario: z.string().trim().max(200).optional().default(""),
});

export type EntradaCriarSolicitacao = z.infer<typeof schemaCriarSolicitacao>;

export const schemaAtualizarSolicitacao = z
  .object({
    status: z.enum(["novo", "em_analise", "proposta_enviada", "em_desenvolvimento", "concluido"]).optional(),
    prioridade: z.enum(["baixa", "media", "alta"]).nullable().optional(),
  })
  .refine((dados) => dados.status !== undefined || dados.prioridade !== undefined, {
    message: "Informe ao menos um campo para atualizar (status ou prioridade).",
  });

export type EntradaAtualizarSolicitacao = z.infer<typeof schemaAtualizarSolicitacao>;

/** Validação de metadado do arquivo — o conteúdo binário em si é validado à parte (stream). */
export function validarMetadadoArquivo(arquivo: { type: string; size: number; name: string }) {
  const erros: string[] = [];

  if (!UPLOAD_TIPOS_ACEITOS.includes(arquivo.type)) {
    erros.push(`Tipo de arquivo não aceito: ${arquivo.type || "desconhecido"}.`);
  }
  if (arquivo.size <= 0) {
    erros.push("Arquivo vazio.");
  }
  if (arquivo.size > UPLOAD_TAMANHO_MAXIMO_MB * 1024 * 1024) {
    erros.push(`Arquivo maior que o limite de ${UPLOAD_TAMANHO_MAXIMO_MB}MB.`);
  }
  if (!arquivo.name || arquivo.name.length > 255) {
    erros.push("Nome de arquivo inválido.");
  }

  return erros;
}
