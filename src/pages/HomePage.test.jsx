import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { localeStorageKey } from '../i18n/catalog.js';
import { I18nProvider } from '../i18n/I18nProvider.jsx';
import { publicProfileFixture } from '../i18n/testFixtures.js';
import { getPublicBeneficiaries } from '../services/publicBeneficiaries.js';
import HomePage from './HomePage.jsx';

vi.mock('../services/publicBeneficiaries.js', () => ({
  getPublicBeneficiaries: vi.fn(),
}));

afterEach(() => window.localStorage.clear());

describe('HomePage', () => {
  it('conserva búsqueda por nombre y visibilidad cuando falta el idioma elegido', async () => {
    window.localStorage.setItem(localeStorageKey, 'en');
    getPublicBeneficiaries.mockResolvedValue([
      {
        ...publicProfileFixture,
        localizations: { es: publicProfileFixture.localizations.es },
      },
    ]);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </QueryClientProvider>
      </I18nProvider>,
    );

    expect(
      await screen.findByText(
        'This story is currently available only in another language.',
      ),
    ).toBeVisible();
    fireEvent.change(screen.getByLabelText('Search by name'), {
      target: { value: 'NOMBRE EDITORIAL' },
    });
    expect(screen.getByText('1 story found')).toBeVisible();
  });
});
