import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { buscarServicoPublicoPorId, criarLeadEBriefingDoServico } from "@/lib/servidor/supabase/consultas-servicos";
import { schemaCriarBriefingServico } from "@/lib/validacao/servico-briefing";
import { ErroValidacao, ErroNaoEncontrado } from "@/lib/servidor/erros";

/**
 * POST /api/servicos/[id]/briefing — público, sem autenticação.
 * Cria um Lead + Briefing reais na Plataforma Vecorion (banco
 * compartilhado) a partir do briefing preenchido pelo cliente para um
 * serviço específico do catálogo.
 */
export const POST = comTratamentoDeErro(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const corpo = await request.json().catch(() => {
      throw new ErroValidacao("Corpo da requisição inválido.");
    });

    const resultado = schemaCriarBriefingServico.safeParse(corpo);
    if (!resultado.success) {
      const primeiroErro = resultado.error.issues[0];
      throw new ErroValidacao(primeiroErro?.message ?? "Dados inválidos.", String(primeiroErro?.path[0] ?? ""));
    }

    const servico = await buscarServicoPublicoPorId(id);
    if (!servico) {
      throw new ErroNaoEncontrado("Serviço não encontrado ou não está mais disponível.");
    }

    const { leadId, briefingId } = await criarLeadEBriefingDoServico(servico, resultado.data);

    return NextResponse.json({ leadId, briefingId }, { status: 201 });
  },
);
