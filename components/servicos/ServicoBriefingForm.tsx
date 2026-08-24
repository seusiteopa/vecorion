"use client";

import { useState, type FormEvent } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ServicoBriefingFormProps {
  servicoId: string;
  servicoNome: string;
}

const TAMANHO_MAXIMO_MB = 15;

export default function ServicoBriefingForm({ servicoId, servicoNome }: ServicoBriefingFormProps) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const dadosFormulario = new FormData(evento.currentTarget);
    const arquivo = dadosFormulario.get("arquivo") as File | null;

    try {
      const resposta = await fetch(`/api/servicos/${servicoId}/briefing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: String(dadosFormulario.get("nome") ?? ""),
          empresa: String(dadosFormulario.get("empresa") ?? ""),
          email: String(dadosFormulario.get("email") ?? ""),
          telefone: String(dadosFormulario.get("telefone") ?? ""),
          descricaoProjeto: String(dadosFormulario.get("descricaoProjeto") ?? ""),
          requisitos: String(dadosFormulario.get("requisitos") ?? ""),
          linkReferencia: String(dadosFormulario.get("linkReferencia") ?? ""),
        }),
      });

      const corpo = await resposta.json();

      if (!resposta.ok) {
        setErro(corpo?.erro?.mensagem ?? "Não foi possível enviar seu briefing. Tente novamente.");
        return;
      }

      // Upload do arquivo é uma segunda chamada, best-effort: se falhar,
      // o briefing já foi criado e o vendedor já pode assumir o lead —
      // não faz sentido bloquear a confirmação por causa de um anexo.
      if (arquivo && arquivo.size > 0) {
        const dadosArquivo = new FormData();
        dadosArquivo.set("briefingId", corpo.briefingId);
        dadosArquivo.set("arquivo", arquivo);
        await fetch("/api/servicos/arquivos", { method: "POST", body: dadosArquivo }).catch(() => {
          // silenciosamente ignorado — ver comentário acima
        });
      }

      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar seu briefing. Verifique sua conexão e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <Card surface="mist" className="items-center gap-3 p-10 text-center">
        <h2 className="text-xl font-semibold">Briefing recebido!</h2>
        <p className="max-w-md text-sm text-ink/70">
          Obrigado por contar sobre o seu projeto de <strong>{servicoNome}</strong>. Nossa equipe vai analisar e
          entrar em contato em breve.
        </p>
      </Card>
    );
  }

  return (
    <Card surface="mist" className="gap-6 p-8">
      <form className="flex flex-col gap-5" onSubmit={aoEnviar}>
        {erro && (
          <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label="Seu nome" name="nome" required />
          <Campo label="Empresa" name="empresa" />
          <Campo label="E-mail" name="email" type="email" required />
          <Campo label="WhatsApp" name="telefone" type="tel" required />
        </div>

        <CampoTextarea
          label="Descreva o seu projeto"
          name="descricaoProjeto"
          required
          minLength={10}
          placeholder="Conte o que você precisa, pra quando, e qualquer detalhe importante..."
        />

        <CampoTextarea
          label="Requisitos específicos (opcional)"
          name="requisitos"
          placeholder="Alguma referência de estilo, funcionalidade obrigatória, restrição técnica..."
        />

        <Campo
          label="Link de referência (opcional)"
          name="linkReferencia"
          type="url"
          placeholder="https://exemplo.com.br"
        />

        <div>
          <label htmlFor="arquivo" className="mb-1.5 block text-sm font-medium text-ink">
            Anexo (opcional) <span className="font-normal text-ink/50">— até {TAMANHO_MAXIMO_MB}MB</span>
          </label>
          <input
            id="arquivo"
            name="arquivo"
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-card file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
          />
        </div>

        <Button as="button" type="submit" variant="primary" disabled={enviando} className="w-full sm:w-auto">
          {enviando ? "Enviando..." : "Enviar briefing"}
        </Button>
      </form>
    </Card>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-card border border-black/10 bg-paper px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}

function CampoTextarea({
  label,
  name,
  required,
  minLength,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        minLength={minLength}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-card border border-black/10 bg-paper px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}
