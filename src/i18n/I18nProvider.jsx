import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  coerceLocale,
  defaultLocale,
  localeStorageKey,
  translate,
  translatePlural,
} from './catalog.js';
import { I18nContext } from './I18nContext.js';

function readStoredLocale() {
  try {
    return coerceLocale(window.localStorage.getItem(localeStorageKey));
  } catch {
    return defaultLocale;
  }
}

function saveLocale(locale) {
  try {
    window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // The selected locale remains active for the current session.
  }
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale);

  const setLocale = useCallback((nextLocale) => {
    const safeLocale = coerceLocale(nextLocale);
    setLocaleState(safeLocale);
    saveLocale(safeLocale);
  }, []);

  const t = useCallback(
    (key, values) => translate(locale, key, values),
    [locale],
  );
  const tPlural = useCallback(
    (key, count, values) => translatePlural(locale, key, count, values),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t('meta.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'));
  }, [locale, t]);

  const value = useMemo(
    () => ({ locale, setLocale, t, tPlural }),
    [locale, setLocale, t, tPlural],
  );

  return <I18nContext value={value}>{children}</I18nContext>;
}
