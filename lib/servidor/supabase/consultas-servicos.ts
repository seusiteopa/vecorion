import "server-only";
import { criarClienteAdmin } from "./cliente-admin";
import { criarClienteServidor } from "./cliente-servidor";
import { ErroInterno, ErroNaoEncontrado } from "@/lib/servidor/erros";
import { log } from "@/lib/servidor/log";
import type { EntradaCriarBriefingServico } from "@/lib/validacao/servico-briefing";

/**
 * Integração com a Plataforma Vecorion interna (repositório
 * `plataforma-vecorion`, projeto Netlify separado) — MESMO projeto
 * Supabase deste site (`env.supabaseUrl`/`env.supabaseServiceRoleKey`
 * já apontam pra lá, nenhuma variável de ambiente nova precisa ser
 * criada). As tabelas usadas aqui (`servicos`, `leads`, `briefings`,
 * `profiles`, `arquivos`) pertencem ao schema daquele outro projeto, não
 * a este — nunca confundir com `solicitacoes`/`clientes`/`analises`
 * (schema PRÓPRIO deste site, ver supabase/schema.sql).
 *
 * Fluxo (decidido junto com o dono do produto): briefing enviado por
 * aqui vira Lead + Briefing de verdade na Plataforma, no mesmo funil que
 * um vendedor já usa — não fica numa tabela separada só pra consulta.
 */

export interface ServicoPublico {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  preco: number;
}

/**
 * Leitura pública — usa o cliente com chave anônima (não a privilegiada),
 * respeitando a policy `servicos_select_publico_ativos` (migration 0026
 * do outro repositório): só enxerga serviços com `status = 'ativo'`.
 */
export async function listarServicosAtivos(): Promise<ServicoPublico[]> {
  const supabase = criarClienteServidor();
  const { data, error } = await supabase
    .from("servicos")
    .select("id, nome, descricao, categoria, preco")
    .eq("status", "ativo")
    .order("categoria", { ascending: true });

  if (error) {
    log.erro("falha_ao_listar_servicos_plataforma", { mensagem: error.message });
    throw new ErroInterno("Não foi possível carregar os serviços.", error);
  }

  return data ?? [];
}

export async function buscarServicoPublicoPorId(id: string): Promise<ServicoPublico | null> {
  const supabase = criarClienteServidor();
  const { data, error } = await supabase
    .from("servicos")
    .select("id, nome, descricao, categoria, preco")
    .eq("id", id)
    .eq("status", "ativo")
    .maybeSingle();

  if (error) {
    log.erro("falha_ao_buscar_servico_plataforma", { servicoId: id, mensagem: error.message });
    throw new ErroInterno("Não foi possível carregar o serviço.", error);
  }

  return data;
}

/**
 * `leads.vendedor_id` e `briefings.vendedor_id` são obrigatórios no
 * schema da Plataforma (nunca nulos) — mas um lead vindo do site público
 * ainda não tem vendedor "dono" de verdade até alguém da equipe assumir.
 * Resolve pro primeiro Vendedor ativo (ordem de cadastro); sem nenhum
 * Vendedor, cai pro primeiro Admin — mesma estratégia de "responsável
 * provisório" já usada dentro da própria Plataforma
 * (`buscarPrimeiroExecutivoId`, lib/dados/projeto.ts) para o mesmo tipo
 * de lacuna (responsável obrigatório, ainda não atribuído por uma pessoa).
 */
async function resolverVendedorPadrao(
  supabase: ReturnType<typeof criarClienteAdmin>,
): Promise<string> {
  const { data: vendedor } = await supabase
    .from("profiles")
    .select("id")
    .eq("papel", "vendedor")
    .eq("ativo", true)
    .order("criado_em", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (vendedor) return vendedor.id as string;

  const { data: admin, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("papel", "admin")
    .eq("ativo", true)
    .order("criado_em", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !admin) {
    log.erro("falha_ao_resolver_vendedor_padrao", { mensagem: error?.message ?? "nenhum admin ativo encontrado" });
    throw new ErroInterno("Não foi possível processar sua solicitação no momento.", error);
  }

  return admin.id as string;
}

export interface ResultadoCriacaoBriefing {
  leadId: string;
  briefingId: string;
  vendedorId: string;
}

export async function criarLeadEBriefingDoServico(
  servico: ServicoPublico,
  dados: EntradaCriarBriefingServico,
): Promise<ResultadoCriacaoBriefing> {
  const supabase = criarClienteAdmin();
  const vendedorId = await resolverVendedorPadrao(supabase);

  const { data: lead, error: erroLead } = await supabase
    .from("leads")
    .insert({
      nome_cliente: dados.nome,
      contato: `${dados.email} / ${dados.telefone}`,
      origem: "Site institucional",
      vendedor_id: vendedorId,
      status: "novo",
    })
    .select("id")
    .single();

  if (erroLead || !lead) {
    log.erro("falha_ao_criar_lead_do_servico", { servicoId: servico.id, mensagem: erroLead?.message });
    throw new ErroInterno("Não foi possível registrar seus dados. Tente novamente.", erroLead);
  }

  // Nasce em 'rascunho', não já 'enviado_para_aprovacao' — de propósito:
  // ninguém da equipe revisou ainda o que o cliente escreveu; o vendedor
  // designado completa/ajusta antes de formalmente submeter pra aprovação
  // (mesma UI que já existe em /leads/{id} na Plataforma).
  const { data: briefing, error: erroBriefing } = await supabase
    .from("briefings")
    .insert({
      lead_id: lead.id,
      vendedor_id: vendedorId,
      status: "rascunho",
      conteudo: {
        titulo: `${servico.nome} — ${dados.empresa || dados.nome}`,
        descricao: dados.descricaoProjeto,
        requisitos: dados.requisitos || "",
        linksReferencia: dados.linkReferencia ? [dados.linkReferencia] : [],
        servicoNome: servico.nome,
        origem: "site_institucional",
      },
    })
    .select("id")
    .single();

  if (erroBriefing || !briefing) {
    log.erro("falha_ao_criar_briefing_do_servico", { leadId: lead.id, mensagem: erroBriefing?.message });
    throw new ErroInterno("Seus dados foram registrados, mas houve uma falha ao salvar o briefing.", erroBriefing);
  }

  log.info("lead_e_briefing_criados_via_servico", { leadId: lead.id, briefingId: briefing.id, servicoId: servico.id });

  return { leadId: lead.id as string, briefingId: briefing.id as string, vendedorId };
}

const BUCKET_REFERENCIAS = "referencias-briefing";

/**
 * Upload de arquivo de referência anexado ao briefing — mesmo bucket que
 * o Editor interno da Plataforma já usa (`lib/actions/briefings.ts`,
 * `anexarArquivoBriefing`), mesma convenção de caminho
 * (`{briefing_id}/{timestamp}-{nome}`) — pra um arquivo enviado por aqui
 * aparecer exatamente igual a um enviado de dentro da Plataforma.
 */
export async function registrarArquivoDoBriefing(
  briefingId: string,
  arquivo: { nome: string; tipo: string; bytes: ArrayBuffer },
): Promise<void> {
  const supabase = criarClienteAdmin();

  // Busca o vendedor responsável a partir do próprio briefing, em vez de
  // exigir que o formulário público repasse esse dado interno de volta
  // numa segunda chamada — o cliente do formulário só precisa saber o
  // `briefingId`, nada da estrutura interna da Plataforma.
  const { data: briefingExistente, error: erroBusca } = await supabase
    .from("briefings")
    .select("vendedor_id")
    .eq("id", briefingId)
    .maybeSingle();

  if (erroBusca || !briefingExistente) {
    log.aviso("falha_ao_buscar_briefing_para_arquivo", { briefingId, mensagem: erroBusca?.message });
    return;
  }

  const nomeSanitizado = arquivo.nome.replace(/[^a-zA-Z0-9._-]/g, "_");
  const caminho = `${briefingId}/${Date.now()}-${nomeSanitizado}`;

  const { error: erroUpload } = await supabase.storage
    .from(BUCKET_REFERENCIAS)
    .upload(caminho, arquivo.bytes, { contentType: arquivo.tipo || "application/octet-stream" });

  if (erroUpload) {
    // Não derruba o fluxo principal (lead/briefing já foram criados) —
    // mesma regra de "falha secundária nunca condiciona a operação
    // principal" já aplicada em vincularFerramentas, acima neste arquivo.
    log.aviso("falha_ao_enviar_arquivo_briefing_servico", { briefingId, mensagem: erroUpload.message });
    return;
  }

  const { error: erroRegistro } = await supabase.from("arquivos").insert({
    briefing_id: briefingId,
    enviado_por: briefingExistente.vendedor_id,
    nome_arquivo: arquivo.nome,
    caminho_storage: caminho,
    tipo: "referencia",
  });

  if (erroRegistro) {
    log.aviso("falha_ao_registrar_arquivo_briefing_servico", { briefingId, mensagem: erroRegistro.message });
  }
}
