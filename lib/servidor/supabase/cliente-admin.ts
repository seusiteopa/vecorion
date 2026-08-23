import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/servidor/env";

/**
 * Cliente com a chave de serviço (privilegiada) — usado exclusivamente dentro de
 * Route Handlers para as operações que o visitante público pode disparar (criar
 * solicitação, enviar arquivo), já que ele nunca tem sessão própria (Etapa 2/3:
 * "nenhuma escrita direta do navegador no banco").
 *
 * O pacote "server-only" garante, em tempo de build, que este arquivo nunca seja
 * incluído acidentalmente num bundle de cliente — se algum componente de interface
 * importar isto por engano, o build falha, em vez de vazar a chave silenciosamente.
 */
export function criarClienteAdmin() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
