// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { parseBeneficiaries } from './import-beneficiaries.mjs';

describe('importación privada con entradas exclusivamente ficticias', () => {
  it('normaliza 41 códigos, excluye MG042 y conserva borradores', () => {
    const source = Array.from(
      { length: 42 },
      (_, index) =>
        `MG${String(index + 1).padStart(3, '0')}\nNombre: Perfil ficticio ${index + 1}`,
    ).join('\n');
    const rows = parseBeneficiaries(source);
    expect(rows).toHaveLength(41);
    expect(rows[0].code).toBe('MG-001');
    expect(rows.at(-1).code).toBe('MG-041');
    expect(rows.every((row) => row.status === 'draft')).toBe(true);
  });

  it('no infiere años ni convierte fechas inválidas', () => {
    const rows = parseBeneficiaries(
      [
        'MG001',
        'Fecha de nacimiento: 4 de mayo',
        'MG002',
        'Fecha de nacimiento: 31/02/2015',
        'MG003',
        'Fecha de nacimiento: 29 de febrero de 2016',
      ].join('\n'),
    );
    expect(rows.map((row) => row.date_of_birth)).toEqual([
      null,
      null,
      '2016-02-29',
    ]);
    expect(rows[0].import_notes).toContain('4 de mayo');
    expect(rows[1].import_notes).toContain('31/02/2015');
  });
});
