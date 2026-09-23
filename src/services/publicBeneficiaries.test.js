import { describe, expect, it, vi } from 'vitest';

const profiles = [
  {
    code: 'TEST-001',
    localizations: { es: { public_story: 'Uno' }, en: { public_story: 'One' } },
  },
];

vi.mock('../config/env.js', () => ({
  env: { useDemoData: true },
  hasSupabaseConfig: true,
}));
vi.mock('../data/demoBeneficiaries.js', () => ({
  getDemoBeneficiaries: vi.fn(() => profiles),
}));

import {
  getPublicBeneficiaries,
  getPublicBeneficiary,
} from './publicBeneficiaries.js';

describe('public beneficiary service', () => {
  it('devuelve las dos localizaciones desde la misma carga de catálogo', async () => {
    const result = await getPublicBeneficiaries();

    expect(result).toBe(profiles);
    expect(result[0].localizations.es.public_story).toBe('Uno');
    expect(result[0].localizations.en.public_story).toBe('One');
  });

  it('obtiene detalle sin requerir que el idioma sea un parámetro de red', async () => {
    await expect(getPublicBeneficiary('TEST-001')).resolves.toBe(profiles[0]);
  });
});
