import { readFile, writeFile } from 'node:fs/promises';

const canonical = (
  await readFile(
    new URL('../.agent-context/shared.md', import.meta.url),
    'utf8',
  )
).trim();
const files = ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md'];
for (const file of files) {
  const url = new URL(`../${file}`, import.meta.url);
  const content = await readFile(url, 'utf8');
  const next = content.replace(
    /<!-- agent-context:start -->[\s\S]*?<!-- agent-context:end -->/,
    `<!-- agent-context:start -->\n\n${canonical}\n\n<!-- agent-context:end -->`,
  );
  await writeFile(url, next);
  console.log(`Sincronizado ${file}`);
}
