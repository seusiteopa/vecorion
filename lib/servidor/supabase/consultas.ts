import "server-only";
import { criarClienteAdmin } from "./cliente-admin";
import { criarClienteServidor } from "./cliente-servidor";
import { ErroInterno, ErroNaoEncontrado } from "@/lib/servidor/erros";
import { log } from "@/lib/servidor/log";
import { STATUS_INICIAL } from "@/lib/dominio/status";
import type { EntradaAtualizarSolicitacao, EntradaCriarSolicitacao } from "@/lib/validacao/solicitacao";

/**
 * Camada de Acesso a Dados (Etapa 2/7): única parte do sistema que fala com o
 * Supabase. Toda função aqui recebe um "modo" implícito pelo cliente que usa —
 * `criarClienteAdmin()` para as operações públicas do formulário (mediadas pelo
 * servidor, nunca pelo navegador do visitante), `criarClienteServidor()` para as
 * operações do painel (respeitando a sessão/RLS do administrador autenticado).
 *
 * Todo erro de infraestrutura vira `ErroInterno` antes de sair daqui — nenhuma
 * mensagem de erro do Postgres/Supabase chega a um Route Handler sem passar por
 * este filtro (Etapa 7, seção 6/9: nunca expor detalhe interno ao cliente).
 */

// ---------------------------------------------------------------------------
// SOLICITAÇÕES (+ CLIENTES)
// ---------------------------------------------------------------------------

/**
 * Cria o cliente e a solicitação em sequência. Usa o cliente privilegiado porque
 * esta é a única escrita que o visitante público pode disparar (Etapa 3, regra de
 * segurança: "escrita pública só na criação de uma nova solicitação").
 */
export async function criarClienteESolicitacao(dados: EntradaCriarSolicitacao) {
  const supabase = criarClienteAdmin();

  const { data: cliente, error: erroCliente } = await supabase
    .from("clientes")
    .insert({
      nome: dados.nome,
      empresa: dados.empresa,
      email: dados.email,
      telefone: dados.whatsapp,
      cargo: dados.cargo || null,
      segmento: dados.segmento || null,
      site_empresa: dados.siteEmpresa || null,
    })
    .select("id")
    .single();

  if (erroCliente || !cliente) {
    log.erro("falha_ao_criar_cliente", { mensagem: erroCliente?.message ?? "sem dado retornado" });
    throw new ErroInterno("Não foi possível registrar seus dados. Tente novamente.", erroCliente);
  }

  const { data: solicitacao, error: erroSolicitacao } = await supabase
    .from("solicitacoes")
    .insert({
      cliente_id: cliente.id,
      problema: dados.problema,
      processo_atual: dados.processoAtual,
      faixa_pessoas: dados.faixaPessoas,
      pessoas_envolvidas_desc: dados.pessoasEnvolvidasDescricao || null,
      frequencia: dados.frequencia,
      tempo_gasto: dados.tempoGasto || null,
      ferramentas_manter: dados.ferramentasManter || null,
      objetivo: dados.objetivo,
      impacto_esperado: dados.impactoEsperado,
      contato_preferido: dados.contatoPreferido,
      melhor_horario: dados.melhorHorario || null,
      status: STATUS_INICIAL,
    })
    .select("id, criado_em")
    .single();

  if (erroSolicitacao || !solicitacao) {
    log.erro("falha_ao_criar_solicitacao", {
      clienteId: cliente.id,
      mensagem: erroSolicitacao?.message ?? "sem dado retornado",
    });
    throw new ErroInterno("Não foi possível registrar sua solicitação. Tente novamente.", erroSolicitacao);
  }

  // Ferramentas selecionadas viram registros na tabela de associação (Etapa 3, N:N).
  if (dados.ferramentas.length > 0) {
    await vincularFerramentas(supabase, solicitacao.id, dados.ferramentas);
  }

  log.info("solicitacao_criada", { solicitacaoId: solicitacao.id, clienteId: cliente.id });

  return { solicitacaoId: solicitacao.id as string, criadoEm: solicitacao.criado_em as string };
}

async function vincularFerramentas(
  supabase: ReturnType<typeof criarClienteAdmin>,
  solicitacaoId: string,
  nomesFerramentas: string[],
) {
  // Busca as ferramentas já cadastradas pelo nome; cria as que ainda não existirem
  // (ex.: quando o visitante digitou algo em "outro" que ainda não está no catálogo).
  const { data: existentes } = await supabase.from("ferramentas").select("id, nome").in("nome", nomesFerramentas);

  const existentesPorNome = new Map((existentes ?? []).map((f) => [f.nome, f.id]));
  const faltantes = nomesFerramentas.filter((nome) => !existentesPorNome.has(nome));

  if (faltantes.length > 0) {
    const { data: criadas, error } = await supabase
      .from("ferramentas")
      .insert(faltantes.map((nome) => ({ nome, ativo: true })))
      .select("id, nome");

    if (error) {
      // Falha ao vincular ferramenta não pode derrubar a criação da solicitação em si
      // (Etapa 4, seção 10: falha secundária nunca condiciona a operação principal).
      log.aviso("falha_ao_criar_ferramentas", { solicitacaoId, mensagem: error.message });
    } else {
      for (const f of criadas ?? []) existentesPorNome.set(f.nome, f.id);
    }
  }

  const vinculos = nomesFerramentas
    .filter((nome) => existentesPorNome.has(nome))
    .map((nome) => ({ solicitacao_id: solicitacaoId, ferramenta_id: existentesPorNome.get(nome) }));

  if (vinculos.length > 0) {
    const { error } = await supabase.from("solicitacao_ferramentas").insert(vinculos);
    if (error) {
      log.aviso("falha_ao_vincular_ferramentas", { solicitacaoId, mensagem: error.message });
    }
  }
}

/** Leitura administrativa — usa o cliente vinculado à sessão (RLS decide o que é visível). */
export async function listarSolicitacoes(filtroStatus?: string) {
  const supabase = criarClienteServidor();

  let consulta = supabase
    .from("solicitacoes")
    .select(
      "id, problema, status, prioridade, criado_em, clientes(nome, empresa, email, telefone, cargo, segmento)",
    )
    .order("criado_em", { ascending: false });

  if (filtroStatus) {
    consulta = consulta.eq("status", filtroStatus);
  }

  const { data, error } = await consulta;

  if (error) {
    log.erro("falha_ao_listar_solicitacoes", { mensagem: error.message });
    throw new ErroInterno("Não foi possível carregar as solicitações.", error);
  }

  return data ?? [];
}

export async function buscarSolicitacaoDetalhada(id: string) {
  const supabase = criarClienteServidor();

  const { data: solicitacao, error } = await supabase
    .from("solicitacoes")
    .select(
      `id, problema, processo_atual, faixa_pessoas, pessoas_envolvidas_desc, frequencia,
       tempo_gasto, ferramentas_manter, objetivo, impacto_esperado, contato_preferido,
       melhor_horario, status, prioridade, criado_em,
       clientes(nome, empresa, email, telefone, cargo, segmento),
       arquivos(id, nome_original, tipo_mime, tamanho_bytes, caminho_storage, enviado_em),
       solicitacao_ferramentas(ferramentas(nome))`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    log.erro("falha_ao_buscar_solicitacao", { solicitacaoId: id, mensagem: error.message });
    throw new ErroInterno("Não foi possível carregar a solicitação.", error);
  }

  if (!solicitacao) {
    throw new ErroNaoEncontrado("Solicitação não encontrada.");
  }

  return solicitacao;
}

export async function atualizarSolicitacao(id: string, dados: EntradaAtualizarSolicitacao) {
  const supabase = criarClienteServidor();

  const atualizacao: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
  if (dados.status !== undefined) atualizacao.status = dados.status;
  if (dados.prioridade !== undefined) atualizacao.prioridade = dados.prioridade;

  const { data, error } = await supabase
    .from("solicitacoes")
    .update(atualizacao)
    .eq("id", id)
    .select("id, status, prioridade, atualizado_em")
    .maybeSingle();

  if (error) {
    log.erro("falha_ao_atualizar_solicitacao", { solicitacaoId: id, mensagem: error.message });
    throw new ErroInterno("Não foi possível atualizar a solicitação.", error);
  }

  if (!data) {
    throw new ErroNaoEncontrado("Solicitação não encontrada.");
  }

  log.info("solicitacao_atualizada", { solicitacaoId: id, status: dados.status ?? null });

  return data;
}

/**
 * Confirma que o identificador de solicitação é real antes de aceitar um upload
 * vinculado a ele — reduz a superfície de abuso do endpoint público de arquivos
 * (Etapa 9, reforço de segurança sobre o contrato já definido na Etapa 7).
 */
export async function solicitacaoExiste(id: string): Promise<boolean> {
  const supabase = criarClienteAdmin();
  const { data, error } = await supabase.from("solicitacoes").select("id").eq("id", id).maybeSingle();

  if (error) {
    log.erro("falha_ao_verificar_solicitacao", { solicitacaoId: id, mensagem: error.message });
    throw new ErroInterno("Não foi possível verificar a solicitação.", error);
  }

  return Boolean(data);
}

// ---------------------------------------------------------------------------
// ARQUIVOS
// ---------------------------------------------------------------------------

const BUCKET_ARQUIVOS = "diagnostico-arquivos";

/**
 * Envia o binário ao Storage e grava o registro em `arquivos` na mesma operação —
 * usa o cliente privilegiado pelo mesmo motivo da criação de solicitação (upload é
 * público, mediado pelo servidor). Bucket privado, caminho organizado por
 * solicitação (Etapa 3, estratégia Supabase).
 */
export async function registrarArquivo(
  solicitacaoId: string,
  arquivo: { nome: string; tipo: string; tamanho: number; bytes: ArrayBuffer },
) {
  const supabase = criarClienteAdmin();
  const caminho = `${solicitacaoId}/${Date.now()}-${arquivo.nome}`;

  const { error: erroUpload } = await supabase.storage
    .from(BUCKET_ARQUIVOS)
    .upload(caminho, arquivo.bytes, { contentType: arquivo.tipo, upsert: false });

  if (erroUpload) {
    log.erro("falha_ao_enviar_arquivo", { solicitacaoId, mensagem: erroUpload.message });
    throw new ErroInterno("Não foi possível enviar o arquivo.", erroUpload);
  }

  const { data, error: erroRegistro } = await supabase
    .from("arquivos")
    .insert({
      solicitacao_id: solicitacaoId,
      nome_original: arquivo.nome,
      tipo_mime: arquivo.tipo,
      tamanho_bytes: arquivo.tamanho,
      caminho_storage: caminho,
    })
    .select("id, enviado_em")
    .single();

  if (erroRegistro || !data) {
    log.erro("falha_ao_registrar_arquivo", { solicitacaoId, mensagem: erroRegistro?.message });
    throw new ErroInterno("Não foi possível registrar o arquivo.", erroRegistro);
  }

  log.info("arquivo_registrado", { solicitacaoId, arquivoId: data.id });

  return { arquivoId: data.id as string, enviadoEm: data.enviado_em as string };
}

/** Link assinado de curta duração — nunca URL pública fixa (Etapa 3, estratégia Supabase). */
export async function gerarLinkAssinadoArquivo(caminhoStorage: string, expiraEmSegundos = 300) {
  const supabase = criarClienteServidor();

  const { data, error } = await supabase.storage
    .from(BUCKET_ARQUIVOS)
    .createSignedUrl(caminhoStorage, expiraEmSegundos);

  if (error || !data) {
    log.erro("falha_ao_gerar_link_arquivo", { caminhoStorage, mensagem: error?.message });
    throw new ErroInterno("Não foi possível gerar o link do arquivo.", error);
  }

  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// ANÁLISES
// ---------------------------------------------------------------------------

/**
 * Grava uma nova análise e marca as anteriores da mesma solicitação como não
 * vigentes — modelo de histórico decidido na Etapa 3 (versao + vigente).
 * A geração do conteúdo em si (chamada à IA) é responsabilidade da camada de
 * Aplicação/Integração, não desta função — aqui só persiste o resultado já pronto.
 */
export async function registrarAnalise(
  solicitacaoId: string,
  autorUserId: string,
  conteudo: {
    gargalos: string;
    oportunidades: string;
    solucoesSugeridas: string;
    automacoesSugeridas: string;
    aplicacoesIa: string;
    tecnologiasSugeridas: string[];
    complexidade: string;
    estimativaInicial: string;
    observacoes: string;
    perguntasPendentes: string[];
  },
) {
  const supabase = criarClienteServidor();

  const { data: ultimaVersao } = await supabase
    .from("analises")
    .select("versao")
    .eq("solicitacao_id", solicitacaoId)
    .order("versao", { ascending: false })
    .limit(1)
    .maybeSingle();

  const proximaVersao = (ultimaVersao?.versao ?? 0) + 1;

  await supabase.from("analises").update({ vigente: false }).eq("solicitacao_id", solicitacaoId);

  const { data, error } = await supabase
    .from("analises")
    .insert({
      solicitacao_id: solicitacaoId,
      versao: proximaVersao,
      vigente: true,
      gargalos: conteudo.gargalos,
      oportunidades: conteudo.oportunidades,
      solucoes_sugeridas: conteudo.solucoesSugeridas,
      automacoes_sugeridas: conteudo.automacoesSugeridas,
      aplicacoes_ia: conteudo.aplicacoesIa,
      tecnologias_sugeridas: conteudo.tecnologiasSugeridas,
      complexidade: conteudo.complexidade,
      estimativa_inicial: conteudo.estimativaInicial,
      observacoes: conteudo.observacoes,
      perguntas_pendentes: conteudo.perguntasPendentes,
      gerado_por: autorUserId,
    })
    .select("id, versao, gerado_em")
    .single();

  if (error || !data) {
    log.erro("falha_ao_registrar_analise", { solicitacaoId, mensagem: error?.message });
    throw new ErroInterno("Não foi possível registrar a análise.", error);
  }

  log.info("analise_registrada", { solicitacaoId, analiseId: data.id, versao: proximaVersao, autorUserId });

  return data;
}

export async function buscarAnaliseVigente(solicitacaoId: string) {
  const supabase = criarClienteServidor();

  const { data, error } = await supabase
    .from("analises")
    .select("*")
    .eq("solicitacao_id", solicitacaoId)
    .eq("vigente", true)
    .maybeSingle();

  if (error) {
    log.erro("falha_ao_buscar_analise", { solicitacaoId, mensagem: error.message });
    throw new ErroInterno("Não foi possível carregar a análise.", error);
  }

  return data;
}
