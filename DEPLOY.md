# DEPLOY.md — Guia de Publicação em Produção

**Plataforma Vecorion — Módulo Diagnóstico Digital/IA**

Este guia cobre exatamente os passos que dependem das suas credenciais reais (Supabase, Netlify, domínio) — nada aqui pôde ser executado neste ambiente de desenvolvimento, porque nenhuma dessas contas/credenciais está disponível aqui. Cada passo indica como confirmar que funcionou.

---

## 1. Criar o projeto Supabase

1. Crie um novo projeto em [supabase.com](https://supabase.com) (ou reaproveite um projeto existente do seu ecossistema, se preferir isolar por schema — não recomendado para este módulo, ver `MANUTENCAO.md`).
2. Abra o **SQL Editor** do projeto e cole o conteúdo de `supabase/schema.sql` (raiz deste repositório). Rode uma vez — cria as 7 tabelas, enums, índices, Row Level Security e o bucket de storage privado.
3. Crie o primeiro usuário administrador:
   - Vá em **Authentication → Users → Add user** e crie com e-mail/senha.
   - Copie o `UUID` gerado.
   - No SQL Editor, rode:
     ```sql
     insert into perfis_admin (user_id, nome, papel, ativo)
     values ('COLE_O_UUID_AQUI', 'Seu Nome', 'admin', true);
     ```
   - Sem este passo, o login funciona no Supabase Auth mas o painel recusa acesso (Etapa 9: login válido não é suficiente sozinho).
4. Em **Project Settings → API**, copie: `Project URL`, `anon public key`, `service_role key` (nunca exponha a última publicamente).

**Validação**: rode `select * from perfis_admin;` no SQL Editor — deve retornar seu usuário com `ativo = true`.

---

## 2. Configurar variáveis de ambiente na Netlify

Em **Site settings → Environment variables**, adicione (nomes exatos, sem aspas):

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do passo 1.4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key do passo 1.4 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key do passo 1.4 |
| `ANTHROPIC_API_KEY` | Chave da API da Anthropic (console.anthropic.com) |
| `BREVO_API_KEY` | Chave de API da Brevo (app.brevo.com → SMTP & API) |
| `BREVO_DESTINATARIO_NOTIFICACAO` | E-mail que deve receber aviso de novo lead |
| `SITE_URL` | URL final de produção (ex.: `https://vecorion.com.br`) |

`.env.local.example` (raiz do projeto) documenta a finalidade de cada uma — use como referência, nunca copie valores de exemplo.

**Sem `ANTHROPIC_API_KEY`**: o botão "Analisar com IA" continua funcionando na interface, mas responde "chave não configurada" (Etapa 9/13) — não é um erro, é o comportamento esperado até você configurar.
**Sem `BREVO_API_KEY`**: novos leads continuam sendo salvos normalmente, só a notificação por e-mail não é enviada (registrada em log como aviso, nunca bloqueia o lead — Etapa 4/10).

---

## 3. Domínio e SSL

1. Em **Site settings → Domain management**, adicione seu domínio (ex.: `vecorion.com.br`).
2. A Netlify indica os registros DNS a criar no seu provedor de domínio (geralmente um `A`/`ALIAS` para a raiz e um `CNAME` para `www`).
3. Depois de o DNS propagar (pode levar de minutos a algumas horas), a Netlify emite o certificado SSL automaticamente (Let's Encrypt) — nenhuma ação manual adicional é necessária.

**Validação**: acesse `https://` do seu domínio final — o cadeado deve aparecer sem aviso, e `http://` deve redirecionar para `https://` automaticamente (comportamento padrão da Netlify).

---

## 4. Deploy

Com o repositório conectado à Netlify (Git-based deploy, já é o padrão usado no Portal):
1. Cada push na branch principal aciona automaticamente `npm test && npm run build` (configurado em `netlify.toml`, Etapa 14) — **se os testes falharem, o deploy não publica**.
2. Acompanhe o log de build em **Deploys** no painel da Netlify.

Se você usa GitHub: o workflow `.github/workflows/ci.yml` (Etapa 14) já roda testes e build em todo push/PR, dando feedback direto no GitHub antes mesmo de a Netlify tentar publicar — duas barreiras independentes, de propósito.

---

## 5. Checklist de validação pós-deploy (fazer na ordem)

- [ ] `https://seu-dominio/` carrega o Portal normalmente
- [ ] `https://seu-dominio/diagnostico` carrega a landing do módulo
- [ ] Preencher o formulário de 10 etapas até o fim → deve cair em `/diagnostico/confirmacao`
- [ ] Conferir no Supabase (Table Editor → `solicitacoes`) que o registro foi criado
- [ ] Conferir se o e-mail de notificação chegou (se `BREVO_API_KEY` configurada)
- [ ] Acessar `https://seu-dominio/diagnostico/admin/login` e logar com o usuário criado no passo 1.3
- [ ] Confirmar que o dashboard mostra a solicitação criada no teste acima
- [ ] Abrir a solicitação e clicar em "Analisar com IA" (se `ANTHROPIC_API_KEY` configurada) → deve retornar uma análise estruturada em alguns segundos
- [ ] Testar upload de um arquivo pequeno (PDF ou imagem) numa nova submissão do formulário
- [ ] Verificar `https://seu-dominio/sitemap.xml` inclui `/diagnostico`
- [ ] Verificar `https://seu-dominio/robots.txt` bloqueia `/diagnostico/admin/` e `/api/`
- [ ] Tentar acessar `/diagnostico/admin` em uma aba anônima (sem login) → deve redirecionar para `/diagnostico/admin/login`

Nenhum destes passos pôde ser executado durante o desenvolvimento (Etapas 9–13) por falta de acesso às credenciais reais — este checklist é o teste de ponta a ponta que só você consegue completar.

---

## 6. Rollback

A Netlify mantém histórico de todos os deploys anteriores em **Deploys** — qualquer versão publicada pode ser restaurada com um clique ("Publish deploy" num deploy anterior), sem precisar reverter código ou re-buildar.
