import { getSupabase } from '../lib/supabase.js';

async function withSignedAdminImages(beneficiary) {
  if (!beneficiary) return null;
  const supabase = getSupabase();
  const images = await Promise.all(
    (beneficiary.beneficiary_images ?? []).map(async (image) => {
      const { data } = await supabase.storage
        .from('beneficiary-media')
        .createSignedUrl(image.thumbnail_path, 3600);
      return { ...image, thumbnail_url: data?.signedUrl ?? null };
    }),
  );
  return { ...beneficiary, images, beneficiary_images: undefined };
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
    .select('*, beneficiary_images(*)')
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
    gender: values.gender?.trim() || null,
    school_grade: values.school_grade?.trim() || null,
    favorite_subject: values.favorite_subject?.trim() || null,
    hobby: values.hobby?.trim() || null,
    future_goal: values.future_goal?.trim() || null,
    public_story: values.public_story?.trim() || null,
    import_notes: values.import_notes?.trim() || null,
    status: values.status,
  };

  const query = id
    ? getSupabase().from('beneficiaries').update(payload).eq('id', id)
    : getSupabase().from('beneficiaries').insert(payload);
  const { data, error } = await query.select('id').single();
  if (error) throw error;
  return data;
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
  altText,
  sortOrder,
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
    alt_text: altText || null,
    sort_order: sortOrder,
    is_primary: sortOrder === 0,
  });
  if (error) {
    await supabase.storage
      .from('beneficiary-media')
      .remove([thumbnailPath, detailPath]);
    throw error;
  }
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
