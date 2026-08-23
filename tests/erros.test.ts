import { describe, expect, it } from "vitest";
import {
  ErroIntegracaoNaoConfigurada,
  ErroInterno,
  ErroNaoAutenticado,
  ErroNaoAutorizado,
  ErroNaoEncontrado,
  ErroValidacao,
  codigoHttpParaErro,
  mensagemSeguraParaErro,
} from "@/lib/servidor/erros";

describe("mapeamento de erros para código HTTP", () => {
  it("ErroValidacao -> 400", () => {
    expect(codigoHttpParaErro(new ErroValidacao("x"))).toBe(400);
  });

  it("ErroNaoAutenticado -> 401", () => {
    expect(codigoHttpParaErro(new ErroNaoAutenticado())).toBe(401);
  });

  it("ErroNaoAutorizado -> 403", () => {
    expect(codigoHttpParaErro(new ErroNaoAutorizado())).toBe(403);
  });

  it("ErroNaoEncontrado -> 404", () => {
    expect(codigoHttpParaErro(new ErroNaoEncontrado())).toBe(404);
  });

  it("ErroIntegracaoNaoConfigurada -> 503", () => {
    expect(codigoHttpParaErro(new ErroIntegracaoNaoConfigurada("IA"))).toBe(503);
  });

  it("ErroInterno -> 500", () => {
    expect(codigoHttpParaErro(new ErroInterno())).toBe(500);
  });

  it("erro desconhecido/inesperado -> 500 (nunca vaza sem código)", () => {
    expect(codigoHttpParaErro(new Error("algo genérico"))).toBe(500);
    expect(codigoHttpParaErro("nem é um Error")).toBe(500);
    expect(codigoHttpParaErro(null)).toBe(500);
  });
});

describe("mensagem segura exposta ao cliente — nunca vaza detalhe interno", () => {
  it("erros esperados (validação, auth, etc.) expõem sua própria mensagem", () => {
    expect(mensagemSeguraParaErro(new ErroValidacao("Informe o nome."))).toBe("Informe o nome.");
    expect(mensagemSeguraParaErro(new ErroNaoEncontrado("Solicitação não encontrada."))).toBe(
      "Solicitação não encontrada.",
    );
  });

  it("ErroInterno com causa sensível NUNCA expõe a causa original ao cliente", () => {
    const causaSensivel = new Error("relation \"solicitacoes\" does not exist — segredo de infraestrutura");
    const erro = new ErroInterno("Falha interna. Tente novamente em instantes.", causaSensivel);
    const mensagem = mensagemSeguraParaErro(erro);
    expect(mensagem).not.toContain("relation");
    expect(mensagem).not.toContain("segredo");
    expect(mensagem).toBe("Falha interna. Tente novamente em instantes.");
  });

  it("erro completamente inesperado (nem um dos tipos conhecidos) vira mensagem genérica", () => {
    const mensagem = mensagemSeguraParaErro(new TypeError("undefined is not a function, stack trace aqui"));
    expect(mensagem).toBe("Falha interna. Tente novamente em instantes.");
    expect(mensagem).not.toContain("stack trace");
  });
});
