import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { requireLoopback, safeError } from './lib/local-supabase.mjs';

const exec = promisify(execFile);
const name = 'mg-beneficiarios-frontend';
const label = 'org.masgenerosidad.project';
const project = 'mas-generosidad-beneficiarios';
const image = 'localhost/mas-generosidad-beneficiarios:local';
try {
  const { stdout } = await exec('podman', [
    'ps',
    '-a',
    '--filter',
    `name=^${name}$`,
    '--format',
    '{{.Names}}',
  ]);
  if (stdout.trim()) {
    const { stdout: owner } = await exec('podman', [
      'inspect',
      name,
      '--format',
      `{{index .Config.Labels "${label}"}}`,
    ]);
    if (owner.trim() !== project)
      throw new Error(`El contenedor ${name} pertenece a otro proyecto.`);
  }
  if (process.argv[2] === 'stop') {
    if (stdout.trim()) await exec('podman', ['stop', name]);
    console.log('Frontend local detenido.');
  } else {
    const config = JSON.parse(
      await readFile('private-import/local-environment.json', 'utf8'),
    );
    requireLoopback(config.url);
    console.log('Construyendo el frontend local en Podman…');
    await exec(
      'podman',
      [
        'build',
        '-f',
        'containers/frontend.Containerfile',
        '-t',
        image,
        '--build-arg',
        `VITE_SUPABASE_URL=${config.url}`,
        '--build-arg',
        `VITE_SUPABASE_ANON_KEY=${config.anonKey}`,
        '.',
      ],
      { maxBuffer: 20 * 1024 * 1024 },
    );
    await exec('podman', [
      'run',
      '-d',
      '--replace',
      '--name',
      name,
      '--label',
      `${label}=${project}`,
      '-p',
      '127.0.0.1:5173:8080',
      image,
    ]);
    console.log('Aplicación local: http://127.0.0.1:5173');
  }
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
}
