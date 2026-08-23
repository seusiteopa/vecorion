type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "light" = fundo claro (padrão). "dark" = fundo escuro — usa brand.tint no eyebrow para manter contraste WCAG AA. */
  tone?: "light" | "dark";
  /**
   * Nível semântico do heading. "h2" (padrão) para títulos de seção dentro de uma página.
   * Use "h1" apenas uma vez por página — no título principal de páginas internas
   * (Sobre, Serviços, Portfólio, FAQ, Contato, Política de Privacidade), já que a Home
   * tem seu próprio <h1> no Hero.
   */
  as?: "h1" | "h2";
};

/**
 * Cabeçalho padrão de seção (eyebrow + título + descrição opcional).
 * Reutilizado em todas as seções internas para manter hierarquia consistente.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  as = "h2",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left";
  const eyebrowColor = tone === "dark" ? "text-brand-tint" : "text-brand";
  const Heading = as;

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className={`text-sm font-semibold uppercase tracking-widest ${eyebrowColor}`}>
          {eyebrow}
        </span>
      )}
      <Heading className="text-3xl font-semibold sm:text-4xl">{title}</Heading>
      {description && <p className="text-base opacity-70 sm:text-lg">{description}</p>}
    </div>
  );
}
