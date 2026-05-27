kan# Julemarked Standbooking — Engestofte Gods

Webapplikation til håndtering af standansøgninger til julemarkedet på Engestofte Gods (5.–6. december 2026).

**Tech stack:** Next.js 14 (App Router) · Supabase · Tailwind CSS · Vercel

---

## Funktioner

| Side | URL | Beskrivelse |
|------|-----|-------------|
| Tilmeldingsformular | `/` | Offentlig — ansøg om en stand |
| Admin-panel | `/admin` | Passwordbeskyttet oversigt med tre faneblade |

**Admin-funktioner:**
- Faneblade: Afventer / Godkendte / Afviste
- Godkend med tildeling af plads (via modal)
- Afvis med ét klik
- Genaktivér afviste ansøgninger
- Inline redigering af tildelt plads
- Eksportér godkendte som CSV-fil

---

## Opsætning

### 1. Klon og installér

```bash
git clone <dit-repo>
cd christmas-market/nextjs
npm install
```

### 2. Opret Supabase-projekt

1. Gå til [supabase.com](https://supabase.com) → **New project**
2. Vælg en region tæt på Danmark (f.eks. `eu-central-1`)
3. Notér **Project URL** og **anon public** nøglen under  
   **Project Settings → API**

### 3. Opret database-tabel

1. Gå til **SQL Editor** i Supabase Dashboard
2. Klik **New query**
3. Indsæt og kør indholdet af `supabase/schema.sql`

### 4. Miljøvariabler

Kopiér `.env.local.example` til `.env.local` og udfyld:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://dit-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-nøgle
ADMIN_PASSWORD=julemarked2025
```

> **Bemærk:** Skift `ADMIN_PASSWORD` til noget sikkert i produktion.

### 5. Start udviklingsserver

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) — formularen  
Åbn [http://localhost:3000/admin](http://localhost:3000/admin) — admin

---

## Vercel Deploy

### Mulighed A: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Vercel spørger undervejs — acceptér standardindstillingerne.

### Mulighed B: Via Vercel Dashboard (anbefalet)

1. Push koden til GitHub (mappen `nextjs/`)
2. Gå til [vercel.com](https://vercel.com) → **Add New Project**
3. Importér dit GitHub-repo
4. Under **Root Directory** sæt: `nextjs`
5. Under **Environment Variables** tilføj de tre variabler:

| Variabel | Værdi |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Din Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Din Supabase anon-nøgle |
| `ADMIN_PASSWORD` | Dit valgte admin-password |

6. Klik **Deploy** — færdig!

---

## Projektstruktur

```
nextjs/
├── app/
│   ├── layout.jsx              # Root layout med globals.css
│   ├── page.jsx                # Offentlig tilmeldingsformular
│   ├── globals.css             # Tailwind + base-styles
│   ├── admin/
│   │   └── page.jsx            # Admin-panel (passwordbeskyttet)
│   └── api/
│       ├── bookings/
│       │   └── route.js        # POST: gem ny booking
│       └── admin/
│           └── route.js        # GET: hent alle / PATCH: opdater
├── components/
│   ├── StandVælger.jsx         # Visuel standtype-vælger (A-H)
│   ├── PrisSammendrag.jsx      # Live prisberegning
│   ├── FormFelt.jsx            # Genanvendeligt formfelt
│   ├── BookingRække.jsx        # Afventer/Godkendt/Afvist rækker
│   └── GodkendModal.jsx        # Modal til godkendelse med plads
├── lib/
│   ├── supabase.js             # Supabase-klient
│   └── standtyper.js           # Standdata, priser og beregning
├── supabase/
│   └── schema.sql              # Database-skema (kør i Supabase)
├── .env.local.example          # Skabelon til miljøvariabler
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Standtyper og priser

| Stand | Navn | Lokation | Størrelse | Pris (ekskl. moms) |
|-------|------|----------|-----------|---------------------|
| A | Udendørsstand | Udendørs | 3×4 m | 985 kr |
| B | Langside | Kostalden | 3×3 m | 1.685 kr |
| C | Centerstand | Kostalden | 3×3 m | 1.895 kr |
| D | Hestestalden | Hestestalden | 3,3×3,3 m | 1.635 kr |
| E | Langside | Laden | 3×2,5 m | 1.695 kr |
| F | Centerstand | Laden | 3×2,5 m | 1.775 kr |
| G | Hjørnestand | Laden | 3×2,5 m | 1.995 kr |
| H | Langside | Jagtstuen | 3×1,8 m | 1.325 kr |

**Tillæg:** Borde 155 kr/stk · Stole 45 kr/stk (begge ekskl. moms)

---

## Kontakt

Spørgsmål vedr. julemarkedet: **le@engestofte.dk** (Lise Egeskov)
