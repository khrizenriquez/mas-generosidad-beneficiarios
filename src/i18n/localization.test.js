import { describe, expect, it } from 'vitest';
import {
  getLocalizedImageAlt,
  isCompleteLocalization,
  selectLocalization,
} from './localization.js';

const complete = {
  school_grade: 'Grade',
  favorite_subject: 'Subject',
  hobby: 'Hobby',
  future_goal: 'Goal',
  public_story: 'Story',
};

describe('localization helpers', () => {
  it('selects only a complete requested localization', () => {
    const profile = {
      localizations: { es: complete, en: { ...complete, hobby: '' } },
    };

    expect(selectLocalization(profile, 'es')).toEqual(complete);
    expect(selectLocalization(profile, 'en')).toBeNull();
    expect(isCompleteLocalization(profile.localizations.en)).toBe(false);
  });

  it('does not fall back to another language for editorial or image text', () => {
    expect(
      getLocalizedImageAlt({ alt_texts: { es: 'Descripción' } }, 'en'),
    ).toBeNull();
  });
});
