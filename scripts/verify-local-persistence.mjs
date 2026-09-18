import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { createClient } from '@supabase/supabase-js';
import { localStatus, safeError } from './lib/local-supabase.mjs';

const exec = promisify(execFile);
async function snapshot() {
  const status = await localStatus();
  const client = createClient(status.API_URL, status.SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const result = {};
  for (const table of ['beneficiaries', 'beneficiary_images']) {
    const { data, error } = await client.from(table).select('*').order('id');
    if (error) throw error;
    result[table] = data;
  }
  result.media = [];
  for (const image of result.beneficiary_images) {
    for (const path of [image.thumbnail_path, image.detail_path]) {
      const { data, error } = await client.storage
        .from('beneficiary-media')
        .download(path);
      if (error) throw error;
      result.media.push(
        createHash('sha256')
          .update(Buffer.from(await data.arrayBuffer()))
          .digest('hex'),
      );
    }
  }
  return result;
}

try {
  console.log(
    'Verificando persistencia de perfiles y fotos al detener y arrancar este proyecto…',
  );
  const before = await snapshot();
  assert.ok(
    before.beneficiary_images.length > 0,
    'Ejecuta test:local primero para crear fotos ficticias.',
  );
  await exec('npm', ['run', 'local:stop'], { maxBuffer: 20 * 1024 * 1024 });
  await exec('npm', ['run', 'local:start'], { maxBuffer: 20 * 1024 * 1024 });
  const after = await snapshot();
  const digest = (value) =>
    createHash('sha256').update(JSON.stringify(value)).digest('hex');
  assert.equal(
    digest(after),
    digest(before),
    'El reinicio debe conservar filas y bytes de las fotos.',
  );
  const response = await fetch('http://127.0.0.1:5173/admin/login');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  console.log(
    'Persistencia verificada: datos y fotografías idénticos; frontend y rutas disponibles.',
  );
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
}
