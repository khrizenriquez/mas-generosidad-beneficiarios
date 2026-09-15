import { readFile } from 'node:fs/promises';

const canonical = (
  await readFile(
    new URL('../.agent-context/shared.md', import.meta.url),
    'utf8',
  )
).trim();
const files = ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md'];
for (const file of files) {
  const content = await readFile(
    new URL(`../${file}`, import.meta.url),
    'utf8',
  );
  const match = content.match(
    /<!-- agent-context:start -->\n([\s\S]*?)\n<!-- agent-context:end -->/,
  );
  if (!match || match[1].trim() !== canonical) {
    console.error(
      `${file} no coincide con .agent-context/shared.md. Ejecuta npm run context:sync.`,
    );
    process.exit(1);
  }
}

const integration = JSON.parse(
  await readFile(
    new URL('../.specify/integration.json', import.meta.url),
    'utf8',
  ),
);
const installed = new Set(integration.installed_integrations);
for (const agent of ['codex', 'claude', 'copilot']) {
  if (!installed.has(agent)) {
    console.error(`Falta la integración oficial de Spec Kit para ${agent}.`);
    process.exit(1);
  }
}
if (integration.default_integration !== 'codex') {
  console.error(
    'Codex debe permanecer como integración predeterminada de Spec Kit.',
  );
  process.exit(1);
}

console.log(
  'El contexto y las integraciones de Spec Kit coinciden para Codex, Claude y Copilot.',
);
