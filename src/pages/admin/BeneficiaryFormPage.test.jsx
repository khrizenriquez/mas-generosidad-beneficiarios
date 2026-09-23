import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BeneficiaryFormPage from './BeneficiaryFormPage.jsx';

vi.mock('../../services/adminBeneficiaries.js', () => ({
  getAdminBeneficiary: vi.fn(),
  getNextBeneficiaryCode: vi.fn(),
  saveBeneficiary: vi.fn(),
}));

import { getNextBeneficiaryCode } from '../../services/adminBeneficiaries.js';

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin/beneficiarios/nuevo']}>
        <Routes>
          <Route
            path="/admin/beneficiarios/nuevo"
            element={<BeneficiaryFormPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('BeneficiaryFormPage', () => {
  beforeEach(() => {
    getNextBeneficiaryCode.mockResolvedValue('MG-801');
  });

  it('muestra secciones separadas para español e inglés en el formulario', async () => {
    renderPage();
    await screen.findByDisplayValue('MG-801');
    await screen.getByRole('button', { name: 'Siguiente' }).click();

    expect(screen.getByRole('heading', { name: 'Español' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'English' })).toBeVisible();
    expect(screen.getAllByLabelText('Grado escolar')).toHaveLength(2);
    expect(
      screen.getByText(
        'Opcional; si lo inicias, completa todos los campos antes de publicar.',
      ),
    ).toBeVisible();
  });
});
