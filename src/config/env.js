import { z } from 'zod';

const browserEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUPABASE_ANON_KEY: z.string().min(20).optional().or(z.literal('')),
  VITE_USE_DEMO_DATA: z.enum(['true', 'false']).optional().default('false'),
});

const parsed = browserEnvSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error('La configuración pública contiene variables inválidas.');
}

export const env = {
  supabaseUrl: parsed.data.VITE_SUPABASE_URL || null,
  supabaseAnonKey: parsed.data.VITE_SUPABASE_ANON_KEY || null,
  useDemoData: parsed.data.VITE_USE_DEMO_DATA === 'true',
};

export const hasSupabaseConfig = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);
