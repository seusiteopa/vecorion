import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { exigirSessaoAdmin } from "@/lib/servidor/auth/sessao";
import { atualizarSolicitacao, buscarSolicitacaoDetalhada } from "@/lib/servidor/supabase/consultas";
import { schemaAtualizarSolicitacao } from "@/lib/validacao/solicitacao";
import { validarTransicaoStatus } from "@/lib/dominio/status";
import { ErroValidacao } from "@/lib/servidor/erros";

type Contexto = { params: { id: string } };

/** GET /api/diagnostico/solicitacoes/[id] — administrador autenticado. */
export const GET = comTratamentoDeErro(async (_request: NextRequest, { params }: Contexto) => {
  await exigirSessaoAdmin();

  const solicitacao = await buscarSolicitacaoDetalhada(params.id);

  return NextResponse.json({ solicitacao });
});

/** PATCH /api/diagnostico/solicitacoes/[id] — administrador autenticado. */
export const PATCH = comTratamentoDeErro(async (request: NextRequest, { params }: Contexto) => {
  await exigirSessaoAdmin();

  const corpo = await request.json().catch(() => {
    throw new ErroValidacao("Corpo da requisição inválido.");
  });

  const resultado = schemaAtualizarSolicitacao.safeParse(corpo);
  if (!resultado.success) {
    throw new ErroValidacao(resultado.error.issues[0]?.message ?? "Dados inválidos.");
  }

  if (resultado.data.status) {
    validarTransicaoStatus(resultado.data.status);
  }

  const atualizada = await atualizarSolicitacao(params.id, resultado.data);

  return NextResponse.json({ solicitacao: atualizada });
});
