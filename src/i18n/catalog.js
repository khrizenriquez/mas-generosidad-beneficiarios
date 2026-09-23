import en from './locales/en.json';
import es from './locales/es.json';

export const defaultLocale = 'es';
export const localeStorageKey = 'mg-public-locale-v1';
export const supportedLocales = Object.freeze(['es', 'en']);

const catalogs = Object.freeze({ en, es });

export function isSupportedLocale(value) {
  return supportedLocales.includes(value);
}

export function coerceLocale(value) {
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function getCatalog(locale) {
  return catalogs[coerceLocale(locale)];
}

export function getMessage(locale, key) {
  const localized = getByPath(getCatalog(locale), key);
  if (localized !== undefined) return localized;
  return getByPath(catalogs[defaultLocale], key);
}

export function translate(locale, key, values = {}) {
  const message = getMessage(locale, key);
  if (typeof message !== 'string') return '';
  return interpolate(message, values);
}

export function translatePlural(locale, key, count, values = {}) {
  const message = getMessage(locale, key);
  if (!message || typeof message !== 'object') return '';
  const category = new Intl.PluralRules(coerceLocale(locale)).select(count);
  const template = message[category] ?? message.other;
  return typeof template === 'string'
    ? interpolate(template, { ...values, count })
    : '';
}

export function formatAge(locale, age) {
  return translate(locale, 'story.age', { age });
}

export function translateGender(locale, gender) {
  if (!gender) return null;
  const translated = translate(locale, `domain.gender.${gender}`);
  return translated || gender;
}

export function getDemoBeneficiaries() {
  const englishByCode = new Map(
    catalogs.en.demoProfiles.map((profile) => [profile.code, profile]),
  );

  return catalogs.es.demoProfiles.map((spanishProfile) => {
    const englishProfile = englishByCode.get(spanishProfile.code);
    const englishAvailable = englishProfile?.available !== false;
    return {
      id: spanishProfile.id,
      code: spanishProfile.code,
      full_name: spanishProfile.full_name,
      age: spanishProfile.age,
      gender: spanishProfile.gender,
      images: (spanishProfile.images ?? []).map((spanishImage) => {
        const englishImage = englishProfile?.images?.find(
          (image) => image.id === spanishImage.id,
        );
        return {
          ...spanishImage,
          alt_texts: {
            es: spanishImage.alt_text,
            ...(englishAvailable && englishImage?.alt_text
              ? { en: englishImage.alt_text }
              : {}),
          },
          alt_text: undefined,
        };
      }),
      localizations: {
        es: toDemoLocalization(spanishProfile),
        ...(englishProfile && englishAvailable
          ? { en: toDemoLocalization(englishProfile) }
          : {}),
      },
    };
  });
}

function toDemoLocalization(profile) {
  return {
    school_grade: profile.school_grade,
    favorite_subject: profile.favorite_subject,
    hobby: profile.hobby,
    future_goal: profile.future_goal,
    public_story: profile.public_story,
  };
}

function getByPath(source, path) {
  return path.split('.').reduce((value, segment) => value?.[segment], source);
}

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key];
    return value === undefined || value === null ? match : String(value);
  });
}
