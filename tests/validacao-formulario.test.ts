import { describe, expect, it } from "vitest";
import { DADOS_FORMULARIO_VAZIO } from "@/lib/diagnostico/types";
import { validarEtapa } from "@/lib/diagnostico/validacao-formulario";

describe("validarEtapa — validação client-side do wizard", () => {
  it("etapa 1: exige nome, empresa, e-mail válido e whatsapp", () => {
    const erros = validarEtapa(1, DADOS_FORMULARIO_VAZIO);
    expect(erros.nome).toBeDefined();
    expect(erros.empresa).toBeDefined();
    expect(erros.email).toBeDefined();
    expect(erros.whatsapp).toBeDefined();
  });

  it("etapa 1: rejeita e-mail em formato inválido", () => {
    const dados = { ...DADOS_FORMULARIO_VAZIO, nome: "A", empresa: "B", email: "nao-e-email", whatsapp: "11999999999" };
    const erros = validarEtapa(1, dados);
    expect(erros.email).toBe("Informe um e-mail válido.");
  });

  it("etapa 1: aceita e-mail válido sem erro", () => {
    const dados = { ...DADOS_FORMULARIO_VAZIO, nome: "A", empresa: "B", email: "a@b.com", whatsapp: "11999999999" };
    const erros = validarEtapa(1, dados);
    expect(erros.email).toBeUndefined();
  });

  it("etapa 2: exige problema preenchido", () => {
    expect(validarEtapa(2, DADOS_FORMULARIO_VAZIO).problema).toBeDefined();
    expect(validarEtapa(2, { ...DADOS_FORMULARIO_VAZIO, problema: "x" }).problema).toBeUndefined();
  });

  it("etapa 4: exige faixa de pessoas selecionada", () => {
    expect(validarEtapa(4, DADOS_FORMULARIO_VAZIO).faixaPessoas).toBeDefined();
    expect(validarEtapa(4, { ...DADOS_FORMULARIO_VAZIO, faixaPessoas: "1" }).faixaPessoas).toBeUndefined();
  });

  it("etapa 6: exige ao menos uma ferramenta selecionada", () => {
    expect(validarEtapa(6, DADOS_FORMULARIO_VAZIO).ferramentas).toBeDefined();
    expect(validarEtapa(6, { ...DADOS_FORMULARIO_VAZIO, ferramentas: ["WhatsApp"] }).ferramentas).toBeUndefined();
  });

  it("etapa 7 e 8: exigem seleção múltipla não vazia", () => {
    expect(validarEtapa(7, DADOS_FORMULARIO_VAZIO).objetivo).toBeDefined();
    expect(validarEtapa(8, DADOS_FORMULARIO_VAZIO).impactoEsperado).toBeDefined();
  });

  it("etapa 9: upload é opcional — nunca gera erro mesmo vazio", () => {
    const erros = validarEtapa(9, DADOS_FORMULARIO_VAZIO);
    expect(Object.keys(erros)).toHaveLength(0);
  });

  it("etapa 10: exige canal de contato preferido", () => {
    expect(validarEtapa(10, DADOS_FORMULARIO_VAZIO).contatoPreferido).toBeDefined();
    expect(validarEtapa(10, { ...DADOS_FORMULARIO_VAZIO, contatoPreferido: "whatsapp" }).contatoPreferido).toBeUndefined();
  });

  it("todas as 10 etapas retornam objeto vazio quando os dados obrigatórios estão completos", () => {
    const dadosCompletos = {
      ...DADOS_FORMULARIO_VAZIO,
      nome: "Ana",
      empresa: "Empresa Ana",
      email: "ana@empresa.com",
      whatsapp: "11988887777",
      problema: "Problema real",
      processoAtual: "Processo real",
      faixaPessoas: "2-5" as const,
      frequencia: "diariamente" as const,
      ferramentas: ["Excel"],
      objetivo: ["reduzir_erros" as const],
      impactoEsperado: ["economizar_tempo" as const],
      contatoPreferido: "email" as const,
    };
    for (let etapa = 1; etapa <= 10; etapa++) {
      expect(Object.keys(validarEtapa(etapa, dadosCompletos))).toHaveLength(0);
    }
  });
});
