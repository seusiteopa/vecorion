"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { CampoTexto } from "@/components/diagnostico/formulario/CamposFormulario";

/**
 * Login administrativo — agora chama o endpoint real (Etapa 9), que autentica via
 * Supabase Auth e confirma presença ativa em `perfis_admin`. Nenhuma outra parte
 * desta tela mudou desde a Etapa 8, exatamente como planejado.
 */
export default function LoginAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function autenticar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!email || !senha) {
      setErro("Informe e-mail e senha.");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await fetch("/api/diagnostico/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        setErro(corpo?.erro?.mensagem ?? "Não foi possível entrar.");
        return;
      }

      router.push("/diagnostico/admin");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <Container className="mx-auto flex max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <Logo tone="light" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-paper">Painel administrativo</h1>
            <p className="text-sm text-paper/60">Acesso restrito à equipe Vecorion</p>
          </div>
        </div>

        <form onSubmit={autenticar} className="flex flex-col gap-4 rounded-card bg-paper p-6">
          <CampoTexto label="E-mail" type="email" value={email} onChange={setEmail} obrigatorio />
          <CampoTexto label="Senha" type="password" value={senha} onChange={setSenha} obrigatorio />
          {erro && (
            <p role="alert" className="text-sm font-medium text-danger">
              {erro}
            </p>
          )}
          <Button as="button" type="submit" variant="primary" disabled={enviando} className="mt-2">
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Container>
    </div>
  );
}
