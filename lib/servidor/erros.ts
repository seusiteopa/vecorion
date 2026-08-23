/**
 * Hierarquia de erros do back-end. Toda camada (Aplicação, Domínio, Acesso a Dados,
 * Integrações) lança um destes tipos — nunca um erro genérico — para que a camada
 * mais externa (Route Handler) saiba exatamente como responder ao cliente sem
 * expor detalhe interno (Etapa 7, seção 6: "nunca stack trace, nome de tabela ou
 * detalhe de infraestrutura").
 */

/** Falha do usuário: entrada inválida. Sempre HTTP 400. */
export class ErroValidacao extends Error {
  campo?: string;
  constructor(mensagem: string, campo?: string) {
    super(mensagem);
    this.name = "ErroValidacao";
    this.campo = campo;
  }
}

/** Sessão ausente ou inválida. Sempre HTTP 401. */
export class ErroNaoAutenticado extends Error {
  constructor(mensagem = "Sessão inválida ou expirada.") {
    super(mensagem);
    this.name = "ErroNaoAutenticado";
  }
}

/** Sessão válida, mas sem permissão para a ação. Sempre HTTP 403. */
export class ErroNaoAutorizado extends Error {
  constructor(mensagem = "Você não tem permissão para executar esta ação.") {
    super(mensagem);
    this.name = "ErroNaoAutorizado";
  }
}

/** Recurso não encontrado. Sempre HTTP 404. */
export class ErroNaoEncontrado extends Error {
  constructor(mensagem = "Recurso não encontrado.") {
    super(mensagem);
    this.name = "ErroNaoEncontrado";
  }
}

/** Falha do sistema: banco, storage ou qualquer dependência interna. Sempre HTTP 500. */
export class ErroInterno extends Error {
  causaOriginal?: unknown;
  constructor(mensagem = "Falha interna. Tente novamente em instantes.", causaOriginal?: unknown) {
    super(mensagem);
    this.name = "ErroInterno";
    this.causaOriginal = causaOriginal;
  }
}

/**
 * Integração externa (IA, e-mail) ainda não configurada — usado nesta etapa porque
 * a Etapa 9 prepara a infraestrutura sem implementar as integrações reais (isso é
 * escopo da próxima etapa). Sempre HTTP 503.
 */
export class ErroIntegracaoNaoConfigurada extends Error {
  constructor(nomeIntegracao: string) {
    super(`A integração "${nomeIntegracao}" ainda não foi configurada nesta etapa do projeto.`);
    this.name = "ErroIntegracaoNaoConfigurada";
  }
}

/** Mapeia cada tipo de erro para o código HTTP correspondente. */
export function codigoHttpParaErro(erro: unknown): number {
  if (erro instanceof ErroValidacao) return 400;
  if (erro instanceof ErroNaoAutenticado) return 401;
  if (erro instanceof ErroNaoAutorizado) return 403;
  if (erro instanceof ErroNaoEncontrado) return 404;
  if (erro instanceof ErroIntegracaoNaoConfigurada) return 503;
  return 500;
}

/** Mensagem segura para expor ao cliente — nunca a mensagem crua de um ErroInterno inesperado. */
export function mensagemSeguraParaErro(erro: unknown): string {
  if (
    erro instanceof ErroValidacao ||
    erro instanceof ErroNaoAutenticado ||
    erro instanceof ErroNaoAutorizado ||
    erro instanceof ErroNaoEncontrado ||
    erro instanceof ErroIntegracaoNaoConfigurada
  ) {
    return erro.message;
  }
  return "Falha interna. Tente novamente em instantes.";
}
