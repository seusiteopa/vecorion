# ETAPA 9 — DESENVOLVIMENTO COMPLETO DO BACK-END

**Plataforma Vecorion — Módulo Diagnóstico Digital/IA**

Back-end completo construído sobre a estrutura definida na Etapa 7 e o modelo de dados da Etapa 3. As integrações externas propriamente ditas (chamada real à API de IA e ao provedor de e-mail) **não foram implementadas**, por instrução explícita desta etapa — mas toda a infraestrutura ao redor delas (adaptador, contrato, tratamento de erro, ponto de chamada) está pronta, faltando só o corpo de duas funções na Etapa 10. A comunicação com o banco de dados, em contraste, foi implementada de verdade, porque a própria etapa pede isso ("comunicação com o banco de dados conforme a modelagem aprovada").

**Validação real**: build de produção rodado várias vezes durante o desenvolvimento — 3 problemas reais de tipo foram encontrados e corrigidos (detalhes na seção 6), incluindo uma incompatibilidade de versão do Zod que só apareceu ao compilar de verdade. Depois disso, subi o servidor com credenciais Supabase propositalmente falsas e testei os caminhos de erro por HTTP — todos os resultados estão na seção 7, com evidência de que nenhuma falha de integração derruba o servidor.

---

## 1. CAMADAS CONSTRUÍDAS (mapeamento direto à Etapa 2/7)

| Camada | Onde está | O que faz |
|---|---|---|
| Apresentação | `app/diagnostico/**` (Etapa 8) | Inalterada nesta etapa |
| Aplicação (orquestração) | `app/api/diagnostico/**` (Route Handlers) | Recebe requisição, valida, chama Domínio/Dados/Integração, formata resposta |
| Domínio (regras de negócio) | `lib/dominio/status.ts` | Transições de status, status inicial — sem dependência de banco ou framework |
| Acesso a Dados | `lib/servidor/supabase/consultas.ts` | Único ponto de leitura/escrita no banco |
| Integrações Externas | `lib/servidor/ia/adaptador.ts`, `lib/servidor/email/adaptador.ts` | Interface pronta, implementação real pendente (Etapa 10) |
| Transversal | `lib/servidor/erros.ts`, `lib/servidor/log.ts`, `lib/servidor/manipulador-rota.ts` | Erros padronizados, log estruturado, tratamento de erro uniforme em toda rota |

---

## 2. ENDPOINTS ENTREGUES (todos os 6 do contrato da Etapa 7 + 2 de autenticação)

| Endpoint | Método | Autenticação | Status |
|---|---|---|---|
| `/api/diagnostico/solicitacoes` | POST | Nenhuma (público) | ✅ Completo — grava cliente + solicitação + vincula ferramentas + dispara notificação (que ainda não está conectada de verdade, ver seção 4) |
| `/api/diagnostico/solicitacoes` | GET | Administrador | ✅ Completo — lista com filtro por status |
| `/api/diagnostico/solicitacoes/[id]` | GET | Administrador | ✅ Completo — detalhe com cliente, arquivos e ferramentas |
| `/api/diagnostico/solicitacoes/[id]` | PATCH | Administrador | ✅ Completo — atualiza status/prioridade, valida transição |
| `/api/diagnostico/arquivos` | POST | Nenhuma (público, vinculado a uma solicitação existente) | ✅ Completo — valida, envia ao Storage, registra |
| `/api/diagnostico/analises` | POST | Administrador | ✅ Orquestração completa; chamada real à IA pendente (responde 503 previsível) |
| `/api/diagnostico/auth/login` | POST | — | ✅ Novo nesta etapa — login real via Supabase Auth + checagem de `perfis_admin` |
| `/api/diagnostico/auth/logout` | POST | Administrador | ✅ Novo nesta etapa |

---

## 3. AUTENTICAÇÃO E AUTORIZAÇÃO — DUAS CAMADAS, DE PROPÓSITO

1. **Middleware** (`middleware.ts`): roda antes de qualquer renderização de `/diagnostico/admin/**` (exceto `/login`), verifica só se existe sessão válida no Supabase Auth. Redireciona para login se não houver.
2. **`exigirSessaoAdmin`** (`lib/servidor/auth/sessao.ts`): chamada pelo layout do painel e por todo Route Handler administrativo — confirma, além da sessão, que o usuário está presente em `perfis_admin` com `ativo = true` (regra da Etapa 3: login válido no Supabase Auth não basta sozinho).

As duas camadas não são redundância acidental: o middleware roda em Edge Runtime (checagem rápida, sem consulta a mais tabela); a checagem completa (com `perfis_admin`) roda na camada de Aplicação, que já paga esse custo de qualquer forma para buscar o dado da página. Documentado com esse raciocínio direto no código do middleware.

**Login administrativo real**: `/api/diagnostico/auth/login` autentica via `supabase.auth.signInWithPassword`, depois confirma o perfil administrativo — se a segunda checagem falhar, a sessão é encerrada imediatamente (`signOut`), em vez de deixar alguém autenticado no Supabase Auth mas sem perfil válido navegar pelo painel.

---

## 4. INTEGRAÇÕES EXTERNAS — PREPARADAS, NÃO IMPLEMENTADAS (conforme instrução desta etapa)

`lib/servidor/ia/adaptador.ts` e `lib/servidor/email/adaptador.ts` têm assinatura de entrada/saída completa e documentada, mas o corpo de cada função:
- **IA**: lança `ErroIntegracaoNaoConfigurada`, mapeado automaticamente para HTTP 503 pelo tratamento de erro central. O endpoint `/api/diagnostico/analises` já faz toda a orquestração ao redor disso (busca a solicitação, monta a entrada sem dado pessoal, chamaria a IA, gravaria o resultado) — só a chamada real está faltando.
- **E-mail**: nunca lança erro (por design — falha de notificação não pode impedir a criação do lead, regra já fixada na Etapa 4), só registra um aviso de log dizendo que a integração ainda não está conectada.

Quando a Etapa 10 implementar essas duas integrações de verdade, **nenhum Route Handler, página ou componente precisa mudar** — só o corpo dessas duas funções.

---

## 5. SEGURANÇA APLICADA (não só documentada)

- `SUPABASE_SERVICE_ROLE_KEY` só existe dentro de `lib/servidor/supabase/cliente-admin.ts`, que importa o pacote `server-only` — se qualquer componente de interface tentar importar esse arquivo por engano, **o build falha**, em vez de vazar a chave silenciosamente em tempo de execução.
- Toda entrada de `POST /solicitacoes` revalidada no servidor com Zod (`lib/validacao/solicitacao.ts`), independente da validação já feita no cliente (Etapa 8) — inclusive contra tipos de valor (enum) que só a validação de cliente não garantiria.
- Upload de arquivo: endpoint confirma que a `solicitacaoId` recebida realmente existe no banco antes de aceitar o arquivo (reforço de segurança que nem estava no contrato original da Etapa 7 — adicionei porque um endpoint de upload público sem essa checagem aceitaria arquivo vinculado a qualquer identificador inventado).
- Toda mensagem de erro que sai de um Route Handler passa por `mensagemSeguraParaErro` — um erro inesperado de banco nunca vaza texto de infraestrutura para o cliente, só "Falha interna. Tente novamente em instantes."
- Row Level Security habilitada em 100% das tabelas no schema SQL entregue (seção 8) — nenhuma tabela fica acessível sem policy explícita, nem mesmo `ferramentas` (só leitura pública, escrita restrita).

---

## 6. PROBLEMAS REAIS ENCONTRADOS E CORRIGIDOS DURANTE O BUILD

O build falhou 3 vezes antes de passar — cada uma revelando um problema genuíno, não hipotético:

1. **Tipo incompatível na leitura de ferramentas da solicitação** (`analises/route.ts`): o formato de retorno de uma relação aninhada do Supabase não batia com o tipo esperado — corrigido tratando explicitamente o caso de a relação vir como array.
2. **API do Zod mudou entre versões**: o pacote instalado é Zod 4, que renomeou `error.errors` para `error.issues` e trocou o parâmetro `errorMap` por `message` em `z.enum()`. Isso só apareceu ao rodar o build de verdade — nenhuma leitura de documentação genérica pegaria essa mudança de versão específica. Corrigido em 2 arquivos de rota + no schema de validação.
3. **Formato de retorno de relação N:1 do Supabase**: escrevi um utilitário (`mapear-supabase.ts`) que trata defensivamente os dois formatos possíveis (`objeto` ou `array de um item`) que o Supabase pode retornar para uma relação, já que não há projeto Supabase real disponível nesta etapa para confirmar qual formato ele de fato usa neste schema específico.

---

## 7. VALIDAÇÃO DE COMPORTAMENTO EM ERRO — EVIDÊNCIA REAL

Sem acesso a um projeto Supabase real neste ambiente (o domínio `supabase.co` não está liberado na rede deste sandbox), configurei credenciais **propositalmente falsas** e testei os caminhos de falha por HTTP — o objetivo era confirmar que o sistema falha graciosamente, não que a integração funciona de ponta a ponta (isso só um projeto Supabase real permite testar).

```
Página pública (/diagnostico)                        → 200
Rota administrativa sem sessão (/diagnostico/admin)   → 307 (redireciona para /login, correto)
POST /solicitacoes com corpo vazio                    → 400 (nunca 500)
GET /solicitacoes sem sessão                          → 401 "Sessão inválida ou expirada."
POST /auth/login com Supabase inexistente             → 401, tratado, sem crash
Servidor segue respondendo depois de todas as falhas  → 200
```

Nenhuma falha de integração derrubou o processo do servidor — exatamente o comportamento que a arquitetura de tratamento de erro (Etapa 2/7) foi desenhada para garantir.

---

## 8. SCHEMA SQL REAL ENTREGUE (`supabase/schema.sql`)

Como o corpo desta etapa exige "comunicação com o banco de dados conforme a modelagem aprovada", o schema SQL completo (7 tabelas, todos os enums, índices, Row Level Security, policies, bucket de storage) acompanha esta entrega — pronto para colar no SQL Editor do Supabase assim que o projeto for criado. Isso não é a integração externa em si (nenhuma chamada de rede acontece ao gerar este arquivo), é a definição de dado já aprovada na Etapa 3, materializada.

---

## 9. VARIÁVEIS DE AMBIENTE — `.env.local.example` ENTREGUE

Arquivo de exemplo documentado, com todas as 7 variáveis já mapeadas na Etapa 7, cada uma com comentário de finalidade. `.env.local` real (nunca commitado) e `.gitignore` cobrindo isso corretamente já estão configurados no projeto.

---

## 10. O QUE AINDA NÃO FUNCIONA DE PONTA A PONTA (esperado nesta etapa)

- Nenhuma chamada real acontece até que um projeto Supabase seja criado e as variáveis de ambiente reais sejam preenchidas — isso já era uma pendência conhecida desde o checklist da Etapa 7.
- "Analisar com IA" sempre responde "integração pendente" (503) até a Etapa 10.
- Notificação por e-mail nunca é enviada de verdade — só logada como pendente.

---

## 11. ARQUIVOS NOVOS DESTA ETAPA

19 arquivos novos (`lib/servidor/**`, `lib/validacao/**`, `lib/dominio/**`, `app/api/diagnostico/**`, `middleware.ts`, `supabase/schema.sql`, `.env.local.example`) + 7 arquivos da Etapa 8 conectados aos endpoints reais (formulário, login, sidebar, layout do painel, dashboard, detalhe, bloco de IA) + 3 pacotes novos instalados (`@supabase/supabase-js`, `@supabase/ssr`, `zod`).

---

**Fim da Etapa 9.**
Nenhuma integração externa (IA, e-mail) foi implementada de verdade, conforme instrução desta etapa. O back-end está completo, validado por build real e por teste de comportamento em erro, e organizado para a Etapa 10 conectar as duas integrações restantes sem tocar em nenhum outro arquivo.
