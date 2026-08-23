/**
 * Log estruturado do lado do servidor. Ferramenta e retenção definitivas (painel da
 * Netlify/Supabase vs. serviço externo dedicado) permanecem em aberto, conforme já
 * registrado na Etapa 7 — por ora, escreve em `console` com formato consistente e
 * `nivel`/`evento` sempre presentes, para que qualquer ferramenta de coleta de log
 * (atual ou futura) consiga indexar por esses campos sem mudança de código.
 *
 * Nunca loga dado sensível em texto livre além do necessário para depuração
 * (Etapa 7, seção 11) — por isso `contexto` é sempre um objeto plano com chaves
 * explícitas, nunca o corpo inteiro de uma requisição.
 */

type Nivel = "info" | "aviso" | "erro";

type Contexto = Record<string, string | number | boolean | null | undefined>;

function registrar(nivel: Nivel, evento: string, contexto?: Contexto) {
  const linha = {
    timestamp: new Date().toISOString(),
    nivel,
    evento,
    ...contexto,
  };

  const mensagem = JSON.stringify(linha);
  if (nivel === "erro") {
    console.error(mensagem);
  } else if (nivel === "aviso") {
    console.warn(mensagem);
  } else {
    console.log(mensagem);
  }
}

export const log = {
  info: (evento: string, contexto?: Contexto) => registrar("info", evento, contexto),
  aviso: (evento: string, contexto?: Contexto) => registrar("aviso", evento, contexto),
  erro: (evento: string, contexto?: Contexto) => registrar("erro", evento, contexto),
};
