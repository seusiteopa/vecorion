# Vecorion — Portal Institucional + Módulo Diagnóstico Digital/IA

Plataforma Next.js 14 (App Router) + TypeScript + Tailwind CSS. Dois blocos convivem no mesmo projeto e no mesmo deploy:

- **Portal institucional** (`/`, `/sobre`, `/servicos`, `/portfolio`, `/faq`, `/contato`, `/politica-de-privacidade`) — 100% estático, sem banco de dados, todo contato redirecionado para WhatsApp ou e-mail. Este bloco não mudou desde a versão original.
- **Módulo Diagnóstico Digital/IA** (`/diagnostico/**`) — formulário de captação de leads em 10 etapas, painel administrativo autenticado, banco de dados (Supabase), integração real com IA (Anthropic) e notificação por e-mail (Brevo). Construído entre as Etapas 1–14 deste projeto (ver seção 6).

> ⚠️ Se você está vendo este README antes de rodar `npm install`, leia `DEPLOY.md` primeiro — o módulo Diagnóstico não funciona sem um projeto Supabase configurado.

---

## 1. Estrutura do projeto

```
vecorion-site/
├── app/
│   ├── layout.tsx                  → layout raiz do Portal (fontes, SEO, JSON-LD, skip-link)
│   ├── page.tsx, sobre/, servicos/, portfolio/, faq/, contato/,
│   │   politica-de-privacidade/    → Portal institucional (inalterado)
│   ├── sitemap.ts / robots.ts      → SEO técnico, cobre Portal + módulo (Etapa 12)
│   ├── diagnostico/
│   │   ├── page.tsx                → landing do módulo
│   │   ├── formulario/page.tsx     → wizard de 10 etapas
│   │   ├── confirmacao/page.tsx    → tela de confirmação
│   │   └── admin/
│   │       ├── login/page.tsx      → login (Supabase Auth)
│   │       └── (painel)/           → dashboard + detalhe de solicitação (autenticado)
│   └── api/diagnostico/            → Route Handlers (back-end — ver seção 3)
├── components/
│   ├── layout/, ui/, sections/     → Portal (compartilhado com o módulo)
│   └── diagnostico/                → exclusivos do módulo (landing/formulario/admin)
├── lib/
│   ├── constants.ts                → fonte única de verdade do Portal
│   ├── diagnostico/                → tipos, constantes e mapeamento de dado do módulo
│   ├── validacao/, dominio/        → validação de servidor e regras de negócio
│   └── servidor/                   → Supabase, IA, e-mail, auth, log, erros (server-only)
├── middleware.ts                   → protege /diagnostico/admin/** antes de renderizar
├── supabase/schema.sql             → schema completo do banco (rodar uma vez, ver DEPLOY.md)
├── tests/                          → 51 testes automatizados (Vitest) — `npm test`
├── .github/workflows/ci.yml        → pipeline de build + teste em todo push/PR
└── public/                         → favicons, ícone/logo da marca (brand/), og-image
```

**Regra de ouro do Portal, ainda válida:** para trocar texto, telefone, links do Portal, edite `lib/constants.ts`. Para o módulo, os equivalentes são `lib/diagnostico/constants.ts` (metodologia, serviços, opções de formulário) e `lib/diagnostico/types.ts` (contratos de dado).

---

## 2. Tecnologias e dependências

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework — Portal 100% estático, módulo com Route Handlers + middleware |
| TypeScript | Tipagem em todo o projeto |
| Tailwind CSS | Estilização, paleta de marca em `tailwind.config.ts` (inclui `danger`, exceção controlada — Etapa 9) |
| @supabase/supabase-js, @supabase/ssr | Banco, autenticação e storage do módulo |
| zod | Validação de entrada no servidor (a que realmente importa para segurança) |
| Vitest | Suíte de testes automatizados |
| @fontsource-variable/sora, /inter | Fontes auto-hospedadas |

Lista completa e ressalva de segurança ativa sobre a versão do Next.js: ver `MANUTENCAO.md`.

---

## 3. Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha com credenciais reais — ver DEPLOY.md
npm run dev
```

Sem `.env.local` preenchido, o Portal funciona normalmente, mas o módulo Diagnóstico não consegue gravar dado nem autenticar (erros tratados, nunca crash — Etapa 9/11).

## 4. Build, testes e produção

```bash
npm test        # 51 testes automatizados (lógica de validação, domínio, mapeamento de dado)
npm run build   # build de produção
npm run start   # sobe servidor de produção local
```

O deploy real (Netlify) roda `npm test && npm run build` automaticamente — um deploy nunca publica se os testes falharem (`netlify.toml`, Etapa 14).

---

## 5. Documentação completa do projeto

| Arquivo | Conteúdo |
|---|---|
| `DEPLOY.md` | Passo a passo de publicação: Supabase, variáveis de ambiente, domínio, SSL, checklist pós-deploy |
| `OPERACAO.md` | Guia de uso do painel administrativo, dia a dia |
| `MANUTENCAO.md` | Dependências, política de atualização, backup, monitoramento, como adicionar um novo módulo |
| `ETAPA_1` a `ETAPA_13` (raiz) | Todo o histórico de decisão do projeto, da análise estratégica à auditoria técnica final — leia se precisar entender o "porquê" de qualquer escolha |
| `supabase/schema.sql` | Schema completo do banco, pronto para rodar no SQL Editor do Supabase |

## 6. Como este projeto foi construído

Este projeto seguiu um processo de 14 etapas, cada uma com um documento correspondente na raiz do repositório: análise estratégica → arquitetura → modelagem de dados → integrações planejadas → UX/UI → branding/ativos visuais → estrutura técnica → front-end → back-end → integrações reais → QA/testes → otimização final → auditoria técnica → deploy e entrega (este documento). Nenhuma etapa foi pulada; cada uma parte do que a etapa anterior decidiu, sem reabrir decisão já fechada sem justificativa nova.

## 7. Como adicionar um novo módulo

Ver `MANUTENCAO.md`, seção 7 — a arquitetura já foi desenhada para isso, sem exigir mudança estrutural no Portal ou no módulo Diagnóstico existente.
