import { NextRequest, NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { criarClienteServidor } from "@/lib/servidor/supabase/cliente-servidor";
import { obterPerfilAdminAtual } from "@/lib/servidor/auth/sessao";
import { ErroNaoAutenticado, ErroValidacao } from "@/lib/servidor/erros";
import { log } from "@/lib/servidor/log";

/**
 * POST /api/diagnostico/auth/login — autentica via Supabase Auth e, na mesma
 * chamada, confirma que o usuário está presente em `perfis_admin` com `ativo =
 * true` (Etapa 3: login válido no Supabase Auth não é suficiente por si só).
 * Se a segunda checagem falhar, a sessão é imediatamente encerrada — nenhum
 * usuário autenticado no Supabase Auth, mas sem perfil administrativo, mantém
 * sessão válida no painel.
 */
export const POST = comTratamentoDeErro(async (request: NextRequest) => {
  const corpo = await request.json().catch(() => {
    throw new ErroValidacao("Corpo da requisição inválido.");
  });

  const email = typeof corpo?.email === "string" ? corpo.email.trim() : "";
  const senha = typeof corpo?.senha === "string" ? corpo.senha : "";

  if (!email || !senha) {
    throw new ErroValidacao("Informe e-mail e senha.");
  }

  const supabase = criarClienteServidor();

  const { error: erroLogin } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (erroLogin) {
    log.aviso("tentativa_login_falhou", { email });
    throw new ErroNaoAutenticado("E-mail ou senha inválidos.");
  }

  const perfil = await obterPerfilAdminAtual();
  if (!perfil) {
    // Autenticou no Supabase Auth, mas não tem perfil administrativo ativo —
    // encerra a sessão imediatamente em vez de deixá-la válida sem propósito.
    await supabase.auth.signOut();
    log.aviso("login_sem_perfil_admin_ativo", { email });
    throw new ErroNaoAutenticado("Este usuário não tem acesso ao painel administrativo.");
  }

  log.info("login_admin_bem_sucedido", { userId: perfil.userId });

  return NextResponse.json({ nome: perfil.nome, papel: perfil.papel });
});
