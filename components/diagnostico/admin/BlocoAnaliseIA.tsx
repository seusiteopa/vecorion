"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Analise } from "@/lib/diagnostico/types";

type BlocoAnaliseIAProps = {
  solicitacaoId: string;
  analiseExistente?: Analise;
};

/**
 * "Analisar com IA" nunca decide sozinho — regra de negócio fixada desde a Etapa 2
 * e reforçada aqui na própria interface. Chama o endpoint real (Etapa 9), que por
 * sua vez chama o adaptador de IA — implementado de verdade desde a Etapa 10.
 * Sem `ANTHROPIC_API_KEY` configurada no ambiente, a resposta esperada é um 503
 * claro, tratado abaixo como "chave não configurada", não como um bug.
 */
export default function BlocoAnaliseIA({ solicitacaoId, analiseExistente }: BlocoAnaliseIAProps) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [mensagemIndisponivel, setMensagemIndisponivel] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function acionarAnalise() {
    setCarregando(true);
    setErro(null);
    setMensagemIndisponivel(null);

    try {
      const resposta = await fetch("/api/diagnostico/analises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solicitacaoId }),
      });

      if (resposta.status === 503) {
        const corpo = await resposta.json().catch(() => null);
        setMensagemIndisponivel(
          corpo?.erro?.mensagem ??
            "A chave de API da IA ainda não foi configurada neste ambiente. Configure ANTHROPIC_API_KEY para habilitar a análise.",
        );
        return;
      }

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        setErro(corpo?.erro?.mensagem ?? "Não foi possível gerar a análise.");
        return;
      }

      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-card border border-brand/20 bg-brand-50 p-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand">
          Sugestão da IA — revisão humana necessária
        </span>
        <p className="text-sm text-ink/60">
          A análise é uma ferramenta interna de apoio à decisão. Ela nunca gera nem envia
          orçamento automaticamente.
        </p>
      </div>

      {analiseExistente ? (
        <div className="flex flex-col gap-3 text-sm text-ink">
          <Campo titulo="Gargalos" texto={analiseExistente.gargalos} />
          <Campo titulo="Oportunidades" texto={analiseExistente.oportunidades} />
          <Campo titulo="Soluções sugeridas" texto={analiseExistente.solucoesSugeridas} />
          <Campo titulo="Automações sugeridas" texto={analiseExistente.automacoesSugeridas} />
          <Campo titulo="Aplicações de IA" texto={analiseExistente.aplicacoesIa} />
          <Campo titulo="Complexidade" texto={analiseExistente.complexidade} />
          <Campo titulo="Estimativa inicial" texto={analiseExistente.estimativaInicial} />
          {analiseExistente.perguntasPendentes.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Perguntas pendentes</span>
              <ul className="list-inside list-disc text-ink/70">
                {analiseExistente.perguntasPendentes.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <Button as="button" type="button" variant="primary" onClick={acionarAnalise} disabled={carregando} className="self-start">
            {carregando ? "Analisando..." : "Analisar com IA"}
          </Button>
          {mensagemIndisponivel && <p className="text-sm text-ink/60">{mensagemIndisponivel}</p>}
          {erro && (
            <p role="alert" className="text-sm font-medium text-danger">
              {erro}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Campo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-semibold">{titulo}</span>
      <span className="text-ink/70">{texto}</span>
    </div>
  );
}
