import type { DadosFormulario } from "@/lib/diagnostico/types";
import type { ErrosEtapa } from "@/lib/diagnostico/validacao-formulario";
import {
  BlocoEtapa,
  CampoSelecaoMultipla,
  CampoSelecaoUnica,
  CampoTexto,
  CampoTextArea,
} from "./CamposFormulario";
import CampoUpload from "./CampoUpload";
import {
  CONTATOS_PREFERIDOS,
  FAIXAS_PESSOAS,
  FERRAMENTAS_DISPONIVEIS,
  FREQUENCIAS,
  IMPACTOS,
  OBJETIVOS,
} from "@/lib/diagnostico/constants";

export type PropsEtapa = {
  dados: DadosFormulario;
  atualizar: <K extends keyof DadosFormulario>(campo: K, valor: DadosFormulario[K]) => void;
  erros: ErrosEtapa;
};

export function Etapa1Identificacao({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoTexto label="Nome" obrigatorio value={dados.nome} onChange={(v) => atualizar("nome", v)} erro={erros.nome} />
      <CampoTexto
        label="Empresa"
        obrigatorio
        value={dados.empresa}
        onChange={(v) => atualizar("empresa", v)}
        erro={erros.empresa}
      />
      <CampoTexto
        label="E-mail"
        type="email"
        obrigatorio
        value={dados.email}
        onChange={(v) => atualizar("email", v)}
        erro={erros.email}
      />
      <CampoTexto
        label="WhatsApp"
        type="tel"
        obrigatorio
        value={dados.whatsapp}
        onChange={(v) => atualizar("whatsapp", v)}
        erro={erros.whatsapp}
        placeholder="(11) 91234-5678"
      />
      <CampoTexto label="Cargo" value={dados.cargo} onChange={(v) => atualizar("cargo", v)} />
      <CampoTexto label="Site da empresa" value={dados.siteEmpresa} onChange={(v) => atualizar("siteEmpresa", v)} />
      <CampoTexto label="Segmento" value={dados.segmento} onChange={(v) => atualizar("segmento", v)} />
    </BlocoEtapa>
  );
}

export function Etapa2Problema({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoTextArea
        label="Qual problema você gostaria de resolver?"
        obrigatorio
        value={dados.problema}
        onChange={(v) => atualizar("problema", v)}
        erro={erros.problema}
        ajuda='Explique como você explicaria para alguém da sua equipe. Não utilize termos técnicos se não souber.'
        linhas={6}
      />
    </BlocoEtapa>
  );
}

export function Etapa3ProcessoAtual({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoTextArea
        label="Como esse processo funciona hoje?"
        obrigatorio
        value={dados.processoAtual}
        onChange={(v) => atualizar("processoAtual", v)}
        erro={erros.processoAtual}
        ajuda='Exemplo: "O cliente envia uma solicitação pelo WhatsApp. O funcionário copia as informações para uma planilha, confere os dados e depois envia para o gestor."'
        linhas={6}
      />
    </BlocoEtapa>
  );
}

export function Etapa4Pessoas({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoUnica
        label="Quantas pessoas participam?"
        obrigatorio
        opcoes={FAIXAS_PESSOAS}
        value={dados.faixaPessoas}
        onChange={(v) => atualizar("faixaPessoas", v as DadosFormulario["faixaPessoas"])}
        erro={erros.faixaPessoas}
      />
      <CampoTexto
        label="Quem participa desse processo?"
        value={dados.pessoasEnvolvidasDescricao}
        onChange={(v) => atualizar("pessoasEnvolvidasDescricao", v)}
      />
    </BlocoEtapa>
  );
}

export function Etapa5Frequencia({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoUnica
        label="Com que frequência esse processo acontece?"
        obrigatorio
        opcoes={FREQUENCIAS}
        value={dados.frequencia}
        onChange={(v) => atualizar("frequencia", v as DadosFormulario["frequencia"])}
        erro={erros.frequencia}
      />
      <CampoTexto
        label="Quanto tempo aproximadamente é gasto?"
        value={dados.tempoGasto}
        onChange={(v) => atualizar("tempoGasto", v)}
      />
    </BlocoEtapa>
  );
}

export function Etapa6Ferramentas({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoMultipla
        label="Quais ferramentas vocês usam hoje?"
        obrigatorio
        opcoes={FERRAMENTAS_DISPONIVEIS.map((f) => ({ value: f, label: f }))}
        valores={dados.ferramentas}
        onChange={(v) => atualizar("ferramentas", v)}
        erro={erros.ferramentas}
      />
      <CampoTexto
        label="Existe algum sistema que precisa continuar sendo utilizado?"
        value={dados.ferramentasManter}
        onChange={(v) => atualizar("ferramentasManter", v)}
      />
    </BlocoEtapa>
  );
}

export function Etapa7Objetivo({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoMultipla
        label="O que você gostaria que acontecesse?"
        obrigatorio
        opcoes={OBJETIVOS}
        valores={dados.objetivo}
        onChange={(v) => atualizar("objetivo", v as DadosFormulario["objetivo"])}
        erro={erros.objetivo}
      />
    </BlocoEtapa>
  );
}

export function Etapa8Impacto({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoMultipla
        label="Se esse problema fosse resolvido, o que melhoraria?"
        obrigatorio
        opcoes={IMPACTOS}
        valores={dados.impactoEsperado}
        onChange={(v) => atualizar("impactoEsperado", v as DadosFormulario["impactoEsperado"])}
        erro={erros.impactoEsperado}
      />
    </BlocoEtapa>
  );
}

export function Etapa9Arquivos({ dados, atualizar }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoUpload arquivos={dados.arquivos} onChange={(v) => atualizar("arquivos", v)} />
    </BlocoEtapa>
  );
}

export function Etapa10Contato({ dados, atualizar, erros }: PropsEtapa) {
  return (
    <BlocoEtapa>
      <CampoSelecaoUnica
        label="Como você prefere ser contatado?"
        obrigatorio
        opcoes={CONTATOS_PREFERIDOS}
        value={dados.contatoPreferido}
        onChange={(v) => atualizar("contatoPreferido", v as DadosFormulario["contatoPreferido"])}
        erro={erros.contatoPreferido}
      />
      <CampoTexto label="Qual é o melhor horário?" value={dados.melhorHorario} onChange={(v) => atualizar("melhorHorario", v)} />
    </BlocoEtapa>
  );
}

export const TITULOS_ETAPAS = [
  "Identificação",
  "Qual é o problema?",
  "Processo atual",
  "Pessoas envolvidas",
  "Frequência",
  "Ferramentas",
  "Objetivo",
  "Impacto esperado",
  "Arquivos",
  "Contato",
];

export const COMPONENTES_ETAPAS = [
  Etapa1Identificacao,
  Etapa2Problema,
  Etapa3ProcessoAtual,
  Etapa4Pessoas,
  Etapa5Frequencia,
  Etapa6Ferramentas,
  Etapa7Objetivo,
  Etapa8Impacto,
  Etapa9Arquivos,
  Etapa10Contato,
];
