import { describe, expect, it } from 'vitest';
import { buildLocalizationRows } from './adminBeneficiaries.js';

describe('buildLocalizationRows', () => {
  it('normaliza las dos versiones sin incluir columnas editoriales históricas', () => {
    expect(
      buildLocalizationRows('test-id', {
        es: {
          school_grade: ' Quinto ',
          favorite_subject: ' Ciencias ',
          hobby: '',
          future_goal: ' Aprender ',
          public_story: ' Relato ficticio ',
        },
        en: {},
      }),
    ).toEqual([
      {
        beneficiary_id: 'test-id',
        locale: 'es',
        school_grade: 'Quinto',
        favorite_subject: 'Ciencias',
        hobby: null,
        future_goal: 'Aprender',
        public_story: 'Relato ficticio',
      },
      {
        beneficiary_id: 'test-id',
        locale: 'en',
        school_grade: null,
        favorite_subject: null,
        hobby: null,
        future_goal: null,
        public_story: null,
      },
    ]);
  });
});
