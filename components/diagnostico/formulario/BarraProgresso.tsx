type BarraProgressoProps = {
  etapaAtual: number;
  totalEtapas: number;
};

/**
 * Sempre visível durante o wizard (nunca escondida) — decisão de UX da Etapa 5/9:
 * o visitante precisa saber exatamente quanto falta, já que o formulário é longo.
 */
export default function BarraProgresso({ etapaAtual, totalEtapas }: BarraProgressoProps) {
  const percentual = Math.round((etapaAtual / totalEtapas) * 100);

  return (
    <div className="flex flex-col gap-2" role="progressbar" aria-valuenow={etapaAtual} aria-valuemin={1} aria-valuemax={totalEtapas}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink/60">
        <span>
          Etapa {etapaAtual} de {totalEtapas}
        </span>
        <span>{percentual}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
