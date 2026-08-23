import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { exigirSessaoAdmin } from "@/lib/servidor/auth/sessao";
import { criarClienteESolicitacao, listarSolicitacoes } from "@/lib/servidor/supabase/consultas";
import { notificarNovaSolicitacao } from "@/lib/servidor/email/adaptador";
import { schemaCriarSolicitacao } from "@/lib/validacao/solicitacao";
import { ErroValidacao } from "@/lib/servidor/erros";
import { log } from "@/lib/servidor/log";

/**
 * POST /api/diagnostico/solicitacoes — público, sem autenticação (Etapa 7, seção 6).
 * Contrato: recebe todos os campos das 10 etapas do formulário, retorna confirmação
 * + identificador. Fluxo completo conforme Etapa 7, seção 10.
 */
export const POST = comTratamentoDeErro(async (request: NextRequest) => {
  const corpo = await request.json().catch(() => {
    throw new ErroValidacao("Corpo da requisição inválido.");
  });

  const resultado = schemaCriarSolicitacao.safeParse(corpo);
  if (!resultado.success) {
    const primeiroErro = resultado.error.issues[0];
    throw new ErroValidacao(primeiroErro?.message ?? "Dados inválidos.", String(primeiroErro?.path[0] ?? ""));
  }

  const { solicitacaoId, criadoEm } = await criarClienteESolicitacao(resultado.data);

  // Falha de notificação nunca impede a resposta de sucesso — o lead já foi
  // gravado, que é o que importa (Etapa 4, seção 4). O adaptador já captura o
  // próprio erro internamente, mas o try/catch aqui é uma segunda rede de
  // segurança, caso o adaptador mude no futuro e passe a lançar.
  try {
    await notificarNovaSolicitacao({
      solicitacaoId,
      empresa: resultado.data.empresa,
      problemaResumido: resultado.data.problema.slice(0, 200),
    });
  } catch (erroNotificacao) {
    log.aviso("falha_ao_notificar_novo_lead", {
      solicitacaoId,
      mensagem: erroNotificacao instanceof Error ? erroNotificacao.message : String(erroNotificacao),
    });
  }

  return NextResponse.json({ solicitacaoId, criadoEm }, { status: 201 });
});

/**
 * GET /api/diagnostico/solicitacoes — administrador autenticado (Etapa 7, seção 6).
 * Aceita `?status=` para filtrar, espelhando o comportamento já construído no
 * front-end (Etapa 8: TabelaSolicitacoes filtra por parâmetro de URL).
 */
export const GET = comTratamentoDeErro(async (request: NextRequest) => {
  await exigirSessaoAdmin();

  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const solicitacoes = await listarSolicitacoes(status);

  return NextResponse.json({ solicitacoes });
});
