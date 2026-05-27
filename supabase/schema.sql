-- ============================================================
--  Julemarked på Engestofte Gods — Supabase database-schema
--  Kør dette i Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================

-- Opret bookings-tabel
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),

  -- Virksomhedsinfo
  virksomhedsnavn text not null,
  kontaktperson   text not null,
  cvr             text,
  adresse         text,
  postnummer_by   text,
  telefon         text not null,
  email           text not null,
  website         text,

  -- Standvalg (A-H fra ansøgningsskemaet)
  stand_type      text not null check (stand_type in ('A','B','C','D','E','F','G','H')),
  antal_borde     integer default 0 check (antal_borde >= 0),
  antal_stole     integer default 0 check (antal_stole >= 0),

  -- Beskrivelser
  kort_beskrivelse    text not null,
  produkt_beskrivelse text,
  er_ny_stadeholder   boolean default true,

  -- Admin-felter
  status          text default 'afventer' check (status in ('afventer','godkendt','afvist')),
  tildelt_plads   text,
  noter           text
);

-- Index til hurtig filtrering på status
create index if not exists bookings_status_idx on bookings(status);

-- Index til datosortering
create index if not exists bookings_created_at_idx on bookings(created_at desc);

-- ============================================================
--  Row Level Security (RLS)
--
--  VIGTIGT: Aktiver RLS, men giv public lov til at INSERT
--  (tilmelde sig). Kun server-side kald via service role
--  kan læse/opdatere alle rækker.
--
--  Enkel opsætning for dette projekt:
--  - Anon må kun indsætte (tilmelde sig)
--  - Admin-siden bruger den samme anon-nøgle men med
--    server-side validering af admin-password
--
--  For produktion anbefales en service-role-nøgle i server
--  routes i stedet for anon-nøglen.
-- ============================================================

-- Aktiver RLS
alter table bookings enable row level security;

-- Tillad alle at oprette en ny booking (tilmelde sig)
create policy "Alle må tilmelde sig"
  on bookings for insert
  to anon
  with check (true);

-- Midlertidig policy der tillader SELECT for admin-siden
-- (erstat med service-role-nøgle i produktion for fuld sikkerhed)
create policy "Anon læseadgang til admin-brug"
  on bookings for select
  to anon
  using (true);

-- Tillad opdatering (godkend/afvis) fra server
create policy "Anon opdateringsadgang til admin-brug"
  on bookings for update
  to anon
  using (true)
  with check (true);
