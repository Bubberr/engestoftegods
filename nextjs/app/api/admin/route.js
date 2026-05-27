import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Tjek adgangskode fra Authorization-headeren (Bearer <password>)
function erAutoriseret(request) {
  const authHeader = request.headers.get('authorization') || '';
  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' && token === ADMIN_PASSWORD;
}

// GET /api/admin — hent alle bookings sorteret nyeste øverst
export async function GET(request) {
  if (!erAutoriseret(request)) {
    return NextResponse.json({ fejl: 'Ikke autoriseret.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase-fejl ved hentning af bookings:', error);
    return NextResponse.json(
      { fejl: 'Kunne ikke hente bookings.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ bookings: data });
}

// PATCH /api/admin — opdater status og/eller tildelt plads
// Body: { id, status?, tildelt_plads?, noter? }
export async function PATCH(request) {
  if (!erAutoriseret(request)) {
    return NextResponse.json({ fejl: 'Ikke autoriseret.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, tildelt_plads, noter } = body;

    if (!id) {
      return NextResponse.json(
        { fejl: 'Booking-ID er påkrævet.' },
        { status: 400 }
      );
    }

    const GYLDIGE_STATUSSER = ['afventer', 'godkendt', 'afvist'];
    if (status && !GYLDIGE_STATUSSER.includes(status)) {
      return NextResponse.json(
        { fejl: 'Ugyldig status.' },
        { status: 400 }
      );
    }

    // Byg opdateringsobjekt med kun de felter der er sendt med
    const opdatering = {};
    if (status !== undefined) opdatering.status = status;
    if (tildelt_plads !== undefined) opdatering.tildelt_plads = tildelt_plads;
    if (noter !== undefined) opdatering.noter = noter;

    if (Object.keys(opdatering).length === 0) {
      return NextResponse.json(
        { fejl: 'Ingen felter at opdatere.' },
        { status: 400 }
      );
    }

    const { data: opdateret, error } = await supabase
      .from('bookings')
      .update(opdatering)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase-fejl ved opdatering af booking:', error);
      return NextResponse.json(
        { fejl: 'Kunne ikke opdatere booking.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ booking: opdateret });
  } catch (err) {
    console.error('Uventet fejl i PATCH /api/admin:', err);
    return NextResponse.json(
      { fejl: 'Serverfejl. Prøv igen.' },
      { status: 500 }
    );
  }
}
