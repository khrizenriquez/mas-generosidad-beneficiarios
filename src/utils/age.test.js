import { describe, expect, it } from 'vitest';
import { calculateAge } from './age.js';

describe('calculateAge', () => {
  const today = new Date(2026, 8, 14);

  it('resta un año cuando el cumpleaños todavía no ha ocurrido', () => {
    expect(calculateAge('2010-09-15', today)).toBe(15);
  });

  it('incluye el cumpleaños del día actual', () => {
    expect(calculateAge('2010-09-14', today)).toBe(16);
  });

  it('no calcula datos ausentes, inválidos o futuros', () => {
    expect(calculateAge('', today)).toBeNull();
    expect(calculateAge('fecha-invalida', today)).toBeNull();
    expect(calculateAge('2030-01-01', today)).toBeNull();
  });
});
