import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '../../i18n/I18nProvider.jsx';
import { LanguageSelector } from './LanguageSelector.jsx';

describe('LanguageSelector', () => {
  it('muestra el idioma actual y permite elegir inglés con teclado', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageSelector />
      </I18nProvider>,
    );

    const selector = screen.getByRole('button', {
      name: 'Idioma actual: Español',
    });
    await user.click(selector);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(
      screen.getByRole('button', { name: 'Current language: English' }),
    ).toBeVisible();
    expect(document.documentElement.lang).toBe('en');
  });
});
