import { env, hasSupabaseConfig } from '../config/env.js';
import { getDemoBeneficiaries } from '../data/demoBeneficiaries.js';
import { getSupabase } from '../lib/supabase.js';

export const publicErrorCodes = Object.freeze({
  catalogUnavailable: 'catalogUnavailable',
  mediaLoadFailed: 'mediaLoadFailed',
  requestFailed: 'requestFailed',
});

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
            throw new Error(publicErrorCodes.mediaLoadFailed);
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

export async function getPublicBeneficiaries(locale = 'es') {
  if (env.useDemoData) return getDemoBeneficiaries(locale);
  if (!hasSupabaseConfig) throw new Error(publicErrorCodes.catalogUnavailable);
  const { data, error } = await getSupabase().rpc('get_public_beneficiaries');
  if (error) throw new Error(publicErrorCodes.requestFailed);
  return signImages(data ?? []);
}

export async function getPublicBeneficiary(code, locale = 'es') {
  if (env.useDemoData) {
    return (
      getDemoBeneficiaries(locale).find((item) => item.code === code) ?? null
    );
  }
  if (!hasSupabaseConfig) throw new Error(publicErrorCodes.catalogUnavailable);
  const { data, error } = await getSupabase().rpc('get_public_beneficiary', {
    p_code: code,
  });
  if (error) throw new Error(publicErrorCodes.requestFailed);
  const [result] = await signImages(data ?? []);
  return result ?? null;
}
