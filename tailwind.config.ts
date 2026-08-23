import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta aprovada no briefing: azul, preto, branco.
        // Cor extraída diretamente dos arquivos de logo enviados pelo cliente (#173F82),
        // para garantir 100% de consistência entre a marca e o site.
        // "ink" = preto usado para texto/fundos escuros (não #000 puro, mais premium)
        // "brand" = azul de marca, com variação clara p/ acentos e hover
        ink: {
          DEFAULT: "#0A0E17", // mesmo tom dos lockups escuros originais
          soft: "#131926",
        },
        brand: {
          DEFAULT: "#173F82", // azul de marca (medido no logo original)
          light: "#3B6FD4", // azul de acento (CTAs, links, hover) — derivado do principal
          dark: "#0F2C60",
          tint: "#5B8DEF", // versão clara p/ texto de acento sobre fundos escuros (WCAG AA)
          50: "#EEF3FC",
        },
        paper: "#FFFFFF",
        mist: "#F5F7FA", // branco levemente acinzentado p/ seções alternadas
        // Única exceção controlada à paleta azul/preto/branco (decisão da Etapa 9):
        // cor semântica de erro, usada só em validação de formulário e estados de falha.
        danger: {
          DEFAULT: "#B23A34",
          light: "#D6534B",
          50: "#FBEEED",
        },
      },
      fontFamily: {
        display: ["Sora Variable", "sans-serif"],
        body: ["Inter Variable", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "12px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
