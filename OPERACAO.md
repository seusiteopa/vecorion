# OPERACAO.md — Guia de Operação do Painel

**Plataforma Vecorion — Módulo Diagnóstico Digital/IA**

Este guia é para quem usa o painel no dia a dia (você ou quem você delegar), não para quem mexe no código.

---

## 1. Acessar o painel

`https://seu-dominio/diagnostico/admin/login` — use o e-mail/senha criado no Supabase (ver `DEPLOY.md`, seção 1.3). Não existe "esqueci minha senha" pela interface nesta fase — a redefinição é feita manualmente pelo painel do Supabase (**Authentication → Users → selecionar usuário → Send password recovery**).

## 2. Entender o dashboard

5 contadores no topo, um para cada etapa do funil: **Novo** → **Em análise** → **Proposta enviada** → **Em desenvolvimento** → **Concluído**. Clicar em qualquer contador filtra a lista abaixo só para aquele status.

## 3. Analisar um lead recebido

1. Clique na empresa/linha da tabela para abrir o detalhe.
2. Leia problema, processo atual, ferramentas, objetivo e impacto esperado — tudo já organizado, sem precisar procurar em planilha ou e-mail.
3. Opcionalmente, clique em **"Analisar com IA"** — gera um resumo estruturado (gargalos, oportunidades, sugestões, complexidade, estimativa inicial, perguntas pendentes) em alguns segundos.
   - **A sugestão da IA nunca é a decisão final** — está escrito na própria tela ("sugestão da IA — revisão humana necessária"). Trate como um rascunho de análise técnica, não como algo para copiar direto numa proposta.
   - Se aparecer "chave de API da IA ainda não foi configurada", veja `DEPLOY.md` seção 2.
4. Depois de decidir os próximos passos, atualize o status manualmente (nesta versão, a mudança de status é feita diretamente no Supabase — Table Editor → `solicitacoes` → editar o campo `status` da linha — uma tela de atualização direto no painel é uma evolução natural, não incluída nesta entrega; ver `MANUTENCAO.md`).

## 4. O que a plataforma nunca faz sozinha

- Nunca envia orçamento ou proposta automaticamente — toda proposta comercial é feita por você, fora do sistema, nesta fase.
- Nunca contata o lead automaticamente — o WhatsApp/e-mail é sempre uma ação sua, iniciada a partir dos dados de contato mostrados no painel.
- Nunca apaga nem edita o que o lead escreveu no formulário.

## 5. Arquivos enviados por um lead

Aparecem na tela de detalhe da solicitação (quando o lead anexou algo na etapa 9 do formulário). O link de acesso ao arquivo expira em alguns minutos por segurança (Etapa 3/9 — nunca é um link público permanente) — se expirar, simplesmente recarregue a página do painel para gerar um novo.

## 6. Se algo parecer errado

- **Lead não aparece no painel, mas o visitante disse que enviou**: confira se a página de confirmação (`/diagnostico/confirmacao`) realmente apareceu para ele — se ele fechou a aba antes disso, é possível que o envio não tenha completado. Verifique também os logs do site na Netlify (**Deploys → Functions/Logs**) por algum erro de gravação.
- **"Analisar com IA" trava ou dá erro**: confira se a chave `ANTHROPIC_API_KEY` está configurada e válida (Netlify → Environment variables). Chave expirada ou sem crédito gera erro genérico "falha interna" — nesse caso, confira o saldo/status da conta Anthropic.
- **Notificação de novo lead não chegou por e-mail**: confira `BREVO_API_KEY` e `BREVO_DESTINATARIO_NOTIFICACAO` na Netlify. O lead em si não é afetado — ele já foi salvo mesmo sem a notificação (Etapa 4: falha de e-mail nunca bloqueia o lead).

## 7. Adicionar outro administrador

Pelo painel do Supabase: **Authentication → Users → Add user**, depois inserir uma linha em `perfis_admin` com o `UUID` gerado (mesmo processo do primeiro admin, `DEPLOY.md` seção 1.3). Use `papel = 'analista'` para alguém que só deve visualizar/analisar, sem outras permissões administrativas futuras que venham a ser diferenciadas por papel.
