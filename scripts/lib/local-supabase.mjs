import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);

export async function containerEnv() {
  const env = { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1' };
  if (env.DOCKER_HOST || env.CI) return env;
  if (process.platform === 'darwin' || process.platform === 'win32') {
    const args = ['machine', 'inspect'];
    if (env.PODMAN_MACHINE) args.push(env.PODMAN_MACHINE);
    const { stdout } = await exec('podman', args);
    const [machine] = JSON.parse(stdout);
    if (machine.State !== 'running')
      throw new Error('Inicia tu máquina con podman machine start.');
    const socket = machine.ConnectionInfo.PodmanSocket?.Path;
    if (!socket)
      throw new Error(
        'Configura DOCKER_HOST con el socket compatible de Podman.',
      );
    env.DOCKER_HOST = `unix://${socket}`;
  } else {
    const { stdout } = await exec('podman', ['info', '--format', 'json']);
    const socket = JSON.parse(stdout).host.remoteSocket.path;
    await access(socket);
    env.DOCKER_HOST = `unix://${socket}`;
  }
  return env;
}

export async function runSupabase(args) {
  const executable = resolve('node_modules/.bin/supabase');
  return exec(executable, args, {
    env: await containerEnv(),
    maxBuffer: 20 * 1024 * 1024,
  });
}

export function requireLoopback(url) {
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'http:' ||
    !['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
  )
    throw new Error('Este comando solo admite Supabase local en loopback.');
}

export async function localStatus() {
  const { stdout } = await runSupabase(['status', '--output', 'json']);
  const status = JSON.parse(stdout);
  requireLoopback(status.API_URL);
  if (!status.ANON_KEY || !status.SERVICE_ROLE_KEY)
    throw new Error('El entorno local no ofrece las claves necesarias.');
  return status;
}

export function safeError(error) {
  // Los comandos status/start pueden incluir claves incluso al fallar.
  return `${error.stderr?.slice(-2000) || ''}\n${error.stdout?.slice(-2000) || ''}\n${error.stderr ? `Código de salida: ${error.code}` : error.message}`
    .replace(/eyJ[\w.-]+/g, '[clave local omitida]')
    .replace(/sb_(?:secret|publishable)_[\w-]+/g, '[clave local omitida]')
    .slice(-5000);
}
