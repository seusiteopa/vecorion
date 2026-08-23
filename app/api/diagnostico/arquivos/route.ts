import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { registrarArquivo, solicitacaoExiste } from "@/lib/servidor/supabase/consultas";
import { validarMetadadoArquivo } from "@/lib/validacao/solicitacao";
import { ErroValidacao, ErroNaoEncontrado } from "@/lib/servidor/erros";

/**
 * POST /api/diagnostico/arquivos — público, mas sempre vinculado a uma solicitação
 * já existente (Etapa 7, seção 6). Recebe `multipart/form-data` com o arquivo
 * binário e o identificador da solicitação; validação de tipo/tamanho é repetida
 * aqui mesmo já tendo sido feita no cliente (Etapa 8) — Etapa 2/7: "a validação do
 * navegador nunca é a única linha de defesa".
 */
export const POST = comTratamentoDeErro(async (request: NextRequest) => {
  const formData = await request.formData().catch(() => {
    throw new ErroValidacao("Requisição multipart inválida.");
  });

  const solicitacaoId = formData.get("solicitacaoId");
  const arquivo = formData.get("arquivo");

  if (typeof solicitacaoId !== "string" || !solicitacaoId) {
    throw new ErroValidacao("Informe o identificador da solicitação.", "solicitacaoId");
  }

  if (!(arquivo instanceof File)) {
    throw new ErroValidacao("Nenhum arquivo enviado.", "arquivo");
  }

  const erros = validarMetadadoArquivo({ type: arquivo.type, size: arquivo.size, name: arquivo.name });
  if (erros.length > 0) {
    throw new ErroValidacao(erros[0]);
  }

  if (!(await solicitacaoExiste(solicitacaoId))) {
    throw new ErroNaoEncontrado("Solicitação não encontrada.");
  }

  const bytes = await arquivo.arrayBuffer();

  const registrado = await registrarArquivo(solicitacaoId, {
    nome: arquivo.name,
    tipo: arquivo.type,
    tamanho: arquivo.size,
    bytes,
  });

  return NextResponse.json(registrado, { status: 201 });
});
