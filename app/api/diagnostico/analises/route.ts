import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { exigirSessaoAdmin } from "@/lib/servidor/auth/sessao";
import { buscarSolicitacaoDetalhada, registrarAnalise } from "@/lib/servidor/supabase/consultas";
import { gerarAnaliseIA } from "@/lib/servidor/ia/adaptador";
import { ErroValidacao } from "@/lib/servidor/erros";

/**
 * POST /api/diagnostico/analises — administrador autenticado, acionamento manual
 * (nunca automático — regra de negócio fixada desde a Etapa 2). Este endpoint já
 * está com a orquestração completa (buscar solicitação → montar entrada → chamar
 * IA → persistir resultado), mas a chamada real à IA ainda não existe (adaptador
 * da Etapa 9 lança `ErroIntegracaoNaoConfigurada`, mapeado para HTTP 503 pelo
 * `comTratamentoDeErro`) — a Etapa 10 conecta a chamada real sem precisar tocar
 * neste arquivo.
 */
export const POST = comTratamentoDeErro(async (request: NextRequest) => {
  const perfil = await exigirSessaoAdmin();

  const corpo = await request.json().catch(() => {
    throw new ErroValidacao("Corpo da requisição inválido.");
  });

  const solicitacaoId = corpo?.solicitacaoId;
  if (typeof solicitacaoId !== "string" || !solicitacaoId) {
    throw new ErroValidacao("Informe o identificador da solicitação.", "solicitacaoId");
  }

  const solicitacao = await buscarSolicitacaoDetalhada(solicitacaoId);

  // Nunca envia e-mail/telefone do lead à IA (Etapa 4, seção 5) — a entrada é
  // montada explicitamente aqui, campo a campo, nunca repassando o objeto inteiro.
  const solicitacaoComFerramentas = solicitacao as unknown as {
    solicitacao_ferramentas?: { ferramentas: { nome: string } | { nome: string }[] }[];
  };
  const ferramentas = (solicitacaoComFerramentas.solicitacao_ferramentas ?? [])
    .map((v) => (Array.isArray(v.ferramentas) ? v.ferramentas[0]?.nome : v.ferramentas.nome))
    .filter((nome): nome is string => Boolean(nome));

  const resultado = await gerarAnaliseIA({
    problema: solicitacao.problema,
    processoAtual: solicitacao.processo_atual,
    ferramentas,
    objetivo: solicitacao.objetivo,
    impactoEsperado: solicitacao.impacto_esperado,
  });

  const analise = await registrarAnalise(solicitacaoId, perfil.userId, resultado);

  return NextResponse.json({ analise }, { status: 201 });
});
