import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { registrarArquivoDoBriefing } from "@/lib/servidor/supabase/consultas-servicos";
import { validarMetadadoArquivo } from "@/lib/validacao/solicitacao";
import { ErroValidacao } from "@/lib/servidor/erros";

/**
 * POST /api/servicos/arquivos — público, mesma regra de validação de
 * arquivo do fluxo de Diagnóstico (`validarMetadadoArquivo`, reaproveitada
 * — "a validação do navegador nunca é a única linha de defesa" continua
 * valendo aqui). Diferente daquele fluxo: falha aqui não derruba a
 * criação do briefing (que já aconteceu antes, ver `registrarArquivoDoBriefing`)
 * — o cliente só perde o anexo, não o registro do pedido em si.
 */
export const POST = comTratamentoDeErro(async (request: NextRequest) => {
  const formData = await request.formData().catch(() => {
    throw new ErroValidacao("Requisição multipart inválida.");
  });

  const briefingId = formData.get("briefingId");
  const arquivo = formData.get("arquivo");

  if (typeof briefingId !== "string" || !briefingId) {
    throw new ErroValidacao("Informe o identificador do briefing.", "briefingId");
  }
  if (!(arquivo instanceof File)) {
    throw new ErroValidacao("Nenhum arquivo enviado.", "arquivo");
  }

  const erros = validarMetadadoArquivo({ type: arquivo.type, size: arquivo.size, name: arquivo.name });
  if (erros.length > 0) {
    throw new ErroValidacao(erros[0]);
  }

  const bytes = await arquivo.arrayBuffer();
  await registrarArquivoDoBriefing(briefingId, { nome: arquivo.name, tipo: arquivo.type, bytes });

  return NextResponse.json({ ok: true }, { status: 201 });
});
