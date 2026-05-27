'use client';

import { STANDTYPER, beregnPris, formatKr } from '../lib/standtyper';

// Formater dato til dansk format
function formatDato(iso) {
  return new Date(iso).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Badge der viser om stadeholder er ny eller erfaren
function StadeholderBadge({ erNy }) {
  return erNy ? (
    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
      Ny
    </span>
  ) : (
    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
      Erfaren
    </span>
  );
}

// ─── Afventer-række ──────────────────────────────────────────────────────────
export function AfventerRække({ booking, onGodkend, onAfvis }) {
  const stand = STANDTYPER.find((s) => s.id === booking.stand_type);
  const { total } = beregnPris({
    stand_type: booking.stand_type,
    antal_borde: booking.antal_borde,
    antal_stole: booking.antal_stole,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        {/* Venstre: virksomhed og kontakt */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{booking.virksomhedsnavn}</h3>
            <StadeholderBadge erNy={booking.er_ny_stadeholder} />
          </div>
          <p className="text-sm text-gray-500">{booking.kontaktperson}</p>
          <div className="flex gap-3 mt-1 text-sm text-gray-600">
            <a href={`tel:${booking.telefon}`} className="hover:text-jule-green">
              📞 {booking.telefon}
            </a>
            <a href={`mailto:${booking.email}`} className="hover:text-jule-green truncate max-w-[200px]">
              ✉ {booking.email}
            </a>
          </div>
        </div>

        {/* Højre: stand og pris */}
        <div className="text-right">
          <span className="inline-block text-sm font-bold bg-jule-green/10 text-jule-green px-3 py-1 rounded-full">
            Stand {booking.stand_type}
          </span>
          {stand && (
            <p className="text-xs text-gray-500 mt-1">
              {stand.lokation} · {stand.storrelse}
            </p>
          )}
          <p className="text-sm font-semibold text-jule-red mt-1">
            {formatKr(total)} + moms
          </p>
        </div>
      </div>

      {/* Kort beskrivelse */}
      {booking.kort_beskrivelse && (
        <p className="text-sm text-gray-600 italic border-l-2 border-jule-gold/40 pl-3 mb-3">
          "{booking.kort_beskrivelse}"
        </p>
      )}

      {/* Modtaget-tidspunkt */}
      <p className="text-xs text-gray-400 mb-3">
        Modtaget {formatDato(booking.created_at)}
      </p>

      {/* Handlingsknapper */}
      <div className="flex gap-2">
        <button
          onClick={() => onGodkend(booking)}
          className="flex-1 rounded-lg bg-jule-green py-2 text-sm font-semibold text-white hover:bg-jule-green-mid transition-colors"
        >
          ✓ Godkend
        </button>
        <button
          onClick={() => onAfvis(booking.id)}
          className="flex-1 rounded-lg border border-jule-red/30 py-2 text-sm font-semibold text-jule-red hover:bg-jule-red/5 transition-colors"
        >
          ✕ Afvis
        </button>
      </div>
    </div>
  );
}

// ─── Godkendt-tabel-række ────────────────────────────────────────────────────
export function GodkendtRække({ booking, onOpdaterPlads }) {
  const stand = STANDTYPER.find((s) => s.id === booking.stand_type);
  const { standleje, borde, stole, total } = beregnPris({
    stand_type: booking.stand_type,
    antal_borde: booking.antal_borde,
    antal_stole: booking.antal_stole,
  });

  function handlePladsBlur(e) {
    const nyPlads = e.target.value.trim();
    if (nyPlads !== (booking.tildelt_plads || '')) {
      onOpdaterPlads(booking.id, nyPlads);
    }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 text-sm">
      <td className="py-3 px-3 font-medium">{booking.virksomhedsnavn}</td>
      <td className="py-3 px-3 text-gray-600">{booking.kontaktperson}</td>
      <td className="py-3 px-3">
        <a href={`tel:${booking.telefon}`} className="text-jule-green hover:underline">
          {booking.telefon}
        </a>
      </td>
      <td className="py-3 px-3">
        <a href={`mailto:${booking.email}`} className="text-jule-green hover:underline truncate block max-w-[160px]">
          {booking.email}
        </a>
      </td>
      <td className="py-3 px-3">
        <span className="font-bold text-jule-green">Stand {booking.stand_type}</span>
        {stand && <span className="text-gray-400 text-xs ml-1">({stand.lokation})</span>}
      </td>
      <td className="py-3 px-3">
        {/* Inline-redigerbar tildelt plads */}
        <input
          type="text"
          defaultValue={booking.tildelt_plads || ''}
          onBlur={handlePladsBlur}
          placeholder="Angiv plads..."
          className="w-full min-w-[100px] border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-jule-green/40"
        />
      </td>
      <td className="py-3 px-3 text-right font-semibold text-jule-red whitespace-nowrap">
        {formatKr(total)}
      </td>
      <td className="py-3 px-3 text-xs text-gray-400">
        {booking.antal_borde > 0 && <div>Borde: {booking.antal_borde} stk.</div>}
        {booking.antal_stole > 0 && <div>Stole: {booking.antal_stole} stk.</div>}
        <StadeholderBadge erNy={booking.er_ny_stadeholder} />
      </td>
    </tr>
  );
}

// ─── Afvist-række ────────────────────────────────────────────────────────────
export function AfvistRække({ booking, onGenaktivér }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 opacity-75">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-gray-700">{booking.virksomhedsnavn}</h3>
          <p className="text-sm text-gray-400">
            {booking.kontaktperson} · Stand {booking.stand_type} ·{' '}
            {booking.email}
          </p>
        </div>
        <button
          onClick={() => onGenaktivér(booking.id)}
          className="shrink-0 rounded-lg border border-jule-gold/40 bg-jule-cream px-3 py-1.5 text-xs font-medium text-jule-brown hover:bg-jule-gold/10 transition-colors"
        >
          ↩ Genaktivér
        </button>
      </div>
    </div>
  );
}
