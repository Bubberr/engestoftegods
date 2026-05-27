'use client';

import { beregnPris, formatKr } from '../lib/standtyper';

export default function PrisSammendrag({ stand_type, antal_borde, antal_stole }) {
  const { standleje, borde, stole, total } = beregnPris({
    stand_type,
    antal_borde,
    antal_stole,
  });

  if (!stand_type) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400">
        Vælg en standtype for at se pris
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-jule-gold/30 bg-jule-cream p-4">
      <h3 className="text-sm font-semibold text-jule-brown uppercase tracking-wide mb-3">
        🎄 Prissammendrag (ekskl. moms)
      </h3>

      <div className="space-y-1.5 text-sm">
        <PrisRække label={`Standleje (${stand_type})`} beloeb={standleje} />
        {borde > 0 && (
          <PrisRække label={`Borde (${antal_borde} stk.)`} beloeb={borde} />
        )}
        {stole > 0 && (
          <PrisRække label={`Stole (${antal_stole} stk.)`} beloeb={stole} />
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-jule-gold/30 flex justify-between items-center">
        <span className="font-semibold text-jule-brown">Total ekskl. moms</span>
        <span className="text-xl font-bold text-jule-red">{formatKr(total)}</span>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Moms (25%) tillægges ved fakturering: {formatKr(Math.round(total * 1.25))} inkl. moms
      </p>
    </div>
  );
}

function PrisRække({ label, beloeb }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span>{label}</span>
      <span className="font-medium">{formatKr(beloeb)} + moms</span>
    </div>
  );
}
