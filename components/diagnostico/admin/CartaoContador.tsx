import Link from "next/link";

type CartaoContadorProps = {
  label: string;
  quantidade: number;
  href: string;
};

/** Clicável — leva direto à lista já filtrada por aquele status (Etapa 5/9). */
export default function CartaoContador({ label, quantidade, href }: CartaoContadorProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-card border border-black/5 bg-paper p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">{label}</span>
      <span className="text-3xl font-semibold text-ink">{quantidade}</span>
    </Link>
  );
}
