import { NextResponse } from "next/server";
import { comTratamentoDeErro } from "@/lib/servidor/manipulador-rota";
import { criarClienteServidor } from "@/lib/servidor/supabase/cliente-servidor";

export const POST = comTratamentoDeErro(async () => {
  const supabase = criarClienteServidor();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
});
