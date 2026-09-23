import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { localeStorageKey } from '../../i18n/catalog.js';
import { I18nProvider } from '../../i18n/I18nProvider.jsx';
import { publicProfileFixture } from '../../i18n/testFixtures.js';
import { StoryCard } from './StoryCard.jsx';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('StoryCard', () => {
  it('muestra la localización editorial elegida junto con la interfaz traducida', () => {
    window.localStorage.setItem(localeStorageKey, 'en');

    render(
      <I18nProvider>
        <MemoryRouter>
          <StoryCard beneficiary={publicProfileFixture} />
        </MemoryRouter>
      </I18nProvider>,
    );

    expect(screen.getByText('12 years old')).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'Read their story' }),
    ).toHaveAttribute('href', '/historias/TEST-001');
    expect(screen.getByText('Nombre editorial sin traducir')).toBeVisible();
    expect(screen.getByText('Editorial grade')).toBeVisible();
    expect(screen.getByText('An untranslated editorial goal')).toBeVisible();
    expect(screen.getByText('An untranslated editorial story.')).toBeVisible();
  });

  it('mantiene la tarjeta visible y no reutiliza español si falta inglés', () => {
    window.localStorage.setItem(localeStorageKey, 'en');
    const spanishOnly = {
      ...publicProfileFixture,
      localizations: { es: publicProfileFixture.localizations.es },
    };

    render(
      <I18nProvider>
        <MemoryRouter>
          <StoryCard beneficiary={spanishOnly} />
        </MemoryRouter>
      </I18nProvider>,
    );

    expect(screen.getByText('Nombre editorial sin traducir')).toBeVisible();
    expect(
      screen.getByText(
        'This story is currently available only in another language.',
      ),
    ).toBeVisible();
    expect(screen.queryByText('Relato editorial sin traducir.')).toBeNull();
  });
});
