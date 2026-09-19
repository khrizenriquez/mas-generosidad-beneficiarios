import { access, readFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const PRIVATE_IMPORT_DIRECTORY = path.resolve('private-import');
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const EXPECTED_CODES = Array.from(
  { length: 41 },
  (_, index) => `MG-${String(index + 1).padStart(3, '0')}`,
);
const REQUIRED_PUBLIC_FIELDS = [
  'school_grade',
  'favorite_subject',
  'hobby',
  'future_goal',
  'public_story',
];

export const TEMPORARY_DATE_OF_BIRTH = '2019-08-19';
export const TEMPORARY_FIELD_PLACEHOLDER =
  'Información pendiente de actualización';

export function ensureExpectedProfiles(profiles) {
  const receivedCodes = profiles.map((profile) => profile.code).sort();
  if (
    receivedCodes.length !== EXPECTED_CODES.length ||
    receivedCodes.some((code, index) => code !== EXPECTED_CODES[index])
  ) {
    throw new Error(
      'Se esperaban exactamente 41 perfiles MG-001 a MG-041 para la publicación temporal.',
    );
  }
}

function present(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function prepareTemporaryProfileUpdate(profile) {
  return {
    date_of_birth: TEMPORARY_DATE_OF_BIRTH,
    ...Object.fromEntries(
      REQUIRED_PUBLIC_FIELDS.map((field) => [
        field,
        present(profile[field]) || TEMPORARY_FIELD_PLACEHOLDER,
      ]),
    ),
    status: 'published',
  };
}

export function createTemporaryImagePaths(beneficiaryId) {
  const base = `temporary-demo/${beneficiaryId}`;
  return {
    thumbnailPath: `${base}/thumbnail.webp`,
    detailPath: `${base}/detail.webp`,
  };
}

export async function createWebpVariants(source) {
  const image = sharp(source, { failOn: 'error' }).rotate();
  const [thumbnail, detail] = await Promise.all([
    image
      .clone()
      .resize({
        width: 640,
        height: 480,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 78 })
      .toBuffer(),
    image
      .clone()
      .resize({
        width: 1600,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer(),
  ]);
  return { thumbnail, detail };
}

function isInsidePrivateImport(sourcePath) {
  const relative = path.relative(PRIVATE_IMPORT_DIRECTORY, sourcePath);
  return (
    relative &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function previousProfilePayload(profile) {
  return {
    date_of_birth: profile.date_of_birth,
    school_grade: profile.school_grade,
    favorite_subject: profile.favorite_subject,
    hobby: profile.hobby,
    future_goal: profile.future_goal,
    public_story: profile.public_story,
    status: profile.status,
    published_at: profile.published_at,
    archived_at: profile.archived_at,
  };
}

async function removeStoragePaths(supabase, paths) {
  if (!paths.length) return;
  await supabase.storage.from('beneficiary-media').remove(paths);
}

export async function publishTemporaryDemo({ supabase, thumbnail, detail }) {
  const [
    { data: profiles, error: profileError },
    { data: imageRows, error: imageError },
  ] = await Promise.all([
    supabase
      .from('beneficiaries')
      .select(
        'id, code, date_of_birth, school_grade, favorite_subject, hobby, future_goal, public_story, status, published_at, archived_at',
      )
      .order('code'),
    supabase
      .from('beneficiary_images')
      .select('id, beneficiary_id, thumbnail_path, detail_path'),
  ]);
  if (profileError) throw profileError;
  if (imageError) throw imageError;

  const safeProfiles = profiles ?? [];
  ensureExpectedProfiles(safeProfiles);
  const imagesByBeneficiary = new Map();
  for (const image of imageRows ?? []) {
    const images = imagesByBeneficiary.get(image.beneficiary_id) ?? [];
    images.push(image);
    imagesByBeneficiary.set(image.beneficiary_id, images);
  }

  const insertedImageIds = [];
  const uploadedPaths = [];
  const updatedProfiles = [];
  try {
    for (const profile of safeProfiles) {
      const existingImages = imagesByBeneficiary.get(profile.id) ?? [];
      const { thumbnailPath, detailPath } = createTemporaryImagePaths(
        profile.id,
      );
      const isExpectedImage =
        existingImages.length === 1 &&
        existingImages[0].thumbnail_path === thumbnailPath &&
        existingImages[0].detail_path === detailPath;

      if (isExpectedImage) continue;
      if (existingImages.length) {
        throw new Error(
          'La publicación temporal se detuvo porque un perfil ya tiene imágenes que no pertenecen a esta demostración.',
        );
      }

      const thumbnailResult = await supabase.storage
        .from('beneficiary-media')
        .upload(thumbnailPath, thumbnail, {
          contentType: 'image/webp',
          upsert: true,
        });
      if (thumbnailResult.error) throw thumbnailResult.error;
      uploadedPaths.push(thumbnailPath);

      const detailResult = await supabase.storage
        .from('beneficiary-media')
        .upload(detailPath, detail, {
          contentType: 'image/webp',
          upsert: true,
        });
      if (detailResult.error) throw detailResult.error;
      uploadedPaths.push(detailPath);

      const { data: image, error: insertError } = await supabase
        .from('beneficiary_images')
        .insert({
          beneficiary_id: profile.id,
          thumbnail_path: thumbnailPath,
          detail_path: detailPath,
          alt_text: 'Ilustración temporal de Más Generosidad',
          sort_order: 0,
          is_primary: true,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;
      insertedImageIds.push(image.id);
    }

    for (const profile of safeProfiles) {
      const { error } = await supabase
        .from('beneficiaries')
        .update(prepareTemporaryProfileUpdate(profile))
        .eq('id', profile.id);
      if (error) throw error;
      updatedProfiles.push(profile);
    }
  } catch (error) {
    await Promise.allSettled(
      updatedProfiles.map((profile) =>
        supabase
          .from('beneficiaries')
          .update(previousProfilePayload(profile))
          .eq('id', profile.id),
      ),
    );
    if (insertedImageIds.length) {
      await supabase
        .from('beneficiary_images')
        .delete()
        .in('id', insertedImageIds);
    }
    await removeStoragePaths(supabase, uploadedPaths);
    throw error;
  }

  return { profiles: safeProfiles.length, images: safeProfiles.length };
}

function sourceArgument() {
  const argument = process.argv.find((item) => item.startsWith('--source='));
  return argument ? path.resolve(argument.slice('--source='.length)) : null;
}

async function main() {
  if (!process.argv.includes('--confirm-authorized-temporary-publication')) {
    throw new Error(
      'Agrega --confirm-authorized-temporary-publication después de confirmar el consentimiento externo de la ONG.',
    );
  }
  const sourcePath = sourceArgument();
  if (!sourcePath || !isInsidePrivateImport(sourcePath)) {
    throw new Error(
      'Usa --source=private-import/<ilustración> para conservar el original fuera de Git.',
    );
  }
  await access(sourcePath);
  const sourceStats = await stat(sourcePath);
  if (sourceStats.size > MAX_SOURCE_BYTES) {
    throw new Error('La ilustración temporal no puede superar 10 MB.');
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY solo en el entorno local.',
    );
  }
  if (serviceRoleKey.startsWith('sb_publishable_')) {
    throw new Error(
      'La clave publicable no sirve para esta operación privada.',
    );
  }

  const variants = await createWebpVariants(await readFile(sourcePath));
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const result = await publishTemporaryDemo({ supabase, ...variants });
  await unlink(sourcePath);
  console.log(
    `Demostración temporal publicada: ${result.profiles} perfiles, ${result.images} imágenes principales.`,
  );
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
