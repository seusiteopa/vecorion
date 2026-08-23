/**
 * Leitura centralizada das variáveis de ambiente do servidor (Etapa 7, seção 8).
 * Nunca lida diretamente em outro lugar do código — qualquer variável nova entra
 * aqui primeiro, para que uma configuração ausente falhe com mensagem clara em vez
 * de um erro obscuro no meio de uma consulta ao banco.
 */

function exigir(nome: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(
      `Variável de ambiente "${nome}" não configurada. Verifique o arquivo .env.local ` +
        `(desenvolvimento) ou a configuração de ambiente da Netlify (produção).`,
    );
  }
  return valor;
}

/** Só lê quando efetivamente chamado (nunca no carregamento do módulo) — build sem env vars não quebra. */
export const env = {
  get supabaseUrl() {
    return exigir("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  },
  get supabaseAnonKey() {
    return exigir("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  },
  get supabaseServiceRoleKey() {
    return exigir("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
  },
  get anthropicApiKey() {
    return process.env.ANTHROPIC_API_KEY; // opcional nesta etapa (Etapa 10 conecta de fato)
  },
  get brevoApiKey() {
    return process.env.BREVO_API_KEY; // opcional nesta etapa (Etapa 10 conecta de fato)
  },
  get brevoDestinatarioNotificacao() {
    return process.env.BREVO_DESTINATARIO_NOTIFICACAO;
  },
  get siteUrl() {
    return process.env.SITE_URL ?? "http://localhost:3000";
  },
};
