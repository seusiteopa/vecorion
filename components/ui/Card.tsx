import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** "paper" = fundo branco (usado sobre bg-mist). "mist" = fundo cinza claro (usado sobre bg-paper). */
  surface?: "paper" | "mist";
};

const SURFACE_STYLES: Record<NonNullable<CardProps["surface"]>, string> = {
  paper: "bg-paper",
  mist: "bg-mist",
};

/**
 * Card com hover padrão (elevação + sombra), extraído para eliminar a repetição
 * das mesmas classes em HowItWorks, ServicesOverview, Portfolio e Serviços.
 */
export default function Card({ children, surface = "paper", className = "", ...rest }: CardProps) {
  return (
    <div
      className={`flex h-full flex-col gap-3 rounded-card border border-black/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5 ${SURFACE_STYLES[surface]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
