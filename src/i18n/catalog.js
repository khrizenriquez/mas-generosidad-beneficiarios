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

export function getDemoBeneficiaries(locale) {
  return getCatalog(locale).demoProfiles;
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
