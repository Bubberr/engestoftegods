import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side Supabase-klient (bruger de samme env-variabler her,
// men i produktion kan man anvende en service-role-key i stedet)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Gyldige standtype-ID'er
const GYLDIGE_STAND_TYPER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export async function POST(request) {
  try {
    const data = await request.json();

    // Valider påkrævede felter
    const påkrævedeFelter = [
      'virksomhedsnavn',
      'kontaktperson',
      'telefon',
      'email',
      'stand_type',
      'kort_beskrivelse',
    ];

    for (const felt of påkrævedeFelter) {
      if (!data[felt] || String(data[felt]).trim() === '') {
        return NextResponse.json(
          { fejl: `Feltet "${felt}" er påkrævet.` },
          { status: 400 }
        );
      }
    }

    // Valider email-format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { fejl: 'Ugyldig email-adresse.' },
        { status: 400 }
      );
    }

    // Valider standtype
    if (!GYLDIGE_STAND_TYPER.includes(data.stand_type)) {
      return NextResponse.json(
        { fejl: 'Ugyldig standtype valgt.' },
        { status: 400 }
      );
    }

    // Valider kort_beskrivelse maks-længde
    if (data.kort_beskrivelse.length > 200) {
      return NextResponse.json(
        { fejl: 'Kort beskrivelse må højst være 200 tegn.' },
        { status: 400 }
      );
    }

    // Byg det objekt der gemmes i databasen
    const nyBooking = {
      virksomhedsnavn:    String(data.virksomhedsnavn).trim(),
      kontaktperson:      String(data.kontaktperson).trim(),
      cvr:                data.cvr ? String(data.cvr).trim() : null,
      adresse:            data.adresse ? String(data.adresse).trim() : null,
      postnummer_by:      data.postnummer_by ? String(data.postnummer_by).trim() : null,
      telefon:            String(data.telefon).trim(),
      email:              String(data.email).trim().toLowerCase(),
      website:            data.website ? String(data.website).trim() : null,
      stand_type:         data.stand_type,
      antal_borde:        Math.max(0, parseInt(data.antal_borde) || 0),
      antal_stole:        Math.max(0, parseInt(data.antal_stole) || 0),
      kort_beskrivelse:   String(data.kort_beskrivelse).trim(),
      produkt_beskrivelse: data.produkt_beskrivelse
        ? String(data.produkt_beskrivelse).trim()
        : null,
      er_ny_stadeholder:  Boolean(data.er_ny_stadeholder),
      status:             'afventer',
    };

    const { data: oprettet, error } = await supabase
      .from('bookings')
      .insert([nyBooking])
      .select()
      .single();

    if (error) {
      console.error('Supabase-fejl ved oprettelse af booking:', error);
      return NextResponse.json(
        { fejl: 'Der opstod en fejl ved gemning af din ansøgning. Prøv igen.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { besked: 'Ansøgning modtaget', id: oprettet.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Uventet fejl i POST /api/bookings:', err);
    return NextResponse.json(
      { fejl: 'Serverfejl. Prøv igen senere.' },
      { status: 500 }
    );
  }
}
