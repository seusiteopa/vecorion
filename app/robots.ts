import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * Achado real da Etapa 12: nenhuma regra de bloqueio existia — `/diagnostico/admin/**`
 * (área administrativa) e `/api/**` (endpoints de back-end) estavam tecnicamente
 * rastreáveis por robots.txt, desperdiçando orçamento de rastreamento em páginas que
 * nunca deveriam aparecer numa busca. `/diagnostico/formulario` e
 * `/diagnostico/confirmacao` NÃO entram aqui de propósito — já são `noindex` via
 * metadata própria (Etapa 8), e continuar permitindo o rastreio delas é o
 * comportamento correto para esse caso (rastreável, mas não indexável).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/diagnostico/admin/", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
