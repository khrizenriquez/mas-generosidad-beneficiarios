import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from '../config/env.js';

let client;

export function getSupabase() {
  if (!hasSupabaseConfig) {
    throw new Error(
      'Supabase no está configurado. Revisa las variables de entorno.',
    );
  }

  client ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
