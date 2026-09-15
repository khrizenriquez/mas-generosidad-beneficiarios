import { describe, expect, it } from 'vitest';
import {
  beneficiaryFormSchema,
  publishedBeneficiarySchema,
} from './beneficiarySchema.js';

const complete = {
  code: 'MG-001',
  full_name: 'Perfil de prueba',
  date_of_birth: '2014-04-12',
  gender: '',
  school_grade: 'Quinto primaria',
  favorite_subject: 'Ciencias',
  hobby: 'Leer',
  future_goal: 'Enseñar',
  public_story: 'Relato completamente ficticio para una prueba automatizada.',
  import_notes: '',
  status: 'published',
};

describe('beneficiary schemas', () => {
  it('permite guardar un borrador incompleto con código válido', () => {
    expect(
      beneficiaryFormSchema.safeParse({
        ...complete,
        full_name: '',
        date_of_birth: '',
        status: 'draft',
      }).success,
    ).toBe(true);
  });

  it('rechaza publicar si falta la fecha completa', () => {
    expect(
      publishedBeneficiarySchema.safeParse({ ...complete, date_of_birth: '' })
        .success,
    ).toBe(false);
  });

  it('acepta una publicación completa', () => {
    expect(publishedBeneficiarySchema.safeParse(complete).success).toBe(true);
  });
});
