import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { analytics } = vi.hoisted(() => ({ analytics: vi.fn() }));

vi.mock('@vercel/analytics/react', () => ({ Analytics: analytics }));

import { AnonymousAnalytics } from './AnonymousAnalytics.jsx';

describe('AnonymousAnalytics', () => {
  it('monta una sola instancia sin enviar props de la aplicación', () => {
    render(<AnonymousAnalytics />);

    expect(analytics).toHaveBeenCalledOnce();
    expect(analytics).toHaveBeenCalledWith({}, undefined);
  });
});
