import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import es from './locales/es.json';
import {
  defaultLocale,
  formatAge,
  getMessage,
  translate,
  translateGender,
  translatePlural,
} from './catalog.js';

function leafPaths(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, nested]) =>
    leafPaths(nested, prefix ? `${prefix}.${key}` : key),
  );
}

describe('catalog', () => {
  it('mantiene las mismas claves de interfaz en español e inglés', () => {
    const spanish = leafPaths({ ...es, demoProfiles: undefined }).sort();
    const english = leafPaths({ ...en, demoProfiles: undefined }).sort();

    expect(english).toEqual(spanish);
  });

  it('usa español para locales y claves no disponibles', () => {
    expect(defaultLocale).toBe('es');
    expect(translate('fr', 'home.title')).toBe(es.home.title);
    expect(getMessage('en', 'missing.key')).toBeUndefined();
  });

  it('interpola valores y pluraliza conteos', () => {
    expect(translate('en', 'gallery.title', { name: 'Sample Name' })).toBe(
      'Photo gallery of Sample Name',
    );
    expect(translatePlural('es', 'home.resultCount', 1)).toBe(
      '1 historia encontrada',
    );
    expect(translatePlural('en', 'home.resultCount', 2)).toBe(
      '2 stories found',
    );
    expect(formatAge('en', 7)).toBe('7 years old');
  });

  it('traduce solo etiquetas de género y conserva valores no reconocidos', () => {
    expect(translateGender('en', 'Niña')).toBe('Girl');
    expect(translateGender('en', 'Valor editorial')).toBe('Valor editorial');
  });
});
