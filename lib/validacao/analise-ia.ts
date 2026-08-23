import { z } from "zod";

/**
 * Valida a resposta da IA antes de ela virar uma `analise` persistida — a IA pode
 * devolver JSON malformado ou fora do formato esperado, e isso nunca deve gravar
 * dado inconsistente no banco (mesma filosofia de "nunca confiar cegamente" já
 * aplicada à validação de entrada do usuário, Etapa 9).
 */
export const schemaRespostaAnaliseIA = z.object({
  gargalos: z.string().min(1),
  oportunidades: z.string().min(1),
  solucoesSugeridas: z.string().min(1),
  automacoesSugeridas: z.string().min(1),
  aplicacoesIa: z.string().min(1),
  tecnologiasSugeridas: z.array(z.string()).default([]),
  complexidade: z.enum(["baixa", "media", "alta", "muito_alta"]),
  estimativaInicial: z.string().min(1),
  observacoes: z.string().default(""),
  perguntasPendentes: z.array(z.string()).default([]),
});

export type RespostaAnaliseIA = z.infer<typeof schemaRespostaAnaliseIA>;
