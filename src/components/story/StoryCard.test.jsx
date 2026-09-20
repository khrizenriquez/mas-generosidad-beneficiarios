import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { localeStorageKey } from '../../i18n/catalog.js';
import { I18nProvider } from '../../i18n/I18nProvider.jsx';
import { publicProfileFixture } from '../../i18n/testFixtures.js';
import { StoryCard } from './StoryCard.jsx';

afterEach(() => window.localStorage.clear());

describe('StoryCard', () => {
  it('traduce la interfaz sin modificar los campos editoriales del perfil', () => {
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
    expect(screen.getByText('Grado editorial')).toBeVisible();
    expect(screen.getByText('Meta editorial sin traducir')).toBeVisible();
    expect(screen.getByText('Relato editorial sin traducir.')).toBeVisible();
  });
});
