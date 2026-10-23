import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl!, supabaseServiceKey || supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[SUPABASE] Connected to PostgreSQL instance:', supabaseUrl);
  } catch (err) {
    console.warn('[SUPABASE] Failed to initialize Supabase client, falling back to local store:', err);
    client = null;
  }
} else {
  console.log('[SUPABASE] No SUPABASE_URL configured. Running with in-memory telemetry data engine (zero-config).');
}

export const supabase = client;
