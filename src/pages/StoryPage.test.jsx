import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { localeStorageKey } from '../i18n/catalog.js';
import { I18nProvider } from '../i18n/I18nProvider.jsx';
import { publicProfileFixture } from '../i18n/testFixtures.js';
import { getPublicBeneficiary } from '../services/publicBeneficiaries.js';
import StoryPage from './StoryPage.jsx';

vi.mock('../services/publicBeneficiaries.js', () => ({
  getPublicBeneficiary: vi.fn(),
}));

afterEach(() => window.localStorage.clear());

beforeEach(() => {
  getPublicBeneficiary.mockResolvedValue(publicProfileFixture);
});

describe('StoryPage', () => {
  it('muestra la versión editorial elegida junto con etiquetas localizadas', async () => {
    window.localStorage.setItem(localeStorageKey, 'en');
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/historias/TEST-001']}>
            <Routes>
              <Route path="/historias/:code" element={<StoryPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </I18nProvider>,
    );

    expect(await screen.findByText('Their aspiration')).toBeVisible();
    expect(screen.getByText('Their story')).toBeVisible();
    expect(screen.getByText('12 years old')).toBeVisible();
    expect(screen.getByText('Girl')).toBeVisible();
    expect(screen.getByText('Favorite subject')).toBeVisible();
    expect(screen.getByText('Nombre editorial sin traducir')).toBeVisible();
    expect(screen.getByText('An untranslated editorial goal')).toBeVisible();
    expect(screen.getByText('An untranslated editorial story.')).toBeVisible();
    expect(screen.getByText('Editorial subject')).toBeVisible();
  });

  it('muestra un estado localizado cuando no existe la versión elegida', async () => {
    window.localStorage.setItem(localeStorageKey, 'en');
    getPublicBeneficiary.mockResolvedValue({
      ...publicProfileFixture,
      localizations: { es: publicProfileFixture.localizations.es },
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/historias/TEST-001']}>
            <Routes>
              <Route path="/historias/:code" element={<StoryPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </I18nProvider>,
    );

    expect(
      await screen.findByText('This story is not available in English yet.'),
    ).toBeVisible();
    expect(screen.queryByText('Relato editorial sin traducir.')).toBeNull();
  });
});
