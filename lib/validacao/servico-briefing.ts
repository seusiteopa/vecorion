import { z } from "zod";

/**
 * Mais enxuto que `schemaCriarSolicitacao` (wizard de 10 etapas do
 * Diagnóstico) de propósito — aqui o cliente já escolheu um serviço
 * específico do catálogo, então o formulário só precisa dos dados de
 * contato + a descrição do projeto, não uma qualificação completa de
 * processo de negócio.
 */
export const schemaCriarBriefingServico = z.object({
  nome: z.string().trim().min(1, "Informe seu nome.").max(200),
  empresa: z.string().trim().max(200).optional().default(""),
  email: z.string().trim().email("Informe um e-mail válido.").max(200),
  telefone: z.string().trim().min(8, "Informe um telefone/WhatsApp válido.").max(30),
  descricaoProjeto: z.string().trim().min(10, "Descreva um pouco mais o que você precisa.").max(4000),
  requisitos: z.string().trim().max(4000).optional().default(""),
  linkReferencia: z.string().trim().url("Informe um link válido (com https://).").max(500).optional().or(z.literal("")),
});

export type EntradaCriarBriefingServico = z.infer<typeof schemaCriarBriefingServico>;
