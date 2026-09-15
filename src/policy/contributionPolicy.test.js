import { describe, expect, it } from 'vitest';
import {
  hasCoauthorTrailer,
  isValidBranchName,
  validateContribution,
} from './contributionPolicy.js';

describe('contribution policy', () => {
  it('acepta ramas cortas y Dependabot', () => {
    expect(isValidBranchName('feat/buscador')).toBe(true);
    expect(isValidBranchName('chore/trunk-based-workflow')).toBe(true);
    expect(isValidBranchName('dependabot/npm_and_yarn/react-20')).toBe(true);
  });

  it('rechaza ramas sin prefijo', () => {
    expect(isValidBranchName('mi-cambio')).toBe(false);
    expect(isValidBranchName('feature/buscador')).toBe(false);
  });

  it('detecta trailers de coautoría sin depender de mayúsculas', () => {
    expect(
      hasCoauthorTrailer(
        'fix: cambio\n\nCo-authored-by: Bot <bot@example.com>',
      ),
    ).toBe(true);
    expect(hasCoauthorTrailer('docs: cambio sin coautoría')).toBe(false);
  });

  it('exige main como base y reporta solo hashes con coautoría', () => {
    expect(
      validateContribution({
        branch: 'cambio-largo',
        baseBranch: 'develop',
        commits: [
          {
            hash: '1234567890abcdef',
            message:
              'feat: ejemplo\n\nCo-authored-by: Agent <agent@example.com>',
          },
        ],
      }),
    ).toEqual([
      'La rama "cambio-largo" no cumple los prefijos trunk-based permitidos.',
      'El PR debe apuntar a main, no a "develop".',
      'Trailers Co-authored-by prohibidos en: 1234567890ab.',
    ]);
  });
});
