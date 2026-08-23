import { describe, expect, it } from "vitest";
import {
  schemaAtualizarSolicitacao,
  schemaCriarSolicitacao,
  validarMetadadoArquivo,
} from "@/lib/validacao/solicitacao";

const ENTRADA_VALIDA = {
  nome: "Marina Alves",
  empresa: "Alves Distribuidora",
  email: "marina@alvesdistribuidora.com.br",
  whatsapp: "11988887777",
  problema: "Recebemos pedidos por WhatsApp e copiamos manualmente.",
  processoAtual: "O cliente manda o pedido, um funcionário digita na planilha.",
  faixaPessoas: "6-20",
  frequencia: "varias_vezes_dia",
  ferramentas: ["WhatsApp", "Excel"],
  objetivo: ["automatizar_processo"],
  impactoEsperado: ["economizar_tempo"],
  contatoPreferido: "whatsapp",
};

describe("schemaCriarSolicitacao — validação real de servidor", () => {
  it("aceita entrada completa e válida", () => {
    const resultado = schemaCriarSolicitacao.safeParse(ENTRADA_VALIDA);
    expect(resultado.success).toBe(true);
  });

  it("rejeita corpo vazio", () => {
    const resultado = schemaCriarSolicitacao.safeParse({});
    expect(resultado.success).toBe(false);
  });

  it("rejeita e-mail em formato inválido mesmo que o cliente tenha 'deixado passar'", () => {
    const resultado = schemaCriarSolicitacao.safeParse({ ...ENTRADA_VALIDA, email: "nao-e-email" });
    expect(resultado.success).toBe(false);
  });

  it("rejeita faixaPessoas fora do domínio permitido (proteção contra payload manipulado)", () => {
    const resultado = schemaCriarSolicitacao.safeParse({ ...ENTRADA_VALIDA, faixaPessoas: "999" });
    expect(resultado.success).toBe(false);
  });

  it("rejeita objetivo com valor fora do enum (ex.: injeção de string arbitrária)", () => {
    const resultado = schemaCriarSolicitacao.safeParse({ ...ENTRADA_VALIDA, objetivo: ["<script>alert(1)</script>"] });
    expect(resultado.success).toBe(false);
  });

  it("rejeita ferramentas vazio (mínimo de 1 item)", () => {
    const resultado = schemaCriarSolicitacao.safeParse({ ...ENTRADA_VALIDA, ferramentas: [] });
    expect(resultado.success).toBe(false);
  });

  it("aceita campos opcionais ausentes, preenchendo default vazio", () => {
    const { cargo, siteEmpresa, segmento, ...semOpcionais } = ENTRADA_VALIDA as Record<string, unknown>;
    const resultado = schemaCriarSolicitacao.safeParse(semOpcionais);
    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.cargo).toBe("");
    }
  });

  it("rejeita problema/processoAtual excessivamente longos (proteção contra payload anormal)", () => {
    const textoEnorme = "a".repeat(10000);
    const resultado = schemaCriarSolicitacao.safeParse({ ...ENTRADA_VALIDA, problema: textoEnorme });
    expect(resultado.success).toBe(false);
  });
});

describe("schemaAtualizarSolicitacao", () => {
  it("aceita apenas status", () => {
    expect(schemaAtualizarSolicitacao.safeParse({ status: "em_analise" }).success).toBe(true);
  });

  it("aceita apenas prioridade", () => {
    expect(schemaAtualizarSolicitacao.safeParse({ prioridade: "alta" }).success).toBe(true);
  });

  it("rejeita corpo vazio (nenhum campo para atualizar)", () => {
    expect(schemaAtualizarSolicitacao.safeParse({}).success).toBe(false);
  });

  it("rejeita status fora do domínio permitido", () => {
    expect(schemaAtualizarSolicitacao.safeParse({ status: "cancelado_ilegalmente" }).success).toBe(false);
  });

  it("aceita prioridade explicitamente nula (remover prioridade)", () => {
    expect(schemaAtualizarSolicitacao.safeParse({ prioridade: null }).success).toBe(true);
  });
});

describe("validarMetadadoArquivo", () => {
  it("aceita PDF dentro do limite de tamanho", () => {
    const erros = validarMetadadoArquivo({ type: "application/pdf", size: 1024 * 1024, name: "documento.pdf" });
    expect(erros).toHaveLength(0);
  });

  it("rejeita tipo de arquivo não permitido (ex.: executável)", () => {
    const erros = validarMetadadoArquivo({ type: "application/x-msdownload", size: 1024, name: "virus.exe" });
    expect(erros.length).toBeGreaterThan(0);
  });

  it("rejeita arquivo acima do limite de 10MB", () => {
    const erros = validarMetadadoArquivo({
      type: "image/png",
      size: 11 * 1024 * 1024,
      name: "imagem-grande.png",
    });
    expect(erros.some((e) => e.includes("maior que"))).toBe(true);
  });

  it("rejeita arquivo vazio (0 bytes)", () => {
    const erros = validarMetadadoArquivo({ type: "application/pdf", size: 0, name: "vazio.pdf" });
    expect(erros.some((e) => e.includes("vazio"))).toBe(true);
  });

  it("rejeita nome de arquivo excessivamente longo", () => {
    const nomeEnorme = "a".repeat(300) + ".pdf";
    const erros = validarMetadadoArquivo({ type: "application/pdf", size: 1024, name: nomeEnorme });
    expect(erros.some((e) => e.includes("Nome de arquivo"))).toBe(true);
  });
});
