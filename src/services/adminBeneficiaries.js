import { getSupabase } from '../lib/supabase.js';

function normalizeGender(value) {
  return value === 'Niño' || value === 'Niña' ? value : null;
}

async function withSignedAdminImages(beneficiary) {
  if (!beneficiary) return null;
  const supabase = getSupabase();
  const images = await Promise.all(
    (beneficiary.beneficiary_images ?? []).map(async (image) => {
      const { data, error } = await supabase.storage
        .from('beneficiary-media')
        .createSignedUrl(image.thumbnail_path, 3600);
      if (error)
        throw new Error('No fue posible cargar las fotografías. Reintenta.');
      return {
        ...image,
        alt_texts: toLocalizationMap(image.beneficiary_image_localizations),
        beneficiary_image_localizations: undefined,
        thumbnail_url: data?.signedUrl ?? null,
      };
    }),
  );
  return {
    ...beneficiary,
    images,
    beneficiary_images: undefined,
    localizations: toLocalizationMap(beneficiary.beneficiary_localizations),
    beneficiary_localizations: undefined,
  };
}

function toLocalizationMap(rows = []) {
  return Object.fromEntries(
    rows.map(({ locale, ...value }) => [locale, value]),
  );
}

export async function getAdminBeneficiaries() {
  const { data, error } = await getSupabase()
    .from('beneficiaries')
    .select('id, code, full_name, status, updated_at, date_of_birth')
    .order('code');
  if (error) throw error;
  return data ?? [];
}

export async function getAdminBeneficiary(id) {
  const { data, error } = await getSupabase()
    .from('beneficiaries')
    .select(
      '*, beneficiary_localizations(*), beneficiary_images(*, beneficiary_image_localizations(*))',
    )
    .eq('id', id)
    .single();
  if (error) throw error;
  return withSignedAdminImages(data);
}

export async function getNextBeneficiaryCode() {
  const { data, error } = await getSupabase().rpc('get_next_beneficiary_code');
  if (error) throw error;
  return data;
}

export async function saveBeneficiary(values, id) {
  const payload = {
    code: values.code.trim().toUpperCase(),
    full_name: values.full_name?.trim() || null,
    date_of_birth: values.date_of_birth || null,
    gender: normalizeGender(values.gender),
    import_notes: values.import_notes?.trim() || null,
  };

  const supabase = getSupabase();
  const requestedStatus = values.status;
  let currentStatus = null;
  if (id) {
    const { data: existing, error: existingError } = await supabase
      .from('beneficiaries')
      .select('status')
      .eq('id', id)
      .single();
    if (existingError) throw existingError;
    currentStatus = existing.status;
  }
  const basePayload = {
    ...payload,
    ...(requestedStatus === 'published' && currentStatus === 'published'
      ? {}
      : {
          status: requestedStatus === 'published' ? 'draft' : requestedStatus,
        }),
  };
  const query = id
    ? supabase.from('beneficiaries').update(basePayload).eq('id', id)
    : supabase.from('beneficiaries').insert(basePayload);
  const { data, error } = await query.select('id').single();
  if (error) throw error;

  const localizationRows = buildLocalizationRows(data.id, values.localizations);
  const { error: localizationError } = await supabase
    .from('beneficiary_localizations')
    .upsert(localizationRows, { onConflict: 'beneficiary_id,locale' });
  if (localizationError) throw localizationError;

  if (requestedStatus === 'published' && currentStatus !== 'published') {
    const { error: publishError } = await supabase
      .from('beneficiaries')
      .update({ status: 'published' })
      .eq('id', data.id);
    if (publishError) throw publishError;
  }
  return data;
}

function normalizeLocalization(localization = {}) {
  return {
    school_grade: localization.school_grade?.trim() || null,
    favorite_subject: localization.favorite_subject?.trim() || null,
    hobby: localization.hobby?.trim() || null,
    future_goal: localization.future_goal?.trim() || null,
    public_story: localization.public_story?.trim() || null,
  };
}

export function buildLocalizationRows(beneficiaryId, localizations = {}) {
  return ['es', 'en'].map((locale) => ({
    beneficiary_id: beneficiaryId,
    locale,
    ...normalizeLocalization(localizations[locale]),
  }));
}

export async function archiveBeneficiary(id) {
  const { error } = await getSupabase()
    .from('beneficiaries')
    .update({ status: 'archived' })
    .eq('id', id);
  if (error) throw error;
}

export async function uploadBeneficiaryImage({
  beneficiaryId,
  thumbnail,
  detail,
  altTexts,
  sortOrder,
  isPrimary,
}) {
  const supabase = getSupabase();
  const imageId = crypto.randomUUID();
  const thumbnailPath = `${beneficiaryId}/${imageId}-thumbnail.webp`;
  const detailPath = `${beneficiaryId}/${imageId}-detail.webp`;

  const thumbnailResult = await supabase.storage
    .from('beneficiary-media')
    .upload(thumbnailPath, thumbnail, {
      contentType: 'image/webp',
      upsert: false,
    });
  if (thumbnailResult.error) throw thumbnailResult.error;

  const detailResult = await supabase.storage
    .from('beneficiary-media')
    .upload(detailPath, detail, { contentType: 'image/webp', upsert: false });
  if (detailResult.error) {
    await supabase.storage.from('beneficiary-media').remove([thumbnailPath]);
    throw detailResult.error;
  }

  const { error } = await supabase.from('beneficiary_images').insert({
    id: imageId,
    beneficiary_id: beneficiaryId,
    thumbnail_path: thumbnailPath,
    detail_path: detailPath,
    sort_order: sortOrder,
    is_primary: isPrimary,
  });
  if (error) {
    await supabase.storage
      .from('beneficiary-media')
      .remove([thumbnailPath, detailPath]);
    throw error;
  }

  await saveBeneficiaryImageAltTexts(imageId, altTexts);
}

export async function saveBeneficiaryImageAltTexts(imageId, altTexts = {}) {
  const rows = ['es', 'en'].map((locale) => ({
    image_id: imageId,
    locale,
    alt_text: altTexts[locale]?.trim() || null,
  }));
  const { error } = await getSupabase()
    .from('beneficiary_image_localizations')
    .upsert(rows, { onConflict: 'image_id,locale' });
  if (error) throw error;
}

export async function removeBeneficiaryImage(image) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('beneficiary_images')
    .delete()
    .eq('id', image.id);
  if (error) throw error;
  const { error: storageError } = await supabase.storage
    .from('beneficiary-media')
    .remove([image.thumbnail_path, image.detail_path]);
  if (storageError) throw storageError;

  if (image.is_primary) {
    const { data: remaining, error: listError } = await supabase
      .from('beneficiary_images')
      .select('id, is_primary')
      .eq('beneficiary_id', image.beneficiary_id)
      .order('sort_order')
      .limit(1);
    if (listError) throw listError;
    if (remaining?.[0] && !remaining[0].is_primary) {
      const { error: primaryError } = await supabase
        .from('beneficiary_images')
        .update({ is_primary: true })
        .eq('id', remaining[0].id);
      if (primaryError) throw primaryError;
    }
  }
}
