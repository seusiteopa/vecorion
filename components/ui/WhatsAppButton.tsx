import { whatsappHref } from "@/lib/constants";
import Button from "./Button";

type WhatsAppButtonProps = {
  message?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: React.ReactNode;
};

/**
 * Único canal de conversão do site (decisão da Etapa 3: um CTA repetido,
 * não diluído entre várias formas de contato). Abre o WhatsApp direto,
 * sem armazenar nenhum dado.
 */
export default function WhatsAppButton({
  message,
  variant = "primary",
  className,
  children = "Falar no WhatsApp",
}: WhatsAppButtonProps) {
  return (
    <Button
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      className={className}
    >
      {children}
    </Button>
  );
}
