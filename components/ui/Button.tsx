import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-brand text-paper hover:bg-brand-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/20",
  secondary: "border border-ink text-ink hover:bg-mist hover:-translate-y-0.5",
  ghost: "text-brand hover:text-brand-light underline-offset-4 hover:underline",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-card px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type AsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Omitido ou "a": renderiza um link — comportamento original do componente. */
    as?: "a";
  };

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** "button": renderiza um <button> real, para ações de clique/submit (formulário, painel). */
    as: "button";
  };

type ButtonProps = AsAnchor | AsButton;

/**
 * CTA padrão do site. Por padrão continua sendo um <a> (navegação — WhatsApp, âncora,
 * mailto), comportamento original do Portal. A partir da Etapa 8, também aceita
 * `as="button"` para ações reais de clique/submit (avançar etapa do formulário,
 * salvar, logar) — extensão prevista desde a Etapa 2/9, mesma aparência visual,
 * semântica HTML correta em cada caso.
 */
export default function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_STYLES[variant]} ${className}`;

  if (props.as === "button") {
    const { as: _as, children: _c, variant: _v, className: _cn, ...buttonProps } = props;
    return (
      <button className={classes} {...buttonProps}>
        {children}
      </button>
    );
  }

  const { as: _as, children: _c, variant: _v, className: _cn, ...anchorProps } = props;
  return (
    <a className={classes} {...anchorProps}>
      {children}
    </a>
  );
}
