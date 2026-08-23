"use client";

import { ReactNode, useId } from "react";

/**
 * Conjunto de campos reutilizáveis do formulário de 10 etapas. Todos seguem o mesmo
 * padrão de acessibilidade: label associado via `htmlFor`/`id`, erro anunciado via
 * `aria-describedby` + `role="alert"`, nunca comunicado só por cor (Etapa 5/9).
 * A cor de erro (`danger`) é a única exceção controlada à paleta azul/preto/branco.
 */

type CampoBaseProps = {
  label: string;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
};

function RotuloCampo({
  htmlFor,
  label,
  obrigatorio,
  ajuda,
  ajudaId,
}: {
  htmlFor: string;
  label: string;
  obrigatorio?: boolean;
  ajuda?: string;
  ajudaId?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {obrigatorio && <span className="text-danger"> *</span>}
      </label>
      {ajuda && (
        <p id={ajudaId} className="text-sm text-ink/60">
          {ajuda}
        </p>
      )}
    </div>
  );
}

function MensagemErro({ id, erro }: { id: string; erro?: string }) {
  if (!erro) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-danger">
      {erro}
    </p>
  );
}

type CampoTextoProps = CampoBaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password";
};

export function CampoTexto({
  label,
  value,
  onChange,
  erro,
  ajuda,
  obrigatorio,
  placeholder,
  type = "text",
}: CampoTextoProps) {
  const id = useId();
  const erroId = `${id}-erro`;
  const ajudaId = `${id}-ajuda`;

  return (
    <div className="flex flex-col gap-2">
      <RotuloCampo htmlFor={id} label={label} obrigatorio={obrigatorio} ajuda={ajuda} ajudaId={ajudaId} />
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? erroId : ajuda ? ajudaId : undefined}
        className={`rounded-card border px-4 py-3 text-sm text-ink transition-colors focus-visible:outline-2 ${
          erro ? "border-danger" : "border-ink/15 focus:border-brand"
        }`}
      />
      <MensagemErro id={erroId} erro={erro} />
    </div>
  );
}

type CampoTextAreaProps = CampoBaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  linhas?: number;
};

export function CampoTextArea({
  label,
  value,
  onChange,
  erro,
  ajuda,
  obrigatorio,
  placeholder,
  linhas = 5,
}: CampoTextAreaProps) {
  const id = useId();
  const erroId = `${id}-erro`;
  const ajudaId = `${id}-ajuda`;

  return (
    <div className="flex flex-col gap-2">
      <RotuloCampo htmlFor={id} label={label} obrigatorio={obrigatorio} ajuda={ajuda} ajudaId={ajudaId} />
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        rows={linhas}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? erroId : ajuda ? ajudaId : undefined}
        className={`rounded-card border px-4 py-3 text-sm text-ink transition-colors focus-visible:outline-2 ${
          erro ? "border-danger" : "border-ink/15 focus:border-brand"
        }`}
      />
      <MensagemErro id={erroId} erro={erro} />
    </div>
  );
}

type OpcaoUnica = { value: string; label: string };

type CampoSelecaoUnicaProps = CampoBaseProps & {
  opcoes: OpcaoUnica[];
  value: string;
  onChange: (value: string) => void;
};

/** Cartões clicáveis de escolha única (radio group semântico, sem parecer um <select>). */
export function CampoSelecaoUnica({
  label,
  opcoes,
  value,
  onChange,
  erro,
  obrigatorio,
}: CampoSelecaoUnicaProps) {
  const id = useId();
  const erroId = `${id}-erro`;

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-ink">
        {label}
        {obrigatorio && <span className="text-danger"> *</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-describedby={erro ? erroId : undefined}>
        {opcoes.map((opcao) => {
          const selecionado = value === opcao.value;
          return (
            <label
              key={opcao.value}
              className={`flex cursor-pointer items-center gap-3 rounded-card border px-4 py-3 text-sm transition-colors ${
                selecionado ? "border-brand bg-brand-50" : "border-ink/15 hover:border-brand/40"
              }`}
            >
              <input
                type="radio"
                name={id}
                value={opcao.value}
                checked={selecionado}
                onChange={() => onChange(opcao.value)}
                className="h-4 w-4 accent-brand"
              />
              {opcao.label}
            </label>
          );
        })}
      </div>
      <MensagemErro id={erroId} erro={erro} />
    </fieldset>
  );
}

type CampoSelecaoMultiplaProps = CampoBaseProps & {
  opcoes: OpcaoUnica[];
  valores: string[];
  onChange: (valores: string[]) => void;
};

/** Seleção múltipla (objetivo, impacto, ferramentas) — reaproveitável em qualquer etapa que precise. */
export function CampoSelecaoMultipla({
  label,
  opcoes,
  valores,
  onChange,
  erro,
  obrigatorio,
}: CampoSelecaoMultiplaProps) {
  const id = useId();
  const erroId = `${id}-erro`;

  function alternar(valor: string) {
    if (valores.includes(valor)) {
      onChange(valores.filter((v) => v !== valor));
    } else {
      onChange([...valores, valor]);
    }
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-ink">
        {label}
        {obrigatorio && <span className="text-danger"> *</span>}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2" aria-describedby={erro ? erroId : undefined}>
        {opcoes.map((opcao) => {
          const selecionado = valores.includes(opcao.value);
          return (
            <label
              key={opcao.value}
              className={`flex cursor-pointer items-center gap-3 rounded-card border px-4 py-3 text-sm transition-colors ${
                selecionado ? "border-brand bg-brand-50" : "border-ink/15 hover:border-brand/40"
              }`}
            >
              <input
                type="checkbox"
                checked={selecionado}
                onChange={() => alternar(opcao.value)}
                className="h-4 w-4 rounded accent-brand"
              />
              {opcao.label}
            </label>
          );
        })}
      </div>
      <MensagemErro id={erroId} erro={erro} />
    </fieldset>
  );
}

export function BlocoEtapa({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
