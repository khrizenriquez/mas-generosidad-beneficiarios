import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { readFile, unlink } from 'node:fs/promises';
import { promisify } from 'node:util';
import { gunzipSync } from 'node:zlib';
import { createClient } from '@supabase/supabase-js';
import { localStatus, safeError } from './lib/local-supabase.mjs';

const exec = promisify(execFile);
try {
  const status = await localStatus();
  const password = randomBytes(32).toString('base64url');
  const { stdout } = await exec(process.execPath, ['scripts/backup.mjs'], {
    env: {
      ...process.env,
      SUPABASE_URL: status.API_URL,
      SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
      BACKUP_ENCRYPTION_PASSWORD: password,
    },
  });
  const filename = stdout.match(
    /backups\/(mas-generosidad-[\w-]+\.backup\.enc)/,
  )?.[1];
  assert.ok(filename, 'El comando genera un backup cifrado.');
  const buffer = await readFile(`backups/${filename}`);
  assert.equal(buffer.subarray(0, 5).toString(), 'MGBK1');
  function decrypt(passphrase) {
    const key = scryptSync(passphrase, buffer.subarray(5, 21), 32);
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      buffer.subarray(21, 33),
    );
    decipher.setAuthTag(buffer.subarray(33, 49));
    return JSON.parse(
      gunzipSync(
        Buffer.concat([decipher.update(buffer.subarray(49)), decipher.final()]),
      ).toString(),
    );
  }
  const payload = decrypt(password);
  const client = createClient(status.API_URL, status.SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  for (const table of ['beneficiaries', 'beneficiary_images', 'admin_users']) {
    const { count, error } = await client
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    assert.equal(
      payload[table].length,
      count,
      `El backup incluye todas las filas de ${table}.`,
    );
  }
  assert.equal(payload.media.length, payload.beneficiary_images.length * 2);
  for (const media of payload.media) {
    const decoded = Buffer.from(media.base64, 'base64');
    assert.equal(decoded.subarray(0, 4).toString(), 'RIFF');
    assert.equal(decoded.subarray(8, 12).toString(), 'WEBP');
  }
  assert.throws(() => decrypt('contraseña incorrecta ficticia'));
  await unlink(`backups/${filename}`);
  console.log(
    'Backup local verificado: filas, fotografías WebP, descifrado y rechazo de contraseña incorrecta.',
  );
  console.log(
    'El archivo de prueba se retiró; usa npm run backup:local para conservar un respaldo.',
  );
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
}
