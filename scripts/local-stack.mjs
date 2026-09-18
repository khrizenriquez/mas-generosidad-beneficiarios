import { localStatus, runSupabase, safeError } from './lib/local-supabase.mjs';
import { setTimeout } from 'node:timers/promises';

const command = process.argv[2];
const commands = {
  start: [
    'start',
    '--exclude',
    'realtime,imgproxy,postgres-meta,studio,edge-runtime,logflare,vector,supavisor,mailpit',
    '--ignore-health-check',
  ],
  stop: ['stop'],
  test: ['test', 'db'],
};

try {
  if (!commands[command]) throw new Error('Usa start, stop o test.');
  console.log(
    command === 'start'
      ? 'Iniciando Supabase local. La primera descarga puede tardar varios minutos…'
      : 'Ejecutando Supabase local…',
  );
  const result = await runSupabase(commands[command]);
  if (command === 'start') {
    // Podman informa "starting" en contenedores sin healthcheck definido.
    // Comprobamos los servicios por HTTP y fallamos si no están listos.
    const status = await localStatus();
    const deadline = Date.now() + 60_000;
    let ready = false;
    while (Date.now() < deadline && !ready) {
      const checks = await Promise.allSettled(
        [
          '/auth/v1/health',
          '/rest/v1/rpc/get_public_beneficiaries',
          '/storage/v1/status',
        ].map(async (path) => {
          const response = await fetch(`${status.API_URL}${path}`, {
            headers: {
              apikey: status.ANON_KEY,
              Authorization: `Bearer ${status.ANON_KEY}`,
            },
            signal: AbortSignal.timeout(5000),
          });
          if (!response.ok)
            throw new Error(`Servicio local no disponible: ${path}`);
        }),
      );
      ready = checks.every((check) => check.status === 'fulfilled');
      if (!ready) await setTimeout(1000);
    }
    if (!ready)
      throw new Error(
        'Auth, REST o Storage no respondió. Revisa los contenedores del proyecto y vuelve a ejecutar npm run local:start.',
      );
  }
  if (command === 'test') console.log(result.stdout);
  console.log(
    command === 'stop'
      ? 'Entorno detenido; los volúmenes de datos se conservan.'
      : 'Comando completado.',
  );
} catch (error) {
  console.error(safeError(error));
  process.exitCode = 1;
}
