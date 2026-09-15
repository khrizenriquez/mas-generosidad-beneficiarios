import { createCipheriv, randomBytes, scryptSync } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.BACKUP_ENCRYPTION_PASSWORD;
if (!supabaseUrl || !serviceRoleKey || !password || password.length < 16) {
  throw new Error(
    'Define SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y BACKUP_ENCRYPTION_PASSWORD (mínimo 16 caracteres).',
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
const [beneficiaries, images, admins] = await Promise.all([
  supabase.from('beneficiaries').select('*'),
  supabase.from('beneficiary_images').select('*'),
  supabase.from('admin_users').select('*'),
]);
for (const result of [beneficiaries, images, admins])
  if (result.error) throw result.error;

const media = [];
for (const image of images.data) {
  for (const storagePath of [image.thumbnail_path, image.detail_path]) {
    const { data, error } = await supabase.storage
      .from('beneficiary-media')
      .download(storagePath);
    if (error) throw error;
    media.push({
      path: storagePath,
      base64: Buffer.from(await data.arrayBuffer()).toString('base64'),
    });
  }
}

const payload = gzipSync(
  Buffer.from(
    JSON.stringify({
      version: 1,
      created_at: new Date().toISOString(),
      beneficiaries: beneficiaries.data,
      beneficiary_images: images.data,
      admin_users: admins.data,
      media,
    }),
  ),
);
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = scryptSync(password, salt, 32);
const cipher = createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
const tag = cipher.getAuthTag();
const output = Buffer.concat([Buffer.from('MGBK1'), salt, iv, tag, encrypted]);

const directory = path.resolve('backups');
await mkdir(directory, { recursive: true, mode: 0o700 });
const filename = `mas-generosidad-${new Date().toISOString().replace(/[:.]/g, '-')}.backup.enc`;
await writeFile(path.join(directory, filename), output, { mode: 0o600 });
console.log(
  `Backup cifrado creado en backups/${filename}. Guárdalo fuera del repositorio.`,
);
