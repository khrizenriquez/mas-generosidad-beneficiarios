import { readFile } from 'node:fs/promises';

const migration = await readFile(
  new URL(
    '../supabase/migrations/202609140001_initial_schema.sql',
    import.meta.url,
  ),
  'utf8',
);

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
