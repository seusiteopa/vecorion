"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em ms, útil para escalonar itens de uma lista (stagger). */
  delay?: number;
};

/**
 * Microinteração de entrada suave (fade + slide-up) quando a seção entra na viewport.
 * Implementado com IntersectionObserver puro (sem framer-motion) para manter o
 * bundle leve, conforme decisão de arquitetura das etapas anteriores.
 * Usuários com "prefers-reduced-motion" não são afetados: o CSS global (globals.css)
 * já neutraliza a duração das animações nesse caso.
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={`${visible ? "animate-fade-up" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
