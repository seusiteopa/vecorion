import type { MetadataRoute } from "next";
import { LEGAL_LINKS, NAV_ITEMS, SITE } from "@/lib/constants";

/**
 * Achado real da Etapa 12: o gerador varria só NAV_ITEMS + LEGAL_LINKS. Como o
 * módulo Diagnóstico foi deliberadamente tirado do menu principal (decisão C06,
 * consolidação), sua landing (`/diagnostico`) nunca aparecia no sitemap — apesar
 * de ter metadata própria e ser pensada para indexação. As páginas do formulário,
 * confirmação e área administrativa continuam de fora aqui de propósito: já são
 * marcadas `noindex` na própria metadata (Etapa 8), então não pertencem ao sitemap.
 */
const PAGINAS_ADICIONAIS_FORA_DO_MENU = ["/diagnostico"];

export default function sitemap(): MetadataRoute.Sitemap {
  const rotasMenu = [...NAV_ITEMS, ...LEGAL_LINKS].map((item) => item.href);
  const todasAsRotas = [...rotasMenu, ...PAGINAS_ADICIONAIS_FORA_DO_MENU];

  return todasAsRotas.map((href) => ({
    url: `${SITE.url}${href === "/" ? "" : href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.7,
  }));
}
