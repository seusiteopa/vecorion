"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { FAQ_ITEMS } from "@/lib/constants";

type FaqAccordionProps = {
  limit?: number;
  showHeading?: boolean;
  /** "h2" (padrão, usado no resumo da Home) ou "h1" (usado na página /faq, onde é o título principal). */
  headingAs?: "h1" | "h2";
};

/**
 * Usado tanto na Home (resumo, via `limit`) quanto na página /faq (completa).
 * Sempre 1 item aberto por vez, conforme decisão de UX da Etapa 3.
 * Transição de altura via CSS grid-template-rows (0fr -> 1fr), técnica que anima
 * suavemente sem precisar medir altura em JS nem depender de bibliotecas externas.
 */
export default function FaqAccordion({ limit, showHeading = true, headingAs = "h2" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section className="section-y">
      <Container className="flex flex-col gap-10">
        {showHeading && (
          <Reveal>
            <SectionHeading
              as={headingAs}
              eyebrow="Dúvidas"
              title="Perguntas frequentes"
              description="Se sua dúvida não estiver aqui, é só chamar no WhatsApp."
            />
          </Reveal>
        )}

        <div className="mx-auto flex w-full max-w-2xl flex-col divide-y divide-black/5">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 rounded-card px-2 py-5 text-left transition-colors hover:bg-mist"
                >
                  <span className="text-base font-medium text-ink">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={`text-xl text-brand transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${index}`}
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p className="px-2 pb-5 text-sm text-ink/70">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
