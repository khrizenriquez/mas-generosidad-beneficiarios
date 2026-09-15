import { describe, expect, it } from 'vitest';
import { normalizeForSearch } from './normalize.js';

describe('normalizeForSearch', () => {
  it('ignora acentos, mayúsculas y espacios exteriores', () => {
    expect(normalizeForSearch('  ÁNGELA Lucía  ')).toBe('angela lucia');
  });
});
