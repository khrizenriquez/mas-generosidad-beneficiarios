const [major] = process.versions.node.split('.').map(Number);
if (major !== 24) {
  console.error(
    `Se requiere Node 24 LTS; versión detectada: ${process.version}.`,
  );
  process.exitCode = 1;
}

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;
if (Boolean(url) !== Boolean(anon)) {
  console.error(
    'VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben configurarse juntas.',
  );
  process.exitCode = 1;
} else if (!url) {
  console.log(
    'Supabase no configurado: build permitido; login y datos reales estarán desactivados.',
  );
} else {
  console.log('Variables públicas de Supabase presentes.');
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('VITE_')) {
  console.error('La service role nunca debe exponerse como variable VITE_.');
  process.exitCode = 1;
}
