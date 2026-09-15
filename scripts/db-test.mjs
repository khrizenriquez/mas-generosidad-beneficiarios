import { readdir, readFile } from 'node:fs/promises';

const migrationsDirectory = new URL('../supabase/migrations/', import.meta.url);
const migrationNames = (await readdir(migrationsDirectory))
  .filter((name) => name.endsWith('.sql'))
  .sort();
const migration = (
  await Promise.all(
    migrationNames.map((name) =>
      readFile(new URL(name, migrationsDirectory), 'utf8'),
    ),
  )
).join('\n');

const assertions = [
  [
    'RLS de beneficiarios',
    /alter table public\.beneficiaries enable row level security/i,
  ],
  [
    'sin política pública directa',
    /revoke all on public\.admin_users, public\.beneficiaries, public\.beneficiary_images from anon/i,
  ],
  ['RPC pública', /function public\.get_public_beneficiaries\(\)/i],
  [
    'edad calculada',
    /extract\(year from age\(current_date, b\.date_of_birth\)\)/i,
  ],
  ['límite de tres fotos', /trigger beneficiary_images_limit/i],
  ['bucket privado', /'beneficiary-media',[\s\S]*?false,/i],
  [
    'sin privilegio de borrado para authenticated',
    /revoke delete on table public\.beneficiaries from authenticated/i,
  ],
  [
    'lectura pública de medios encapsulada',
    /function public\.can_read_beneficiary_media\(object_name text\)[\s\S]*?security definer/i,
  ],
  [
    'sin borrado de beneficiarios',
    !/create policy\s+"[^"]*delete[^"]*"\s+on public\.beneficiaries/i.test(
      migration,
    ),
  ],
];

let failures = 0;
for (const [label, matcher] of assertions) {
  const passed =
    typeof matcher === 'boolean' ? matcher : matcher.test(migration);
  console.log(`${passed ? '✓' : '✗'} ${label}`);
  if (!passed) failures += 1;
}
if (failures) process.exitCode = 1;
