import { describe, expect, it } from 'vitest';
import { getDemoBeneficiaries } from './demoBeneficiaries.js';

describe('getDemoBeneficiaries', () => {
  it('precarga contenido ficticio de ambos idiomas sin alterar códigos ni identidad', () => {
    const profiles = getDemoBeneficiaries();

    expect(profiles).toHaveLength(3);
    expect(profiles[0].code).toBe('DEMO-001');
    expect(profiles[0].full_name).toBe('Perfil de muestra Uno');
    expect(profiles[0].localizations.es.public_story).toContain('ficticio');
    expect(profiles[0].localizations.en.public_story).toContain('fictional');
  });
});
