/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Cabeçalhos de segurança básicos — ausentes até a Etapa 11, achado da bateria
  // de QA. CSP completo fica fora daqui de propósito: exige testes visuais
  // extensos (fontes, imagens otimizadas do Next, etc.) para não quebrar nada
  // sem verificação — recomendado como próximo passo de hardening, não decidido
  // às cegas nesta etapa.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Achado real da Etapa 12: favicons, ícones e logo (todos em public/,
        // seja na raiz ou em public/brand/) não tinham nenhum cabeçalho de cache —
        // o navegador reconsultava o servidor a cada visita em vez de reaproveitar
        // o arquivo já baixado. Esses arquivos raramente mudam (Etapa 6), então um
        // cache longo é seguro; `must-revalidate` garante que, se algum dia o
        // arquivo for substituído, o navegador não sirva uma versão desatualizada
        // sem checar. Casado por extensão para cobrir tanto a raiz de `public/`
        // quanto `public/brand/`, sem depender de uma estrutura de pasta específica.
        source: "/:path*.(svg|png|jpg|jpeg|ico|webp)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
