import "server-only";
import { env } from "@/lib/servidor/env";
import { log } from "@/lib/servidor/log";

/**
 * Adaptador de notificação por e-mail — implementação real (Etapa 10), via API
 * REST da Brevo com `fetch` nativo (decisão de dependências da Etapa 7: nenhum
 * SDK necessário para esta integração).
 *
 * Nunca lança erro (Etapa 4, seção 4 e Etapa 9: "falha de notificação nunca pode
 * impedir a operação principal") — toda falha é capturada e logada aqui dentro,
 * quem chama esta função não precisa de try/catch.
 */

const URL_API = "https://api.brevo.com/v3/smtp/email";

export type NotificacaoNovaSolicitacao = {
  solicitacaoId: string;
  empresa: string;
  problemaResumido: string;
};

export async function notificarNovaSolicitacao(dados: NotificacaoNovaSolicitacao): Promise<void> {
  if (!env.brevoApiKey || !env.brevoDestinatarioNotificacao) {
    log.aviso("integracao_email_nao_configurada", { solicitacaoId: dados.solicitacaoId });
    return;
  }

  const linkPainel = `${env.siteUrl}/diagnostico/admin/solicitacao/${dados.solicitacaoId}`;

  const corpoHtml = `
    <p><strong>Nova solicitação recebida no Diagnóstico Digital.</strong></p>
    <p><strong>Empresa:</strong> ${escaparHtml(dados.empresa)}</p>
    <p><strong>Problema (resumo):</strong> ${escaparHtml(dados.problemaResumido)}</p>
    <p><a href="${linkPainel}">Ver solicitação completa no painel</a></p>
  `.trim();

  try {
    const resposta = await fetch(URL_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "api-key": env.brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: "Vecorion — Diagnóstico Digital", email: "diagnostico@vecorion.com.br" },
        to: [{ email: env.brevoDestinatarioNotificacao }],
        subject: `Novo diagnóstico recebido — ${dados.empresa}`,
        htmlContent: corpoHtml,
      }),
    });

    if (!resposta.ok) {
      const corpoErro = await resposta.text().catch(() => "");
      log.erro("falha_ao_enviar_notificacao_email", {
        solicitacaoId: dados.solicitacaoId,
        status: resposta.status,
        corpo: corpoErro.slice(0, 300),
      });
      return;
    }

    log.info("notificacao_email_enviada", { solicitacaoId: dados.solicitacaoId });
  } catch (erroRede) {
    log.erro("falha_de_rede_ao_notificar_email", {
      solicitacaoId: dados.solicitacaoId,
      mensagem: erroRede instanceof Error ? erroRede.message : String(erroRede),
    });
  }
}

/** Escape simples para interpolar dado do usuário em HTML de e-mail sem risco de injeção. */
function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
