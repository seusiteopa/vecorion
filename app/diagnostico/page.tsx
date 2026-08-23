import type { Metadata } from "next";
import ModuloHero from "@/components/diagnostico/landing/ModuloHero";
import MetodologiaSection from "@/components/diagnostico/landing/MetodologiaSection";
import ServicosModuloSection from "@/components/diagnostico/landing/ServicosModuloSection";
import PortfolioModuloSection from "@/components/diagnostico/landing/PortfolioModuloSection";
import CtaBanner from "@/components/sections/CtaBanner";
import { SITE } from "@/lib/constants";

const TITULO = "Diagnóstico Digital";
const DESCRICAO =
  "Analisamos seus processos manuais e identificamos oportunidades de digitalização, automação e IA.";

/**
 * Achado real da Etapa 12: sem `openGraph`/`twitter` próprios, esta página herdava
 * o título e a descrição genéricos do site inteiro (definidos no layout raiz) ao
 * ser compartilhada em redes sociais — quem compartilhasse o link do módulo via
 * WhatsApp/LinkedIn/etc. via o card do Portal (Etapa 8) veria "Vecorion" genérico
 * em vez do conteúdo específico do Diagnóstico. Esse mesmo padrão de ausência já
 * existe nas demais páginas do Portal (não introduzido pelo módulo) — corrigido
 * aqui, no escopo desta etapa; as demais páginas ficam como melhoria futura
 * recomendada, registrada no relatório desta etapa.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/diagnostico" },
  title: TITULO,
  description: DESCRICAO,
  openGraph: {
    type: "website",
    url: `${SITE.url}/diagnostico`,
    title: `${TITULO} | ${SITE.name}`,
    description: DESCRICAO,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: TITULO }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITULO} | ${SITE.name}`,
    description: DESCRICAO,
    images: ["/og-image.jpg"],
  },
};

/**
 * Dados estruturados de serviço — ausentes até esta etapa. Ajuda motores de busca
 * a entender que esta página representa um serviço oferecido pela empresa (mesma
 * entidade do JSON-LD Organization já presente no layout raiz), podendo habilitar
 * exibição enriquecida nos resultados de busca.
 */
const servicoJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: TITULO,
  description: DESCRICAO,
  provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
  areaServed: "BR",
  url: `${SITE.url}/diagnostico`,
};

export default function DiagnosticoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicoJsonLd) }}
      />
      <ModuloHero />
      <MetodologiaSection />
      <ServicosModuloSection />
      <PortfolioModuloSection />
      <CtaBanner
        title="Tem um processo que está consumindo tempo?"
        description="Você não precisa saber qual tecnologia utilizar. Conte-nos o que está acontecendo e nós analisamos o processo para identificar possíveis soluções."
      />
    </>
  );
}
