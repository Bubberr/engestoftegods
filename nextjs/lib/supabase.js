import { createClient } from '@supabase/supabase-js';

// Supabase-klient til brug på klient-siden (browser)
// Bruger de offentlige env-variabler der må eksponeres til browseren
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Mangler Supabase-miljøvariabler. Tjek din .env.local fil.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
