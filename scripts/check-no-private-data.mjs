import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

let tracked = [];
try {
  tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
} catch {
  console.log(
    'Git aún no está inicializado; revisión de privacidad pospuesta.',
  );
  process.exit(0);
}

const forbiddenPaths = tracked.filter((file) =>
  /(^|\/)(private-import|backups)(\/|$)|\.docx$|\.zip$|docs\/holaestassonlasfotos\//i.test(
    file,
  ),
);
if (forbiddenPaths.length) {
  console.error(
    `Archivos privados rastreados por Git:\n${forbiddenPaths.join('\n')}`,
  );
  process.exit(1);
}

const secretPatterns = [
  /\beyJ[a-zA-Z0-9_-]{30,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\b/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!TU_CLAVE)[^\s]{20,}/,
];
for (const file of tracked.filter(
  (name) => !name.endsWith('package-lock.json'),
)) {
  const content = await readFile(file).catch(() => null);
  if (!content || content.includes(0)) continue;
  const text = content.toString('utf8');
  if (secretPatterns.some((pattern) => pattern.test(text))) {
    console.error(`Posible secreto detectado en ${file}.`);
    process.exit(1);
  }
}
console.log(
  'No hay documentos privados, fotos originales ni secretos evidentes rastreados por Git.',
);
