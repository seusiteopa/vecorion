"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { DADOS_FORMULARIO_VAZIO, type DadosFormulario } from "@/lib/diagnostico/types";
import { TOTAL_ETAPAS, validarEtapa, type ErrosEtapa } from "@/lib/diagnostico/validacao-formulario";
import { COMPONENTES_ETAPAS, TITULOS_ETAPAS } from "./etapas";
import BarraProgresso from "./BarraProgresso";

/**
 * Máquina de estados do wizard. Nesta etapa (Etapa 8 — só front-end), o envio final
 * não fala com nenhum servidor real: guarda os dados em memória e simula uma resposta
 * bem-sucedida, redirecionando para a confirmação — exatamente onde a Etapa 9
 * (back-end) vai plugar a chamada real a POST /api/diagnostico/solicitacoes
 * (contrato já especificado na Etapa 7), sem precisar mudar mais nada nesta tela.
 */
export default function FormularioWizard() {
  const router = useRouter();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dados, setDados] = useState<DadosFormulario>(DADOS_FORMULARIO_VAZIO);
  const [erros, setErros] = useState<ErrosEtapa>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const EtapaComponente = COMPONENTES_ETAPAS[etapaAtual - 1];
  const ehUltimaEtapa = etapaAtual === TOTAL_ETAPAS;

  function atualizar<K extends keyof DadosFormulario>(campo: K, valor: DadosFormulario[K]) {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    if (erros[campo]) {
      setErros((anterior) => ({ ...anterior, [campo]: undefined }));
    }
  }

  function moverFocoParaTitulo() {
    // Foco gerenciado ao trocar de etapa (Etapa 5/9): quem usa leitor de tela
    // não perde a posição ao avançar/voltar.
    requestAnimationFrame(() => tituloRef.current?.focus());
  }

  function avancar() {
    const errosEtapa = validarEtapa(etapaAtual, dados);
    if (Object.keys(errosEtapa).length > 0) {
      setErros(errosEtapa);
      return;
    }
    setErros({});

    if (ehUltimaEtapa) {
      enviarFormulario();
      return;
    }

    setEtapaAtual((e) => e + 1);
    moverFocoParaTitulo();
  }

  function voltar() {
    if (etapaAtual === 1) return;
    setErros({});
    setEtapaAtual((e) => e - 1);
    moverFocoParaTitulo();
  }

  async function enviarFormulario() {
    setEnviando(true);
    setErroEnvio(null);

    try {
      const resposta = await fetch("/api/diagnostico/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.nome,
          empresa: dados.empresa,
          email: dados.email,
          whatsapp: dados.whatsapp,
          cargo: dados.cargo,
          siteEmpresa: dados.siteEmpresa,
          segmento: dados.segmento,
          problema: dados.problema,
          processoAtual: dados.processoAtual,
          faixaPessoas: dados.faixaPessoas,
          pessoasEnvolvidasDescricao: dados.pessoasEnvolvidasDescricao,
          frequencia: dados.frequencia,
          tempoGasto: dados.tempoGasto,
          ferramentas: dados.ferramentas,
          ferramentasManter: dados.ferramentasManter,
          objetivo: dados.objetivo,
          impactoEsperado: dados.impactoEsperado,
          contatoPreferido: dados.contatoPreferido,
          melhorHorario: dados.melhorHorario,
        }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        setErroEnvio(corpo?.erro?.mensagem ?? "Não foi possível enviar seu diagnóstico. Tente novamente.");
        return;
      }

      const { solicitacaoId } = (await resposta.json()) as { solicitacaoId: string };

      // Upload de arquivo é um endpoint separado (contrato da Etapa 7) — enviado
      // depois da solicitação existir, um a um. Falha de upload não impede a
      // confirmação: a solicitação em si já foi registrada com sucesso.
      for (const arquivo of dados.arquivos) {
        const formData = new FormData();
        formData.append("solicitacaoId", solicitacaoId);
        formData.append("arquivo", arquivo);
        await fetch("/api/diagnostico/arquivos", { method: "POST", body: formData }).catch(() => null);
      }

      router.push("/diagnostico/confirmacao");
    } catch {
      setErroEnvio("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="section-y">
      <Container className="mx-auto flex max-w-2xl flex-col gap-8">
        <BarraProgresso etapaAtual={etapaAtual} totalEtapas={TOTAL_ETAPAS} />

        <div>
          <h1 ref={tituloRef} tabIndex={-1} className="text-2xl font-semibold sm:text-3xl focus:outline-none">
            {TITULOS_ETAPAS[etapaAtual - 1]}
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            avancar();
          }}
          className="flex flex-col gap-8"
        >
          <EtapaComponente dados={dados} atualizar={atualizar} erros={erros} />

          {erroEnvio && (
            <p role="alert" className="text-sm font-medium text-danger">
              {erroEnvio}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-ink/10 pt-6">
            <Button as="button" type="button" variant="secondary" onClick={voltar} disabled={etapaAtual === 1 || enviando}>
              ← Voltar
            </Button>

            <Button as="button" type="submit" variant="primary" disabled={enviando}>
              {enviando
                ? "Enviando..."
                : ehUltimaEtapa
                  ? "Enviar meu problema para análise"
                  : "Avançar →"}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
