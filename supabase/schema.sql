-- ============================================================================
-- Schema do módulo Diagnóstico Digital/IA — Plataforma Vecorion
-- Espelha exatamente a modelagem aprovada na Etapa 3. Rodar no SQL Editor do
-- Supabase depois de criar o projeto (pendência já registrada no checklist da
-- Etapa 7). Este arquivo é definição de dado já aprovada, não uma integração
-- nova — por isso acompanha a Etapa 9, mesmo com as integrações externas
-- (IA, e-mail) ainda não conectadas.
--
-- ATUALIZAÇÃO PÓS-DEPLOY: a tabela de arquivos deste módulo se chama
-- `diagnostico_arquivos`, não `arquivos` — renomeada durante o deploy real
-- porque o projeto Supabase usado (`vecorion-plataforma`) é compartilhado com
-- outros produtos Vecorion, e já existia uma tabela `arquivos` pertencente a
-- outro sistema. O bucket de storage `diagnostico-arquivos` (com hífen) nunca
-- teve esse conflito e manteve o nome original.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- CLIENTES
-- ----------------------------------------------------------------------------
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text not null,
  email text not null,
  telefone text not null,
  cargo text,
  segmento text,
  site_empresa text,
  criado_em timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SOLICITAÇÕES
-- ----------------------------------------------------------------------------
create type faixa_pessoas_enum as enum ('1', '2-5', '6-20', '21-50', '50+');
create type frequencia_enum as enum ('varias_vezes_dia', 'diariamente', 'semanalmente', 'mensalmente', 'eventualmente');
create type status_solicitacao_enum as enum ('novo', 'em_analise', 'proposta_enviada', 'em_desenvolvimento', 'concluido');
create type prioridade_enum as enum ('baixa', 'media', 'alta');
create type contato_preferido_enum as enum ('whatsapp', 'email', 'ligacao', 'reuniao_online');

create table if not exists solicitacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete restrict,
  problema text not null,
  processo_atual text not null,
  faixa_pessoas faixa_pessoas_enum not null,
  pessoas_envolvidas_desc text,
  frequencia frequencia_enum not null,
  tempo_gasto text,
  ferramentas_manter text,
  objetivo text[] not null default '{}',
  impacto_esperado text[] not null default '{}',
  contato_preferido contato_preferido_enum not null,
  melhor_horario text,
  status status_solicitacao_enum not null default 'novo',
  prioridade prioridade_enum,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_solicitacoes_cliente_id on solicitacoes(cliente_id);
create index if not exists idx_solicitacoes_status on solicitacoes(status);
create index if not exists idx_solicitacoes_criado_em on solicitacoes(criado_em desc);

-- ----------------------------------------------------------------------------
-- FERRAMENTAS (catálogo) + associação N:N
-- ----------------------------------------------------------------------------
create table if not exists ferramentas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ativo boolean not null default true
);

create table if not exists solicitacao_ferramentas (
  solicitacao_id uuid not null references solicitacoes(id) on delete cascade,
  ferramenta_id uuid not null references ferramentas(id) on delete restrict,
  primary key (solicitacao_id, ferramenta_id)
);

-- Catálogo inicial, conforme a especificação original (seção 15).
insert into ferramentas (nome) values
  ('WhatsApp'), ('Excel'), ('Google Sheets'), ('Google Drive'), ('E-mail'),
  ('CRM'), ('ERP'), ('Sistema próprio'), ('Banco de dados'), ('Outro')
on conflict (nome) do nothing;

-- ----------------------------------------------------------------------------
-- ARQUIVOS
-- ----------------------------------------------------------------------------
create table if not exists diagnostico_arquivos (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references solicitacoes(id) on delete cascade,
  nome_original text not null,
  tipo_mime text not null,
  tamanho_bytes integer not null check (tamanho_bytes > 0),
  caminho_storage text not null,
  enviado_em timestamptz not null default now()
);

create index if not exists idx_diagnostico_arquivos_solicitacao_id on diagnostico_arquivos(solicitacao_id);

-- ----------------------------------------------------------------------------
-- PERFIS ADMINISTRATIVOS (complementa auth.users do Supabase Auth)
-- ----------------------------------------------------------------------------
create type papel_admin_enum as enum ('admin', 'analista');

create table if not exists perfis_admin (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel papel_admin_enum not null default 'analista',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ANÁLISES (histórico versionado — decisão da Etapa 3/7)
-- ----------------------------------------------------------------------------
create type complexidade_enum as enum ('baixa', 'media', 'alta', 'muito_alta');

create table if not exists analises (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references solicitacoes(id) on delete cascade,
  versao integer not null,
  vigente boolean not null default true,
  gargalos text,
  oportunidades text,
  solucoes_sugeridas text,
  automacoes_sugeridas text,
  aplicacoes_ia text,
  tecnologias_sugeridas text[] default '{}',
  complexidade complexidade_enum,
  estimativa_inicial text,
  observacoes text,
  perguntas_pendentes text[] default '{}',
  gerado_em timestamptz not null default now(),
  gerado_por uuid not null references perfis_admin(user_id),
  unique (solicitacao_id, versao)
);

create index if not exists idx_analises_solicitacao_id on analises(solicitacao_id);
-- Garante, a nível de banco, que só exista uma análise vigente por solicitação —
-- reforça a regra já aplicada na camada de Acesso a Dados (Etapa 9).
create unique index if not exists idx_analises_uma_vigente_por_solicitacao
  on analises(solicitacao_id) where vigente;

-- ============================================================================
-- ROW LEVEL SECURITY (Etapa 3, seção 6 — habilitada em 100% das tabelas)
-- ============================================================================
alter table clientes enable row level security;
alter table solicitacoes enable row level security;
alter table ferramentas enable row level security;
alter table solicitacao_ferramentas enable row level security;
alter table diagnostico_arquivos enable row level security;
alter table analises enable row level security;
alter table perfis_admin enable row level security;

-- Função auxiliar: o usuário autenticado é um administrador ativo?
create or replace function is_admin_ativo()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from perfis_admin
    where user_id = auth.uid() and ativo = true
  );
$$;

-- clientes / solicitacoes / solicitacao_ferramentas / arquivos / analises:
-- nenhuma policy de INSERT para anon/authenticated — a escrita pública do
-- formulário acontece exclusivamente via cliente com a chave de serviço
-- (SUPABASE_SERVICE_ROLE_KEY), que ignora RLS por definição. As policies
-- abaixo cobrem apenas leitura/atualização administrativa.
create policy "admin le clientes" on clientes for select using (is_admin_ativo());
create policy "admin le solicitacoes" on solicitacoes for select using (is_admin_ativo());
create policy "admin atualiza solicitacoes" on solicitacoes for update using (is_admin_ativo());
create policy "admin le solicitacao_ferramentas" on solicitacao_ferramentas for select using (is_admin_ativo());
create policy "admin le diagnostico_arquivos" on diagnostico_arquivos for select using (is_admin_ativo());
create policy "admin le analises" on analises for select using (is_admin_ativo());
create policy "admin escreve analises" on analises for insert with check (is_admin_ativo());
create policy "admin atualiza analises" on analises for update using (is_admin_ativo());

-- ferramentas: leitura pública (necessária para exibir as opções no formulário
-- público, conforme Etapa 3, seção 6), escrita restrita a administrador.
create policy "qualquer um le ferramentas ativas" on ferramentas for select using (true);
create policy "admin gerencia ferramentas" on ferramentas for all using (is_admin_ativo());

-- perfis_admin: cada usuário lê o próprio registro; gestão de outros usuários é
-- manual pela própria Vecorion nesta fase (Etapa 3, seção 6).
create policy "usuario le proprio perfil" on perfis_admin for select using (auth.uid() = user_id);

-- ============================================================================
-- STORAGE — bucket privado de arquivos do módulo (Etapa 3, estratégia Supabase)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('diagnostico-arquivos', 'diagnostico-arquivos', false)
on conflict (id) do nothing;

create policy "admin le arquivos do storage"
  on storage.objects for select
  using (bucket_id = 'diagnostico-arquivos' and is_admin_ativo());
-- Upload em si acontece via SUPABASE_SERVICE_ROLE_KEY (ignora RLS), mesmo
-- padrão das tabelas acima.
