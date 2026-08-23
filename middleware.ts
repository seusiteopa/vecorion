import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Verificação de sessão centralizada no middleware — não em cada página
 * individualmente (Etapa 7, seção 9: "evita esquecer alguma"). Roda antes de
 * qualquer renderização, para qualquer rota sob /diagnostico/admin, exceto a
 * própria tela de login (senão ninguém conseguiria chegar até ela).
 *
 * Esta camada só confirma que existe uma sessão válida no Supabase Auth — a
 * checagem mais específica (usuário presente em `perfis_admin`, ativo) acontece
 * de novo em `exigirSessaoAdmin` (lib/servidor/auth/sessao.ts), chamada por cada
 * Route Handler administrativo e pelo layout do painel. Isso é intencional, não
 * redundância acidental: o middleware roda em Edge Runtime, sem acesso prático a
 * uma consulta adicional de banco por requisição sem custo de latência — a
 * checagem completa (com `perfis_admin`) fica na camada de Aplicação, que já
 * paga esse custo de qualquer forma para buscar os dados da página.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ehRotaAdmin = pathname.startsWith("/diagnostico/admin");
  const ehTelaDeLogin = pathname === "/diagnostico/admin/login";

  if (!ehRotaAdmin || ehTelaDeLogin) {
    return NextResponse.next();
  }

  let resposta = NextResponse.next({ request: { headers: request.headers } });

  // Achado da bateria de QA (Etapa 11): sem variáveis de ambiente configuradas
  // (ou com valor inválido), a criação do cliente Supabase pode lançar de forma
  // síncrona — sem este try/catch, isso derrubava a rota inteira com 500 em vez
  // de simplesmente tratar como "sem sessão" e redirecionar ao login, que é o
  // comportamento seguro esperado.
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        cookies: {
          get(nome: string) {
            return request.cookies.get(nome)?.value;
          },
          set(nome: string, valor: string, opcoes: CookieOptions) {
            resposta = NextResponse.next({ request: { headers: request.headers } });
            resposta.cookies.set({ name: nome, value: valor, ...opcoes });
          },
          remove(nome: string, opcoes: CookieOptions) {
            resposta = NextResponse.next({ request: { headers: request.headers } });
            resposta.cookies.set({ name: nome, value: "", ...opcoes });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const urlLogin = new URL("/diagnostico/admin/login", request.url);
      return NextResponse.redirect(urlLogin);
    }

    return resposta;
  } catch {
    // Supabase mal configurado (env ausente/inválida) ou instável — trata como
    // "sem sessão" em vez de expor um erro 500 numa área administrativa.
    const urlLogin = new URL("/diagnostico/admin/login", request.url);
    return NextResponse.redirect(urlLogin);
  }
}

export const config = {
  matcher: ["/diagnostico/admin/:path*"],
};
