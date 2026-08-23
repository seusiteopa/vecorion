"use client";

import { FormEvent, useState } from "react";
import { CONTACT, whatsappHref } from "@/lib/constants";

/**
 * Regra explícita do briefing: "formulário de contato que abre apenas o
 * e-mail ou WhatsApp, sem armazenar dados". Não há fetch, não há estado
 * persistido além do preenchimento local do próprio formulário — os dados
 * só existem no navegador do visitante e são usados para montar o link.
 */
export default function ContactRedirectForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const buildWhatsappMessage = () => {
    const base = message || "Olá! Vim pelo site da Vecorion.";
    return name ? `${base} (${name})` : base;
  };

  const handleWhatsapp = (event: FormEvent) => {
    event.preventDefault();
    window.open(whatsappHref(buildWhatsappMessage()), "_blank", "noopener,noreferrer");
  };

  const handleEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!CONTACT.email) return;
    const subject = encodeURIComponent(`Contato pelo site — ${name || "Visitante"}`);
    const body = encodeURIComponent(message || "Olá! Vim pelo site da Vecorion.");
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="flex flex-col gap-4 rounded-card border border-black/5 bg-mist p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-card border border-black/10 bg-paper px-4 py-3 text-sm focus-visible:outline-2"
          placeholder="Como podemos te chamar?"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-card border border-black/10 bg-paper px-4 py-3 text-sm focus-visible:outline-2"
          placeholder="Conte um pouco sobre o seu projeto"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          onClick={handleWhatsapp}
          className="inline-flex flex-1 items-center justify-center rounded-card bg-brand px-6 py-3 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-lg hover:shadow-brand/20"
        >
          Enviar por WhatsApp
        </button>
        {CONTACT.email && (
          <button
            type="submit"
            onClick={handleEmail}
            className="inline-flex flex-1 items-center justify-center rounded-card border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
          >
            Enviar por e-mail
          </button>
        )}
      </div>

      <p className="text-xs text-ink/65">
        Nenhuma informação preenchida aqui é armazenada — o formulário apenas abre o WhatsApp ou
        seu aplicativo de e-mail com a mensagem pronta.
      </p>
    </form>
  );
}
