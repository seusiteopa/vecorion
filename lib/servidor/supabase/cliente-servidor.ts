import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env } from "@/lib/servidor/env";

/**
 * Cliente vinculado à sessão do usuário autenticado (cookies da requisição) — usado
 * nas rotas do painel administrativo. Ao contrário do cliente admin (chave de
 * serviço), este respeita Row Level Security normalmente: só enxerga o que a
 * sessão atual tem permissão de ver (Etapa 3, estratégia Supabase — "um padrão
 * comum e bem suportado pelo Supabase").
 */
export function criarClienteServidor() {
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(nome: string) {
        return cookieStore.get(nome)?.value;
      },
      set(nome: string, valor: string, opcoes: CookieOptions) {
        try {
          cookieStore.set({ name: nome, value: valor, ...opcoes });
        } catch {
          // chamado de um Server Component em vez de um Route Handler/Server Action —
          // é seguro ignorar, o middleware (ver middleware.ts) já cuida de renovar sessão.
        }
      },
      remove(nome: string, opcoes: CookieOptions) {
        try {
          cookieStore.set({ name: nome, value: "", ...opcoes });
        } catch {
          // ver nota acima.
        }
      },
    },
  });
}
