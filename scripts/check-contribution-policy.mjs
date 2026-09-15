import { execFileSync } from 'node:child_process';
import { validateContribution } from '../src/policy/contributionPolicy.js';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const branch =
  process.env.GITHUB_HEAD_REF || git('branch', '--show-current') || 'detached';
const baseBranch =
  process.env.GITHUB_BASE_REF || (branch === 'main' ? '' : 'main');
let commits = [];

if (baseBranch) {
  try {
    const output = git(
      'log',
      `origin/${baseBranch}..HEAD`,
      '--format=%H%x1f%B%x1e',
    );
    commits = output
      .split('\x1e')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [hash, ...message] = entry.split('\x1f');
        return { hash, message: message.join('\x1f') };
      });
  } catch {
    console.error(
      `No fue posible comparar la rama con origin/${baseBranch}. Ejecuta git fetch origin.`,
    );
    process.exit(1);
  }
}

const errors = validateContribution({ branch, baseBranch, commits });
if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}

console.log(
  `✓ Política de contribución válida para ${branch}${baseBranch ? ` → ${baseBranch}` : ''}.`,
);
