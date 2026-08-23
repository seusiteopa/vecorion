/**
 * Fonte única de verdade para dados institucionais.
 * Trocar estes valores é suficiente para reaproveitar o template em outro cliente,
 * sem tocar nos componentes.
 */

export const SITE = {
  name: "Vecorion",
  tagline: "Tecnologia simples, acessível e humana para o seu negócio",
  description:
    "Criação de sites e páginas profissionais modernas, rápidas e focadas em gerar resultados. Atendimento próximo, preço único.",
  locale: "pt_BR",
  url: "https://vecorion.example.com", // trocar pelo domínio real no deploy
};

export const CONTACT = {
  whatsappNumber: "5519991255529", // formato internacional, sem símbolos
  whatsappMessage: "Olá! Vim pelo site da Vecorion e gostaria de saber mais.",
  phoneDisplay: "(19) 99125-5529",
  email: "", // pendente de definição pelo cliente
  instagram: "https://instagram.com/vecorion",
  facebook: "", // pendente
  youtube: "", // pendente
  linkedin: "", // pendente
};

export const whatsappHref = (customMessage?: string) => {
  const message = encodeURIComponent(customMessage ?? CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`;
};

export const mailtoHref = (subject?: string) => {
  if (!CONTACT.email) return undefined;
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${CONTACT.email}${s}`;
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
];

// Links legais: ficam só no rodapé, fora do menu principal (não competem com a navegação de conversão).
export const LEGAL_LINKS: NavItem[] = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
];

export const HOW_IT_WORKS = [
  {
    step: "Strategy",
    title: "Estratégia",
    description:
      "Entendemos seu negócio, seu público e o objetivo real da sua página antes de desenhar qualquer tela.",
  },
  {
    step: "Wireframe",
    title: "Wireframe",
    description:
      "Organizamos a estrutura e a hierarquia de informação para guiar o visitante até a ação certa.",
  },
  {
    step: "Design",
    title: "Design",
    description:
      "Aplicamos identidade visual moderna e premium, pensada para gerar confiança à primeira vista.",
  },
  {
    step: "Code",
    title: "Desenvolvimento",
    description:
      "Codificamos com performance, responsividade e boas práticas, prontos para publicar.",
  },
];

export const SERVICES = [
  {
    slug: "sites-institucionais",
    title: "Sites institucionais",
    summary:
      "Presença digital profissional para apresentar sua empresa e gerar credibilidade.",
  },
  {
    slug: "paginas-alta-conversao",
    title: "Páginas de alta conversão",
    summary:
      "Páginas personalizadas, feitas sob medida para transformar visitantes em contatos.",
  },
];

export const DIFFERENTIATORS = [
  {
    title: "Atendimento próximo",
    description: "Conversa direta, sem burocracia, do primeiro contato à entrega.",
  },
  {
    title: "Preço único",
    description: "Sem mensalidade escondida — você sabe exatamente quanto vai pagar.",
  },
  {
    title: "IA + design personalizado",
    description: "Tecnologia a favor da agilidade, sem abrir mão de um projeto sob medida.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Quais serviços vocês oferecem?",
    answer:
      "Criação de sites institucionais e páginas de alta conversão, personalizados para o seu negócio.",
  },
  {
    question: "Como funciona o processo de contratação?",
    answer:
      "Você fala com a gente pelo WhatsApp, entendemos sua necessidade e enviamos os próximos passos.",
  },
  {
    question: "Quanto custa um site ou uma página?",
    answer:
      "Trabalhamos com preço único, definido conforme o escopo do projeto. Fale com a gente para um valor exato.",
  },
  {
    question: "Qual é o prazo médio de entrega?",
    answer:
      "O prazo varia conforme a complexidade do projeto e é combinado antes do início do trabalho.",
  },
  {
    question: "O atendimento é online ou presencial?",
    answer: "100% online, para atender clientes em todo o Brasil.",
  },
  {
    question: "Vocês atendem clientes de todo o Brasil?",
    answer: "Sim, atendemos qualquer cidade ou estado, com atendimento totalmente online.",
  },
  {
    question: "É possível pedir um orçamento sem compromisso?",
    answer: "Sim, é só chamar no WhatsApp e conversamos sem compromisso.",
  },
  {
    question: "O site será personalizado para o meu negócio?",
    answer: "Sim, cada projeto é desenhado sob medida para a sua marca e objetivo.",
  },
  {
    question: "Vocês oferecem suporte após a entrega?",
    answer: "Sim, oferecemos suporte após a entrega do projeto.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "As formas de pagamento são combinadas diretamente com você durante o orçamento.",
  },
];
