'use client';

import { useState, useEffect, useCallback } from 'react';
import { AfventerRække, GodkendtRække, AfvistRække } from '../../components/BookingRække';
import GodkendModal from '../../components/GodkendModal';
import { beregnPris, formatKr, STANDTYPER } from '../../lib/standtyper';

// ─── CSV-eksport af godkendte bookings ──────────────────────────────────────
function eksporterCSV(bookings) {
  const headers = [
    'Virksomhed','Kontaktperson','CVR','Adresse','Postnr/By',
    'Telefon','Email','Website',
    'Stand','Lokation','Størrelse','Tildelt plads',
    'Borde','Stole','Pris ekskl. moms','Ny stadeholder',
    'Kort beskrivelse','Modtaget',
  ];

  const rækker = bookings.map((b) => {
    const stand = STANDTYPER.find((s) => s.id === b.stand_type);
    const { total } = beregnPris({ stand_type: b.stand_type, antal_borde: b.antal_borde, antal_stole: b.antal_stole });
    return [
      b.virksomhedsnavn, b.kontaktperson, b.cvr || '', b.adresse || '',
      b.postnummer_by || '', b.telefon, b.email, b.website || '',
      `Stand ${b.stand_type}`, stand?.lokation || '', stand?.storrelse || '',
      b.tildelt_plads || '', b.antal_borde, b.antal_stole,
      total, b.er_ny_stadeholder ? 'Ja' : 'Nej',
      b.kort_beskrivelse,
      new Date(b.created_at).toLocaleDateString('da-DK'),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  const csv = [headers, ...rækker].map((r) => r.join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `julemarked-godkendte-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Login-formular ──────────────────────────────────────────────────────────
function LoginFormular({ onLogin }) {
  const [pw, setPw] = useState('');
  const [fejl, setFejl] = useState('');
  const [loader, setLoader] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFejl('');
    setLoader(true);
    // Test adgangskoden mod API'et
    const res = await fetch('/api/admin', {
      headers: { Authorization: `Bearer ${pw}` },
    });
    setLoader(false);
    if (res.ok) {
      // Gem token i sessionStorage så siden husker login ved reload
      sessionStorage.setItem('admin_token', pw);
      onLogin(pw);
    } else {
      setFejl('Forkert adgangskode. Prøv igen.');
      setPw('');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-jule-cream p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 text-center">
        <div className="text-4xl mb-4">🎄</div>
        <h1 className="text-2xl font-serif font-bold text-jule-green mb-1">Admin</h1>
        <p className="text-sm text-gray-500 mb-6">Julemarked på Engestofte Gods</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Adgangskode"
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-jule-green/40"
          />
          {fejl && <p className="text-sm text-red-500">{fejl}</p>}
          <button
            type="submit"
            disabled={loader || !pw}
            className="w-full rounded-lg bg-jule-green py-2.5 text-white font-semibold text-sm disabled:opacity-60 hover:bg-jule-green-mid transition-colors"
          >
            {loader ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Faneblade ───────────────────────────────────────────────────────────────
const FANER = [
  { id: 'afventer', label: 'Afventer' },
  { id: 'godkendt', label: 'Godkendte' },
  { id: 'afvist',   label: 'Afviste' },
];

// ─── Hoved admin-panel ───────────────────────────────────────────────────────
function AdminPanel({ token }) {
  const [bookings, setBookings] = useState([]);
  const [henter, setHenter] = useState(true);
  const [fejl, setFejl] = useState('');
  const [aktivFane, setAktivFane] = useState('afventer');
  const [godkendBooking, setGodkendBooking] = useState(null); // booking der er ved at blive godkendt

  const hentBookings = useCallback(async () => {
    setHenter(true);
    setFejl('');
    const res = await fetch('/api/admin', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setFejl('Kunne ikke hente bookings. Prøv at genindlæse siden.');
      setHenter(false);
      return;
    }
    const data = await res.json();
    setBookings(data.bookings || []);
    setHenter(false);
  }, [token]);

  useEffect(() => { hentBookings(); }, [hentBookings]);

  // Opdater status og/eller tildelt plads via API
  async function opdaterBooking(id, ændringer) {
    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, ...ændringer }),
    });
    if (res.ok) {
      const { booking } = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? booking : b)));
    } else {
      alert('Fejl ved opdatering. Prøv igen.');
    }
  }

  // Godkend: åbn modal
  function handleGodkend(booking) {
    setGodkendBooking(booking);
  }

  // Bekræft godkendelse (fra modal)
  async function bekræftGodkendelse(id, tildelt_plads) {
    await opdaterBooking(id, { status: 'godkendt', tildelt_plads });
    setGodkendBooking(null);
    setAktivFane('godkendt');
  }

  async function handleAfvis(id) {
    if (!confirm('Er du sikker på, at du vil afvise denne ansøgning?')) return;
    await opdaterBooking(id, { status: 'afvist' });
  }

  async function handleGenaktivér(id) {
    await opdaterBooking(id, { status: 'afventer' });
    setAktivFane('afventer');
  }

  async function handleOpdaterPlads(id, tildelt_plads) {
    await opdaterBooking(id, { tildelt_plads });
  }

  // Filtrer bookings per fane
  const filtrerede = bookings.filter((b) => b.status === aktivFane);

  // Tæl per status til badges
  const antal = {
    afventer: bookings.filter((b) => b.status === 'afventer').length,
    godkendt: bookings.filter((b) => b.status === 'godkendt').length,
    afvist:   bookings.filter((b) => b.status === 'afvist').length,
  };

  // Beregn total omsætning for godkendte
  const totalOmsætning = bookings
    .filter((b) => b.status === 'godkendt')
    .reduce((sum, b) => {
      const { total } = beregnPris({ stand_type: b.stand_type, antal_borde: b.antal_borde, antal_stole: b.antal_stole });
      return sum + total;
    }, 0);

  return (
    <div className="min-h-screen bg-jule-cream">
      {/* Topbar */}
      <header className="bg-jule-green text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-serif font-bold">🎄 Julemarked Admin</h1>
            <p className="text-green-200 text-xs">Engestofte Gods · 5.-6. december 2026</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('admin_token'); window.location.reload(); }}
            className="text-xs text-green-200 hover:text-white underline"
          >
            Log ud
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistik-kort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatKort label="Afventer" antal={antal.afventer} farve="bg-amber-50 border-amber-200 text-amber-700" />
          <StatKort label="Godkendte" antal={antal.godkendt} farve="bg-green-50 border-green-200 text-green-700" />
          <StatKort label="Afviste" antal={antal.afvist} farve="bg-red-50 border-red-200 text-red-600" />
          <StatKort label="Omsætning (ekskl. moms)" antal={formatKr(totalOmsætning)} farve="bg-jule-cream border-jule-gold/30 text-jule-brown" />
        </div>

        {/* Faneblade */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl border border-gray-100 p-1 w-fit">
          {FANER.map((fane) => (
            <button
              key={fane.id}
              onClick={() => setAktivFane(fane.id)}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                aktivFane === fane.id
                  ? 'bg-jule-green text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {fane.label}
              {antal[fane.id] > 0 && (
                <span
                  className={`ml-1.5 inline-flex items-center justify-center rounded-full text-xs w-5 h-5 font-bold ${
                    aktivFane === fane.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {antal[fane.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Indhold */}
        {henter ? (
          <div className="text-center py-16 text-gray-400">Henter ansøgninger...</div>
        ) : fejl ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {fejl}
            <button onClick={hentBookings} className="ml-2 underline">Prøv igen</button>
          </div>
        ) : filtrerede.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Ingen {aktivFane === 'afventer' ? 'afventende' : aktivFane === 'godkendt' ? 'godkendte' : 'afviste'} ansøgninger
          </div>
        ) : (
          <>
            {/* ── Afventer ── */}
            {aktivFane === 'afventer' && (
              <div className="space-y-3">
                {filtrerede.map((b) => (
                  <AfventerRække
                    key={b.id}
                    booking={b}
                    onGodkend={handleGodkend}
                    onAfvis={handleAfvis}
                  />
                ))}
              </div>
            )}

            {/* ── Godkendte ── */}
            {aktivFane === 'godkendt' && (
              <>
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => eksporterCSV(filtrerede)}
                    className="rounded-lg border border-jule-green/30 bg-white px-4 py-2 text-sm font-medium text-jule-green hover:bg-jule-green/5 transition-colors"
                  >
                    ⬇ Eksportér CSV
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
                        {['Virksomhed','Kontakt','Telefon','Email','Stand','Tildelt plads','Pris','Ekstra'].map((h) => (
                          <th key={h} className="py-3 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtrerede.map((b) => (
                        <GodkendtRække
                          key={b.id}
                          booking={b}
                          onOpdaterPlads={handleOpdaterPlads}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Afviste ── */}
            {aktivFane === 'afvist' && (
              <div className="space-y-3">
                {filtrerede.map((b) => (
                  <AfvistRække
                    key={b.id}
                    booking={b}
                    onGenaktivér={handleGenaktivér}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Godkend-modal */}
      {godkendBooking && (
        <GodkendModal
          booking={godkendBooking}
          onBekræft={bekræftGodkendelse}
          onLuk={() => setGodkendBooking(null)}
        />
      )}
    </div>
  );
}

// Lille statistik-kort til topbaren
function StatKort({ label, antal, farve }) {
  return (
    <div className={`rounded-xl border p-3 ${farve}`}>
      <p className="text-2xl font-bold">{antal}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}

// ─── Root: håndtér login/logout state ───────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(() => {
    // Forsøg at gendanne token fra sessionStorage ved sideindlæsning
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_token') || '';
    }
    return '';
  });

  if (!token) {
    return <LoginFormular onLogin={setToken} />;
  }

  return <AdminPanel token={token} />;
}
