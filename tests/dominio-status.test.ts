import { describe, expect, it } from "vitest";
import { STATUS_INICIAL, STATUS_VALIDOS, validarTransicaoStatus } from "@/lib/dominio/status";
import { ErroValidacao } from "@/lib/servidor/erros";

describe("regras de domínio — status da solicitação", () => {
  it("status inicial é sempre 'novo'", () => {
    expect(STATUS_INICIAL).toBe("novo");
  });

  it("aceita todos os 5 status válidos do funil", () => {
    for (const status of STATUS_VALIDOS) {
      expect(() => validarTransicaoStatus(status)).not.toThrow();
    }
  });

  it("rejeita status inventado/inválido", () => {
    expect(() => validarTransicaoStatus("cancelado")).toThrow(ErroValidacao);
  });

  it("rejeita string vazia como status", () => {
    expect(() => validarTransicaoStatus("")).toThrow(ErroValidacao);
  });

  it("mensagem de erro nunca expõe detalhe interno, só o valor recebido", () => {
    try {
      validarTransicaoStatus("xyz");
      throw new Error("deveria ter lançado");
    } catch (erro) {
      expect(erro).toBeInstanceOf(ErroValidacao);
      expect((erro as ErroValidacao).message).toContain("xyz");
    }
  });
});
