import { describe, expect, it } from 'vitest';
import { getDemoBeneficiaries } from './demoBeneficiaries.js';

describe('getDemoBeneficiaries', () => {
  it('devuelve contenido ficticio localizado sin alterar los códigos demo', () => {
    const spanish = getDemoBeneficiaries('es');
    const english = getDemoBeneficiaries('en');

    expect(spanish).toHaveLength(3);
    expect(english).toHaveLength(3);
    expect(english[0].code).toBe('DEMO-001');
    expect(english[0].full_name).toBe('Sample Profile One');
    expect(spanish[0].full_name).toBe('Perfil de muestra Uno');
  });
});
