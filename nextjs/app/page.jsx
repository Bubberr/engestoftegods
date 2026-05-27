'use client';

import { useState } from 'react';
import StandVælger from '../components/StandVælger';
import PrisSammendrag from '../components/PrisSammendrag';
import FormFelt from '../components/FormFelt';

// ─── Standardformulardata ───────────────────────────────────────────────────
const INITIAL_FORM = {
  virksomhedsnavn: '',
  kontaktperson: '',
  cvr: '',
  adresse: '',
  postnummer_by: '',
  telefon: '',
  email: '',
  website: '',
  stand_type: '',
  antal_borde: 0,
  antal_stole: 0,
  er_ny_stadeholder: true,
  kort_beskrivelse: '',
  produkt_beskrivelse: '',
};

// ─── Sektion-wrapper med grøn sidebjelke ────────────────────────────────────
function Sektion({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-jule-green px-6 py-3">
        <h2 className="text-white font-serif text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

// ─── Bekræftelsesbesked efter indsendelse ────────────────────────────────────
function Bekræftelse() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-jule-green/20">
        {/* Jul-ikon */}
        <div className="text-6xl mb-4">🎄</div>
        <h2 className="text-2xl font-serif font-bold text-jule-green mb-3">
          Tak for din ansøgning!
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Du hører fra Lise Egeskov snarest muligt.
        </p>
        <div className="bg-jule-cream border border-jule-gold/30 rounded-xl p-4 text-sm text-jule-brown">
          <p className="font-semibold mb-1">Husk!</p>
          <p>
            Hvis du er ny stadeholder, bedes du sende produktfotos til{' '}
            <a
              href="mailto:le@engestofte.dk"
              className="text-jule-green underline font-medium"
            >
              le@engestofte.dk
            </a>
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-gray-400 underline hover:text-gray-600"
        >
          Send en ny ansøgning
        </button>
      </div>
    </div>
  );
}

// ─── Hoved-komponent ─────────────────────────────────────────────────────────
export default function TilmeldingPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fejl, setFejl] = useState({});
  const [globalFejl, setGlobalFejl] = useState('');
  const [sender, setSender] = useState(false);
  const [succes, setSucces] = useState(false);

  // Generisk ændringshåndtering
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Ryd feltniveau-fejl når brugeren skriver
    if (fejl[name]) {
      setFejl((prev) => {
        const ny = { ...prev };
        delete ny[name];
        return ny;
      });
    }
  }

  // Klientside-validering
  function valider() {
    const nyFejl = {};
    if (!form.virksomhedsnavn.trim()) nyFejl.virksomhedsnavn = 'Virksomhedsnavn er påkrævet.';
    if (!form.kontaktperson.trim()) nyFejl.kontaktperson = 'Kontaktperson er påkrævet.';
    if (!form.telefon.trim()) nyFejl.telefon = 'Telefon er påkrævet.';
    if (!form.email.trim()) {
      nyFejl.email = 'Email er påkrævet.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nyFejl.email = 'Ugyldig email-adresse.';
    }
    if (!form.stand_type) nyFejl.stand_type = 'Vælg venligst en standtype.';
    if (!form.kort_beskrivelse.trim()) {
      nyFejl.kort_beskrivelse = 'Kort beskrivelse er påkrævet.';
    } else if (form.kort_beskrivelse.length > 200) {
      nyFejl.kort_beskrivelse = 'Beskrivelsen må højst være 200 tegn.';
    }
    return nyFejl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalFejl('');

    const valideringsFejl = valider();
    if (Object.keys(valideringsFejl).length > 0) {
      setFejl(valideringsFejl);
      // Scroll til første fejl
      const førsteFejlId = Object.keys(valideringsFejl)[0];
      document.getElementById(førsteFejlId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSender(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          antal_borde: parseInt(form.antal_borde) || 0,
          antal_stole: parseInt(form.antal_stole) || 0,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setGlobalFejl(json.fejl || 'Der opstod en fejl. Prøv igen.');
      } else {
        setSucces(true);
      }
    } catch {
      setGlobalFejl('Netværksfejl. Tjek din forbindelse og prøv igen.');
    } finally {
      setSender(false);
    }
  }

  if (succes) return <Bekræftelse />;

  return (
    <div className="min-h-screen py-8 px-4">
      {/* ─── Header ─── */}
      <header className="max-w-2xl mx-auto text-center mb-8">
        {/* Dekorativ top-stribe */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-jule-red text-2xl">❄</span>
          <span className="text-jule-gold text-lg">✦</span>
          <span className="text-jule-red text-2xl">❄</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-jule-gold mb-2">
          Engestofte Gods
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-jule-green leading-tight mb-3">
          Julemarked på Engestofte Gods
        </h1>
        <p className="text-jule-brown text-lg font-serif">
          5.–6. december 2026, kl. 10–16
        </p>

        {/* Frist-badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-jule-red/10 border border-jule-red/20 text-jule-red rounded-full px-4 py-1.5 text-sm font-medium">
          <span>📅</span>
          <span>Ansøgningsfrist: torsdag d. 3. december 2026</span>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-jule-red text-2xl">❄</span>
          <span className="text-jule-gold text-lg">✦</span>
          <span className="text-jule-red text-2xl">❄</span>
        </div>
      </header>

      {/* ─── Formular ─── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* 1. Virksomhedsoplysninger */}
        <Sektion title="🏢 Virksomhedsoplysninger">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFelt
              label="Virksomhedsnavn"
              name="virksomhedsnavn"
              value={form.virksomhedsnavn}
              onChange={handleChange}
              påkrævet
              fejl={fejl.virksomhedsnavn}
              placeholder="Madsens Keramik"
            />
            <FormFelt
              label="Kontaktperson"
              name="kontaktperson"
              value={form.kontaktperson}
              onChange={handleChange}
              påkrævet
              fejl={fejl.kontaktperson}
              placeholder="Jens Madsen"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFelt
              label="CVR-nummer"
              name="cvr"
              value={form.cvr}
              onChange={handleChange}
              placeholder="12345678"
              maxLength={8}
            />
            <FormFelt
              label="Adresse"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Langgade 12"
            />
          </div>

          <FormFelt
            label="Postnummer og by"
            name="postnummer_by"
            value={form.postnummer_by}
            onChange={handleChange}
            placeholder="5900 Rudkøbing"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFelt
              label="Telefon/mobil"
              name="telefon"
              type="tel"
              value={form.telefon}
              onChange={handleChange}
              påkrævet
              fejl={fejl.telefon}
              placeholder="12 34 56 78"
            />
            <FormFelt
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              påkrævet
              fejl={fejl.email}
              placeholder="jens@madsenskeramik.dk"
            />
          </div>

          <FormFelt
            label="Website"
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://madsenskeramik.dk"
          />
        </Sektion>

        {/* 2. Standvalg */}
        <Sektion title="🏕️ Vælg standtype">
          <StandVælger
            valgt={form.stand_type}
            onChange={(id) => {
              setForm((prev) => ({ ...prev, stand_type: id }));
              if (fejl.stand_type) setFejl((prev) => { const ny = {...prev}; delete ny.stand_type; return ny; });
            }}
          />
          {fejl.stand_type && (
            <p className="text-sm text-red-500">{fejl.stand_type}</p>
          )}

          {/* Borde og stole */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="antal_borde" className="block text-sm font-medium text-jule-brown mb-1">
                Antal borde
                <span className="text-gray-400 font-normal ml-1 text-xs">(155 kr/stk + moms)</span>
              </label>
              <input
                id="antal_borde"
                name="antal_borde"
                type="number"
                min={0}
                max={20}
                value={form.antal_borde}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jule-green/40"
              />
              <p className="text-xs text-gray-400 mt-0.5">76×183 cm</p>
            </div>
            <div>
              <label htmlFor="antal_stole" className="block text-sm font-medium text-jule-brown mb-1">
                Antal stole
                <span className="text-gray-400 font-normal ml-1 text-xs">(45 kr/stk + moms)</span>
              </label>
              <input
                id="antal_stole"
                name="antal_stole"
                type="number"
                min={0}
                max={40}
                value={form.antal_stole}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jule-green/40"
              />
            </div>
          </div>
        </Sektion>

        {/* 3. Om din stand */}
        <Sektion title="📝 Om din stand">
          {/* Ny stadeholder-toggle */}
          <div>
            <p className="text-sm font-medium text-jule-brown mb-2">Er du ny stadeholder?</p>
            <div className="flex gap-3">
              {[
                { label: 'Ja, jeg er ny', value: true },
                { label: 'Nej, jeg har deltaget før', value: false },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, er_ny_stadeholder: value }))}
                  className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-all ${
                    form.er_ny_stadeholder === value
                      ? 'border-jule-green bg-jule-green text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-jule-green/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Kort beskrivelse */}
          <FormFelt
            label="Kort beskrivelse af stand/forretning"
            name="kort_beskrivelse"
            type="textarea"
            value={form.kort_beskrivelse}
            onChange={handleChange}
            påkrævet
            fejl={fejl.kort_beskrivelse}
            maxLength={200}
            rows={3}
            hjælpetekst="Denne tekst kan blive vist offentligt på engestofte.dk"
            placeholder="Vi sælger håndlavet keramik og naturlige krukker i nordisk stil..."
          />

          {/* Produktbeskrivelse — kun for nye stadeholdere */}
          {form.er_ny_stadeholder && (
            <FormFelt
              label="Produktbeskrivelse (til vurdering)"
              name="produkt_beskrivelse"
              type="textarea"
              value={form.produkt_beskrivelse}
              onChange={handleChange}
              rows={4}
              hjælpetekst="Beskriv dine produkter detaljeret. Husk også at vedhæfte fotos via mail til le@engestofte.dk"
              placeholder="Vi fremstiller håndlavet keramik i vores eget værksted på Fyn. Sortimentet inkluderer..."
            />
          )}
        </Sektion>

        {/* 4. Prissammendrag */}
        <PrisSammendrag
          stand_type={form.stand_type}
          antal_borde={parseInt(form.antal_borde) || 0}
          antal_stole={parseInt(form.antal_stole) || 0}
        />

        {/* Global fejlbesked */}
        {globalFejl && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ⚠️ {globalFejl}
          </div>
        )}

        {/* Indsend-knap */}
        <button
          type="submit"
          disabled={sender}
          className="w-full rounded-xl bg-jule-green py-4 text-white font-serif font-semibold text-lg shadow-md
                     hover:bg-jule-green-mid transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-jule-gold focus:ring-offset-2"
        >
          {sender ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Sender ansøgning...
            </span>
          ) : (
            '🎄 Send ansøgning'
          )}
        </button>

        {/* Kontaktoplysninger */}
        <p className="text-center text-sm text-gray-400 pb-8">
          Spørgsmål? Kontakt Lise Egeskov på{' '}
          <a href="mailto:le@engestofte.dk" className="text-jule-green underline">
            le@engestofte.dk
          </a>
        </p>
      </form>
    </div>
  );
}

// Lille loading-spinner
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}
