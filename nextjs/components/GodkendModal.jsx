'use client';

import { useState } from 'react';

// Modal der åbner når admin klikker "Godkend"
// Lise skal taste hvilken plads der tildeles inden godkendelse gennemføres
export default function GodkendModal({ booking, onBekræft, onLuk }) {
  const [plads, setPlads] = useState(booking.tildelt_plads || '');
  const [gemmer, setGemmer] = useState(false);

  async function handleBekræft() {
    setGemmer(true);
    await onBekræft(booking.id, plads.trim());
    setGemmer(false);
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onLuk()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-serif font-bold text-jule-green mb-1">
          Godkend ansøgning
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {booking.virksomhedsnavn} — Stand {booking.stand_type}
        </p>

        <label className="block text-sm font-medium text-jule-brown mb-1.5">
          Tildelt plads / standnummer
        </label>
        <input
          type="text"
          value={plads}
          onChange={(e) => setPlads(e.target.value)}
          placeholder="f.eks. B-14 eller 'Laden midten'"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jule-green/40 mb-5"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={onLuk}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annullér
          </button>
          <button
            onClick={handleBekræft}
            disabled={gemmer}
            className="flex-1 rounded-lg bg-jule-green py-2 text-sm font-semibold text-white hover:bg-jule-green-mid disabled:opacity-60 transition-colors"
          >
            {gemmer ? 'Gemmer...' : '✓ Godkend'}
          </button>
        </div>
      </div>
    </div>
  );
}
