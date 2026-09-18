import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { localStatus, safeError } from './lib/local-supabase.mjs';
import { ensureLocalAccounts } from './lib/local-accounts.mjs';

try {
  const status = await localStatus();
  const client = createClient(status.API_URL, status.SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let credentials;
  try {
    credentials = JSON.parse(
      await readFile('private-import/local-environment.json', 'utf8'),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    credentials = {
      email: 'admin-local@example.test',
      password: randomBytes(24).toString('base64url'),
      unauthorizedEmail: 'visitante-local@example.test',
      unauthorizedPassword: randomBytes(24).toString('base64url'),
    };
  }
  console.log('Preparando cuentas ficticias locales…');
  await ensureLocalAccounts(client, credentials);
  await mkdir('private-import', { recursive: true });
  await writeFile(
    'private-import/local-environment.json',
    JSON.stringify({
      ...credentials,
      url: status.API_URL,
      anonKey: status.ANON_KEY,
    }),
    { mode: 0o600 },
  );
  await writeFile(
    '.env.podman.local',
    `VITE_SUPABASE_URL=${status.API_URL}\nVITE_SUPABASE_ANON_KEY=${status.ANON_KEY}\nVITE_USE_DEMO_DATA=false\n`,
    { mode: 0o600 },
  );
  console.log('Entorno configurado. Inicia React con npm run dev:local.');
  console.log(
    'Credenciales ficticias en private-import/local-environment.json (ignorado por Git).',
  );
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
}
