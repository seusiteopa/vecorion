"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Único componente "client" do layout — precisa de estado local (aberto/fechado).
 * Isolado aqui para manter Header e Footer como Server Components.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-card text-ink"
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 z-40 flex flex-col gap-1 border-b border-black/5 bg-paper px-4 pb-6 pt-2 shadow-lg sm:top-20"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-card px-3 py-3 text-base font-medium text-ink hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3">
            <WhatsAppButton className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
