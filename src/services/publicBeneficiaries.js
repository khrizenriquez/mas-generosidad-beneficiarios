import { env, hasSupabaseConfig } from '../config/env.js';
import { demoBeneficiaries } from '../data/demoBeneficiaries.js';
import { getSupabase } from '../lib/supabase.js';

async function signImages(rows) {
  const supabase = getSupabase();
  return Promise.all(
    rows.map(async (row) => {
      const images = await Promise.all(
        (row.images ?? []).map(async (item) => {
          const [thumbnail, detail] = await Promise.all([
            supabase.storage
              .from('beneficiary-media')
              .createSignedUrl(item.thumbnail_path, 3600),
            supabase.storage
              .from('beneficiary-media')
              .createSignedUrl(item.detail_path, 3600),
          ]);
          if (thumbnail.error || detail.error)
            throw new Error(
              'No fue posible cargar las fotografías. Reintenta.',
            );
          return {
            ...item,
            thumbnail_url: thumbnail.data?.signedUrl ?? null,
            detail_url: detail.data?.signedUrl ?? null,
          };
        }),
      );
      return { ...row, images };
    }),
  );
}

export async function getPublicBeneficiaries() {
  if (env.useDemoData) return demoBeneficiaries;
  if (!hasSupabaseConfig)
    throw new Error('El catálogo aún no está conectado a Supabase.');
  const { data, error } = await getSupabase().rpc('get_public_beneficiaries');
  if (error) throw error;
  return signImages(data ?? []);
}

export async function getPublicBeneficiary(code) {
  if (env.useDemoData) {
    return demoBeneficiaries.find((item) => item.code === code) ?? null;
  }
  if (!hasSupabaseConfig)
    throw new Error('El catálogo aún no está conectado a Supabase.');
  const { data, error } = await getSupabase().rpc('get_public_beneficiary', {
    p_code: code,
  });
  if (error) throw error;
  const [result] = await signImages(data ?? []);
  return result ?? null;
}
