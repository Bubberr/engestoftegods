'use client';

import { STANDTYPER, formatKr } from '../lib/standtyper';

// Ikon: grøn hak
function HakIkon() {
  return (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ElektricitetsBadge
function ElBadge({ har }) {
  return har ? (
    <span className="inline-flex items-center gap-1 text-xs bg-jule-gold/20 text-jule-gold font-medium px-2 py-0.5 rounded-full border border-jule-gold/30">
      ⚡ 220V
    </span>
  ) : (
    <span className="inline-flex items-center text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
      Ingen el
    </span>
  );
}

export default function StandVælger({ valgt, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {STANDTYPER.map((stand) => {
        const erValgt = valgt === stand.id;
        return (
          <button
            key={stand.id}
            type="button"
            onClick={() => onChange(stand.id)}
            className={`relative text-left rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-2 focus:ring-jule-gold/50 ${
              erValgt
                ? 'border-jule-green bg-jule-green/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-jule-green/50 hover:bg-jule-green/5'
            }`}
          >
            {/* Valgmarkering øverst til højre */}
            <span
              className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                erValgt ? 'bg-jule-green' : 'bg-gray-100 border border-gray-300'
              }`}
            >
              {erValgt && <HakIkon />}
            </span>

            {/* Stand-bogstav */}
            <span className="inline-block text-xs font-bold text-jule-green bg-jule-green/10 px-2 py-0.5 rounded mb-2">
              Stand {stand.id}
            </span>

            {/* Navn og lokation */}
            <p className="font-semibold text-jule-brown leading-tight">
              {stand.navn}
            </p>
            <p className="text-sm text-gray-500 mb-2">{stand.lokation}</p>

            {/* Størrelse og elektricitet */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                📐 {stand.storrelse}
              </span>
              <ElBadge har={stand.elektricitet} />
            </div>

            {/* Sider mod publikum */}
            {stand.sider && (
              <p className="text-xs text-gray-500 mb-2">👥 {stand.sider}</p>
            )}

            {/* Pris */}
            <p className="text-base font-bold text-jule-red mt-1">
              {formatKr(stand.pris)} <span className="font-normal text-sm text-gray-500">+ moms</span>
            </p>
          </button>
        );
      })}
    </div>
  );
}
