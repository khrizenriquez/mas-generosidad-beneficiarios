import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { localeStorageKey } from './catalog.js';
import { I18nProvider } from './I18nProvider.jsx';
import { useI18n } from './useI18n.js';

function LocaleProbe() {
  const { locale, setLocale, t } = useI18n();
  return (
    <>
      <p>{t('home.title')}</p>
      <p data-testid="locale">{locale}</p>
      <button onClick={() => setLocale('en')}>change</button>
    </>
  );
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.lang = 'es';
});

describe('I18nProvider', () => {
  it('inicia en español y actualiza idioma, título y preferencia al elegir inglés', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    expect(
      screen.getByText('Cada historia merece ser escuchada.'),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'change' }));

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByText('Every story deserves to be heard.')).toBeVisible();
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('Stories of Más Generosidad');
    expect(window.localStorage.getItem(localeStorageKey)).toBe('en');
  });

  it('recupera una selección persistida válida', () => {
    window.localStorage.setItem(localeStorageKey, 'en');

    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });

  it('mantiene español cuando la preferencia guardada no es admitida', () => {
    window.localStorage.setItem(localeStorageKey, 'fr');

    act(() => {
      render(
        <I18nProvider>
          <LocaleProbe />
        </I18nProvider>,
      );
    });

    expect(screen.getByTestId('locale')).toHaveTextContent('es');
  });
});
