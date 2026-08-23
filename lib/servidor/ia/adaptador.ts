import "server-only";
import { ErroIntegracaoNaoConfigurada, ErroInterno } from "@/lib/servidor/erros";
import { env } from "@/lib/servidor/env";
import { log } from "@/lib/servidor/log";
import { schemaRespostaAnaliseIA, type RespostaAnaliseIA } from "@/lib/validacao/analise-ia";

/**
 * Adaptador da API de IA — implementação real (Etapa 10). Usa `fetch` nativo, sem
 * SDK adicional (decisão de dependências da Etapa 7: "nenhuma biblioteca adicional
 * é estritamente necessária" para esta integração) — mantém o bundle do servidor
 * leve, mesma filosofia já aplicada ao restante do projeto.
 *
 * A entrada nunca inclui e-mail/telefone do lead (Etapa 4, seção 5) — quem chama
 * este adaptador (app/api/diagnostico/analises/route.ts, Etapa 9) já garante isso
 * na montagem do objeto `EntradaAnaliseIA`.
 */

const MODELO = "claude-sonnet-5";
const URL_API = "https://api.anthropic.com/v1/messages";
const VERSAO_API = "2023-06-01";

export type ResultadoAnaliseIA = RespostaAnaliseIA;

export type EntradaAnaliseIA = {
  problema: string;
  processoAtual: string;
  ferramentas: string[];
  objetivo: string[];
  impactoEsperado: string[];
};

function montarPrompt(entrada: EntradaAnaliseIA): string {
  return `Você é um analista técnico sênior da Vecorion, uma consultoria de soluções digitais, automação e IA. Analise o processo manual descrito abaixo e devolva uma sugestão estruturada de diagnóstico.

PROBLEMA RELATADO:
${entrada.problema}

PROCESSO ATUAL:
${entrada.processoAtual}

FERRAMENTAS JÁ UTILIZADAS:
${entrada.ferramentas.length > 0 ? entrada.ferramentas.join(", ") : "não informado"}

OBJETIVO DESEJADO:
${entrada.objetivo.join(", ")}

IMPACTO ESPERADO SE RESOLVIDO:
${entrada.impactoEsperado.join(", ")}

IMPORTANTE: esta análise é uma ferramenta interna de apoio à decisão da equipe da Vecorion.
Você NUNCA deve gerar ou sugerir um orçamento, prazo comercial fechado ou valor de venda — apenas uma estimativa inicial de complexidade técnica, sempre sujeita a revisão humana.

Responda EXCLUSIVAMENTE com um objeto JSON válido, sem markdown, sem texto antes ou depois, no seguinte formato exato:
{
  "gargalos": "string — principais gargalos identificados no processo atual",
  "oportunidades": "string — oportunidades de digitalização identificadas",
  "solucoesSugeridas": "string — solução digital sugerida em linhas gerais",
  "automacoesSugeridas": "string — automações específicas sugeridas",
  "aplicacoesIa": "string — onde IA poderia ser aplicada, se aplicável",
  "tecnologiasSugeridas": ["array de strings com tecnologias/categorias sugeridas"],
  "complexidade": "baixa" | "media" | "alta" | "muito_alta",
  "estimativaInicial": "string — estimativa textual inicial, deixando claro que é preliminar e sujeita a revisão humana",
  "observacoes": "string — observações adicionais relevantes, ou string vazia",
  "perguntasPendentes": ["array de strings com perguntas que a equipe precisa esclarecer com o cliente antes de avançar"]
}`;
}

/**
 * Extrai o JSON da resposta da IA, tolerando que o modelo (mesmo instruído a não
 * fazer isso) devolva o objeto envolto em blocos de código markdown.
 */
function extrairJson(texto: string): unknown {
  const semMarkdown = texto.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(semMarkdown);
  } catch {
    throw new ErroInterno("A IA devolveu uma resposta em formato inesperado.");
  }
}

export async function gerarAnaliseIA(entrada: EntradaAnaliseIA): Promise<ResultadoAnaliseIA> {
  if (!env.anthropicApiKey) {
    log.aviso("integracao_ia_nao_configurada", {});
    throw new ErroIntegracaoNaoConfigurada("API de IA (Anthropic)");
  }

  let respostaHttp: Response;
  try {
    respostaHttp = await fetch(URL_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.anthropicApiKey,
        "anthropic-version": VERSAO_API,
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 1500,
        messages: [{ role: "user", content: montarPrompt(entrada) }],
      }),
    });
  } catch (erroRede) {
    log.erro("falha_de_rede_ao_chamar_ia", {
      mensagem: erroRede instanceof Error ? erroRede.message : String(erroRede),
    });
    throw new ErroInterno("Não foi possível conectar à API de IA.", erroRede);
  }

  if (!respostaHttp.ok) {
    const corpoErro = await respostaHttp.text().catch(() => "");
    log.erro("api_ia_respondeu_erro", { status: respostaHttp.status, corpo: corpoErro.slice(0, 300) });
    throw new ErroInterno("A API de IA recusou a requisição.");
  }

  const corpo = (await respostaHttp.json()) as {
    content?: { type: string; text?: string }[];
  };

  const blocoTexto = corpo.content?.find((bloco) => bloco.type === "text")?.text;
  if (!blocoTexto) {
    log.erro("resposta_ia_sem_texto", {});
    throw new ErroInterno("A IA não devolveu conteúdo de texto.");
  }

  const json = extrairJson(blocoTexto);
  const validado = schemaRespostaAnaliseIA.safeParse(json);

  if (!validado.success) {
    log.erro("resposta_ia_fora_do_formato", { mensagem: validado.error.issues[0]?.message ?? "" });
    throw new ErroInterno("A IA devolveu uma resposta que não corresponde ao formato esperado.");
  }

  log.info("analise_ia_gerada_com_sucesso", { complexidade: validado.data.complexidade });

  return validado.data;
}
