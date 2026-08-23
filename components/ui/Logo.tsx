import Image from "next/image";
import { SITE } from "@/lib/constants";

type LogoProps = {
  /** "dark" = ícone azul, texto escuro (fundo claro). "light" = ícone e texto brancos (fundo escuro). */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Usa o SVG vetorizado a partir do logo original do cliente (public/brand/icon-*.svg)
 * junto com o nome em tipografia do site (Sora), em vez de um PNG de lockup fixo.
 * Isso garante nitidez perfeita em qualquer tamanho de tela e permite trocar a cor
 * do texto automaticamente conforme o fundo (claro/escuro), o que um PNG fixo não permite.
 */
export default function Logo({ tone = "dark", className = "" }: LogoProps) {
  const iconSrc = tone === "light" ? "/brand/icon-white.svg" : "/brand/icon-blue.svg";
  const textColor = tone === "light" ? "text-paper" : "text-ink";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src={iconSrc}
        alt=""
        width={32}
        height={16}
        priority
        className="h-5 w-auto sm:h-6"
      />
      <span className={`font-display text-lg font-bold tracking-tight sm:text-xl ${textColor}`}>
        {SITE.name}
      </span>
    </span>
  );
}
