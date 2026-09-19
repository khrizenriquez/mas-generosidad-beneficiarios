// @vitest-environment node
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import {
  TEMPORARY_DATE_OF_BIRTH,
  TEMPORARY_FIELD_PLACEHOLDER,
  createWebpVariants,
  createTemporaryImagePaths,
  ensureExpectedProfiles,
  prepareTemporaryProfileUpdate,
} from './publish-temporary-demo.mjs';

function profiles() {
  return Array.from({ length: 41 }, (_, index) => ({
    id: `test-id-${index + 1}`,
    code: `MG-${String(index + 1).padStart(3, '0')}`,
    full_name: 'Perfil ficticio',
    school_grade: 'Grado ficticio',
    favorite_subject: 'Materia ficticia',
    hobby: 'Actividad ficticia',
    future_goal: 'Meta ficticia',
    public_story: 'Relato ficticio',
    status: 'draft',
  }));
}

describe('publicación temporal autorizada', () => {
  it('acepta solo la colección completa MG-001 a MG-041', () => {
    expect(() => ensureExpectedProfiles(profiles())).not.toThrow();
    expect(() => ensureExpectedProfiles(profiles().slice(0, 40))).toThrow(
      'Se esperaban exactamente 41 perfiles',
    );
  });

  it('solo completa campos obligatorios vacíos con el texto aprobado', () => {
    const profile = {
      ...profiles()[0],
      school_grade: '',
      future_goal: null,
      public_story: '  ',
    };

    expect(prepareTemporaryProfileUpdate(profile)).toEqual({
      date_of_birth: TEMPORARY_DATE_OF_BIRTH,
      school_grade: TEMPORARY_FIELD_PLACEHOLDER,
      favorite_subject: 'Materia ficticia',
      hobby: 'Actividad ficticia',
      future_goal: TEMPORARY_FIELD_PLACEHOLDER,
      public_story: TEMPORARY_FIELD_PLACEHOLDER,
      status: 'published',
    });
  });

  it('crea rutas independientes y privadas para cada perfil', () => {
    expect(createTemporaryImagePaths('test-id-1')).toEqual({
      thumbnailPath: 'temporary-demo/test-id-1/thumbnail.webp',
      detailPath: 'temporary-demo/test-id-1/detail.webp',
    });
  });

  it('crea únicamente derivados WebP para miniatura y detalle', async () => {
    const source = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200"><rect width="100%" height="100%" fill="#10cce3"/></svg>',
    );
    const variants = await createWebpVariants(source);
    const [thumbnail, detail] = await Promise.all([
      sharp(variants.thumbnail).metadata(),
      sharp(variants.detail).metadata(),
    ]);

    expect(thumbnail.format).toBe('webp');
    expect(detail.format).toBe('webp');
    expect(thumbnail.width).toBeLessThanOrEqual(640);
    expect(detail.width).toBeLessThanOrEqual(1600);
  });
});
