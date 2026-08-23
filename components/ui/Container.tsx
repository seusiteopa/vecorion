import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Limita a largura de leitura e aplica padding lateral consistente.
 * Usado dentro de toda seção para manter alinhamento em todas as páginas.
 */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
