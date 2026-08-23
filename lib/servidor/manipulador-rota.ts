import { NextResponse } from "next/server";
import { codigoHttpParaErro, mensagemSeguraParaErro } from "./erros";
import { log } from "./log";

/**
 * Envolve a lógica de um Route Handler com tratamento de erro consistente. Toda
 * resposta de erro tem o mesmo formato (`{ erro: { mensagem } }`) e o mesmo código
 * HTTP, mapeado a partir do tipo de erro lançado pela camada de Aplicação/Domínio/
 * Acesso a Dados — nenhum Route Handler precisa reimplementar isso (Etapa 7, seção 4:
 * "resposta de erro segue o mesmo formato... nunca expõe detalhe interno").
 */
export function comTratamentoDeErro<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (erro) {
      const codigo = codigoHttpParaErro(erro);
      const mensagem = mensagemSeguraParaErro(erro);

      if (codigo >= 500) {
        log.erro("erro_nao_tratado_em_rota", {
          mensagem: erro instanceof Error ? erro.message : String(erro),
        });
      }

      return NextResponse.json({ erro: { mensagem } }, { status: codigo });
    }
  };
}
