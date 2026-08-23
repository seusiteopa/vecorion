import "server-only";
import { criarClienteServidor } from "@/lib/servidor/supabase/cliente-servidor";
import { ErroNaoAutenticado, ErroNaoAutorizado } from "@/lib/servidor/erros";
import { log } from "@/lib/servidor/log";

export type PerfilAdmin = {
  userId: string;
  nome: string;
  papel: "admin" | "analista";
  ativo: boolean;
};

/**
 * Retorna o perfil do administrador autenticado, ou `null` se não houver sessão.
 * Não lança erro por conta própria — quem chama decide se a ausência de sessão é
 * um problema (ver `exigirSessaoAdmin` abaixo).
 */
export async function obterPerfilAdminAtual(): Promise<PerfilAdmin | null> {
  const supabase = criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Login válido no Supabase Auth não é suficiente por si só — a Etapa 3 exige
  // que o usuário também esteja presente em `perfis_admin` com `ativo = true`.
  const { data: perfil, error } = await supabase
    .from("perfis_admin")
    .select("user_id, nome, papel, ativo")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    log.erro("falha_ao_buscar_perfil_admin", { userId: user.id, mensagem: error.message });
    return null;
  }

  if (!perfil || !perfil.ativo) return null;

  return {
    userId: perfil.user_id,
    nome: perfil.nome,
    papel: perfil.papel,
    ativo: perfil.ativo,
  };
}

/**
 * Usada no início de todo Route Handler administrativo — lança erro padronizado
 * (401/403, ver lib/servidor/erros.ts) em vez de deixar cada endpoint reimplementar
 * essa checagem.
 */
export async function exigirSessaoAdmin(): Promise<PerfilAdmin> {
  const perfil = await obterPerfilAdminAtual();

  if (!perfil) {
    throw new ErroNaoAutenticado();
  }

  return perfil;
}

/** Reservada para quando houver ação restrita só ao papel "admin" (hoje nenhuma exige isso). */
export function exigirPapel(perfil: PerfilAdmin, papel: PerfilAdmin["papel"]) {
  if (perfil.papel !== papel) {
    throw new ErroNaoAutorizado();
  }
}
