import { describe, expect, it } from "vitest";
import { mapearAnalise, mapearDetalheSolicitacao, mapearListaSolicitacoes } from "@/lib/diagnostico/mapear-supabase";

const CLIENTE_BASE = {
  nome: "Ana",
  empresa: "Empresa Ana",
  email: "ana@empresa.com",
  telefone: "11999999999",
  cargo: "Gerente",
  segmento: "Serviços",
};

describe("mapearListaSolicitacoes — tolera os dois formatos de relação do Supabase", () => {
  it("mapeia corretamente quando 'clientes' vem como objeto único", () => {
    const [resultado] = mapearListaSolicitacoes([
      { id: "1", problema: "P", status: "novo", prioridade: null, criado_em: "2026-01-01", clientes: CLIENTE_BASE },
    ]);
    expect(resultado.cliente.empresa).toBe("Empresa Ana");
  });

  it("mapeia corretamente quando 'clientes' vem como array de um item", () => {
    const [resultado] = mapearListaSolicitacoes([
      { id: "1", problema: "P", status: "novo", prioridade: null, criado_em: "2026-01-01", clientes: [CLIENTE_BASE] },
    ]);
    expect(resultado.cliente.empresa).toBe("Empresa Ana");
  });

  it("não quebra quando 'clientes' vem null (dado órfão inesperado)", () => {
    const [resultado] = mapearListaSolicitacoes([
      { id: "1", problema: "P", status: "novo", prioridade: null, criado_em: "2026-01-01", clientes: null },
    ]);
    expect(resultado.cliente.empresa).toBe("");
  });

  it("mapeia lista vazia sem erro", () => {
    expect(mapearListaSolicitacoes([])).toEqual([]);
  });
});

describe("mapearDetalheSolicitacao — inclui ferramentas vinculadas", () => {
  it("mapeia ferramentas quando a relação aninhada vem como objeto único", () => {
    const resultado = mapearDetalheSolicitacao({
      id: "1",
      problema: "P",
      processo_atual: "PA",
      status: "novo",
      prioridade: null,
      criado_em: "2026-01-01",
      clientes: CLIENTE_BASE,
      faixa_pessoas: "1",
      frequencia: "diariamente",
      objetivo: ["reduzir_erros"],
      impacto_esperado: ["economizar_tempo"],
      solicitacao_ferramentas: [{ ferramentas: { nome: "Excel" } }, { ferramentas: { nome: "WhatsApp" } }],
    });
    expect(resultado.ferramentas).toEqual(["Excel", "WhatsApp"]);
  });

  it("mapeia ferramentas quando a relação aninhada vem como array", () => {
    const resultado = mapearDetalheSolicitacao({
      id: "1",
      problema: "P",
      processo_atual: "PA",
      status: "novo",
      prioridade: null,
      criado_em: "2026-01-01",
      clientes: CLIENTE_BASE,
      faixa_pessoas: "1",
      frequencia: "diariamente",
      objetivo: [],
      impacto_esperado: [],
      solicitacao_ferramentas: [{ ferramentas: [{ nome: "CRM" }] }],
    });
    expect(resultado.ferramentas).toEqual(["CRM"]);
  });

  it("não quebra quando não há nenhuma ferramenta vinculada", () => {
    const resultado = mapearDetalheSolicitacao({
      id: "1",
      problema: "P",
      processo_atual: "PA",
      status: "novo",
      prioridade: null,
      criado_em: "2026-01-01",
      clientes: CLIENTE_BASE,
      faixa_pessoas: "1",
      frequencia: "diariamente",
      objetivo: [],
      impacto_esperado: [],
      solicitacao_ferramentas: null,
    });
    expect(resultado.ferramentas).toEqual([]);
  });
});

describe("mapearAnalise — preenche vazio em vez de quebrar com campo nulo", () => {
  it("converte null em string/array vazios em vez de propagar null para a UI", () => {
    const resultado = mapearAnalise({
      id: "a1",
      solicitacao_id: "s1",
      versao: 1,
      gargalos: null,
      oportunidades: null,
      solucoes_sugeridas: null,
      automacoes_sugeridas: null,
      aplicacoes_ia: null,
      complexidade: null,
      estimativa_inicial: null,
      perguntas_pendentes: null,
      gerado_em: "2026-01-01",
    });
    expect(resultado.gargalos).toBe("");
    expect(resultado.perguntasPendentes).toEqual([]);
    expect(resultado.complexidade).toBe("baixa");
  });
});
