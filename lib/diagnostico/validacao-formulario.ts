import type { DadosFormulario } from "./types";

export type ErrosEtapa = Partial<Record<keyof DadosFormulario, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validação por etapa — roda no cliente para dar feedback imediato (Etapa 5/9:
 * "erro aparece assim que o usuário sai do campo, não só ao tentar avançar").
 * Esta validação NÃO substitui a validação de servidor que será implementada
 * junto ao back-end (Etapa 2/7) — é só a primeira linha de defesa, focada em UX.
 */
export function validarEtapa(etapa: number, dados: DadosFormulario): ErrosEtapa {
  const erros: ErrosEtapa = {};

  switch (etapa) {
    case 1:
      if (!dados.nome.trim()) erros.nome = "Informe seu nome.";
      if (!dados.empresa.trim()) erros.empresa = "Informe o nome da empresa.";
      if (!dados.email.trim()) {
        erros.email = "Informe um e-mail.";
      } else if (!EMAIL_REGEX.test(dados.email)) {
        erros.email = "Informe um e-mail válido.";
      }
      if (!dados.whatsapp.trim()) erros.whatsapp = "Informe um número de WhatsApp.";
      break;

    case 2:
      if (!dados.problema.trim()) erros.problema = "Descreva o problema que você gostaria de resolver.";
      break;

    case 3:
      if (!dados.processoAtual.trim()) erros.processoAtual = "Descreva como o processo funciona hoje.";
      break;

    case 4:
      if (!dados.faixaPessoas) erros.faixaPessoas = "Selecione quantas pessoas participam.";
      break;

    case 5:
      if (!dados.frequencia) erros.frequencia = "Selecione a frequência do processo.";
      break;

    case 6:
      if (dados.ferramentas.length === 0) erros.ferramentas = "Selecione ao menos uma ferramenta, ou \"Outro\".";
      break;

    case 7:
      if (dados.objetivo.length === 0) erros.objetivo = "Selecione ao menos um objetivo.";
      break;

    case 8:
      if (dados.impactoEsperado.length === 0) erros.impactoEsperado = "Selecione ao menos um impacto esperado.";
      break;

    case 9:
      // Upload é opcional (Etapa 3/7) — nenhuma validação obrigatória aqui.
      break;

    case 10:
      if (!dados.contatoPreferido) erros.contatoPreferido = "Selecione como prefere ser contatado.";
      break;
  }

  return erros;
}

export const TOTAL_ETAPAS = 10;
