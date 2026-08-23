# MANUTENCAO.md — Plano de Manutenção e Evolução

**Plataforma Vecorion — Módulo Diagnóstico Digital/IA**

---

## 1. Lista de dependências (estado na entrega)

| Pacote | Versão | Papel |
|---|---|---|
| `next` | 14.2.35 | Framework — **ver ressalva de segurança abaixo** |
| `react` / `react-dom` | ^18.3.1 | Base de UI |
| `@supabase/supabase-js` | ^2.112.3 | Cliente de banco/auth/storage |
| `@supabase/ssr` | ^0.12.4 | Sessão autenticada em ambiente servidor |
| `zod` | ^4.4.3 | Validação de dado de entrada |
| `@fontsource-variable/inter` / `sora` | ^5.2.8 | Tipografia auto-hospedada |
| `vitest` (dev) | ^4.1.10 | Suíte de testes automatizados |
| `tailwindcss` (dev) | ^3.4.7 | Estilo |
| `typescript` (dev) | ^5.5.4 | Tipagem |

## 2. Ressalva de segurança ativa — Next.js 14.2.35

`npm audit` real (Etapa 13) aponta 6 vulnerabilidades de severidade alta, sem correção disponível dentro da série `14.2.x` (já é a última). **Prioridade alta**: atualizar para Next.js 15 (caminho mais conservador que pular direto para 16), com ciclo de teste de regressão completo em navegador real antes de publicar — nenhuma etapa deste projeto teve acesso a navegador real para validar essa migração com segurança. Recomendo tratar como o primeiro item de manutenção depois do lançamento, não like uma tarefa "quando sobrar tempo".

## 3. Política de atualização recomendada

- **Dependências de produção** (`next`, `react`, `@supabase/*`, `zod`): revisar mensalmente com `npm outdated`; aplicar patches de segurança (`npm audit`) assim que publicados, sempre passando pela suíte de testes (`npm test`) e pelo build antes de publicar.
- **Dependências de desenvolvimento** (`eslint`, `vitest`, etc.): menor urgência, atualizar a cada poucos meses ou quando bloquear alguma funcionalidade nova.
- Nunca rodar `npm audit fix --force` sem revisar o que ele vai mudar — pode saltar versão major sem aviso (foi exatamente o caso encontrado na Etapa 13).

## 4. Backup

Nenhuma política de backup foi definida durante este projeto (pendência já registrada desde a Etapa 1, nunca resolvida por depender de decisão de negócio, não de código). Recomendação mínima: o Supabase já mantém backup automático diário nos planos pagos — confirmar se o plano do projeto criado inclui isso; se estiver no plano gratuito, considerar exportação manual periódica das tabelas (`clientes`, `solicitacoes`, `analises`) até migrar para um plano com backup gerenciado.

## 5. Monitoramento

Nenhuma ferramenta de monitoramento de erro (tipo Sentry) foi integrada nesta entrega — os logs estruturados (`lib/servidor/log.ts`, Etapa 9) escrevem em `console`, visíveis nos logs de função da Netlify. Para o volume inicial esperado, isso é suficiente; se o volume de leads crescer, vale considerar:
- Um serviço de log agregado (reduz tempo de diagnóstico de problema em produção)
- Alerta automático quando `log.erro(...)` disparar com frequência anormal

## 6. Rate limiting — pendência conhecida

Registrada desde a Etapa 4, nunca implementada (decisão consciente: depende de escolha de mecanismo — ex. Netlify Edge Functions com contador, ou um serviço dedicado — que não foi definida). **Recomendo resolver antes de qualquer campanha de tráfego pago ou divulgação em massa do link do formulário**, para reduzir risco de abuso do endpoint público de criação de solicitação.

## 7. Como adicionar um novo módulo

A arquitetura (Etapa 2/6/7) já foi desenhada para isso — nenhuma mudança estrutural é necessária:
1. Nova pasta em `app/{nome-do-modulo}/` — rota isolada, herda Header/Footer do Portal automaticamente via `app/layout.tsx`.
2. Componentes exclusivos em `components/{nome-do-modulo}/`.
3. Se precisar de dado próprio: tabelas novas no mesmo projeto Supabase (schema isolado por prefixo de tabela, ou um schema Postgres separado se o volume justificar) — nunca reaproveitar as tabelas do Diagnóstico para outro módulo. **Isso já aconteceu na prática**: o projeto real usado no deploy (`vecorion-plataforma`) é compartilhado com outros produtos Vecorion, e já existia uma tabela `arquivos` de outro sistema — por isso a tabela deste módulo se chama `diagnostico_arquivos`, prefixada, não `arquivos`. Ao criar qualquer tabela nova neste projeto, sempre prefixar com o nome do módulo (`diagnostico_*`, `cursos_*`, etc.) para evitar essa colisão de novo.
4. Se precisar de autenticação própria: reaproveitar o padrão de `perfis_admin` só se fizer sentido a mesma equipe operar os dois módulos; caso contrário, uma tabela de perfil própria por módulo é mais seguro.
5. Módulos já reservados na arquitetura original (nunca construídos): `/e-commerce/`, `/cursos/`, `/sites/`, `/imagens/`, `/videos/`.

## 8. Evolução planejada do módulo Diagnóstico (fora do escopo desta entrega)

Já delimitado desde a especificação original (fases 2–4, fora do MVP):
- Sistema de geração de propostas comerciais
- Pagamentos (Mercado Pago, quando entrar em escopo — Etapa 4/10)
- Gestão de projeto pós-venda
- Papéis administrativos diferenciados (`admin` vs. `analista` com permissões distintas — hoje ambos têm o mesmo acesso na prática, já que nenhuma tela restringe por papel ainda)
- Tela de atualização de status/prioridade diretamente no painel (hoje feita via Supabase Table Editor — funcional, mas não é a experiência final desejada)

## 9. Contato técnico / continuidade

Todo o histórico de decisão está documentado em `ETAPA_1` a `ETAPA_13` (raiz do repositório) — qualquer desenvolvedor novo (humano ou outro agente de IA) consegue entender o "porquê" de cada escolha sem precisar perguntar, lendo esses documentos em ordem.
