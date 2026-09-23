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
  localizations: {
    es: {
      school_grade: 'Quinto primaria',
      favorite_subject: 'Ciencias',
      hobby: 'Leer',
      future_goal: 'Enseñar',
      public_story:
        'Relato completamente ficticio para una prueba automatizada.',
    },
    en: {
      school_grade: '',
      favorite_subject: '',
      hobby: '',
      future_goal: '',
      public_story: '',
    },
  },
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

  it('rechaza una traducción inglesa iniciada pero incompleta al publicar', () => {
    expect(
      publishedBeneficiarySchema.safeParse({
        ...complete,
        localizations: {
          ...complete.localizations,
          en: { ...complete.localizations.en, hobby: 'Reading' },
        },
      }).success,
    ).toBe(false);
  });

  it.each(['Niño', 'Niña', ''])('acepta el género permitido %s', (gender) => {
    expect(
      beneficiaryFormSchema.safeParse({
        ...complete,
        gender,
        status: 'draft',
      }).success,
    ).toBe(true);
  });

  it('rechaza un género fuera de las opciones aprobadas', () => {
    expect(
      beneficiaryFormSchema.safeParse({
        ...complete,
        gender: 'Otro',
        status: 'draft',
      }).success,
    ).toBe(false);
  });
});
