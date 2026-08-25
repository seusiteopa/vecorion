import { whatsappHref } from "@/lib/constants";

/**
 * Substitui os ~9 botões "Falar no WhatsApp" espalhados pelo site (Hero,
 * Header, MobileMenu, CtaBanner, HowItWorks, portfolio, contato,
 * not-found, diagnóstico/confirmação) por um único ponto de contato,
 * sempre visível, em toda página — decisão do dono do produto.
 *
 * Fica de fora do fluxo normal da página (`fixed`), então um único
 * `<WhatsAppFloating />` no layout raiz (`app/layout.tsx`) já cobre o
 * site inteiro — nenhuma página precisa importar isto individualmente.
 */
export default function WhatsAppFloating() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-paper shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.85.505 3.638 1.464 5.207L2 22l4.943-1.437A9.936 9.936 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.09c-1.664 0-3.28-.454-4.69-1.313l-.336-.2-3.111.904.925-3.058-.219-.35A8.09 8.09 0 0 1 3.909 12c0-4.463 3.63-8.09 8.092-8.09 4.462 0 8.09 3.627 8.09 8.09 0 4.463-3.628 8.09-8.09 8.09z" />
      </svg>
    </a>
  );
}
