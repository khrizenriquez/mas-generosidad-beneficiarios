import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StoryGallery } from './StoryGallery.jsx';

const images = [
  {
    id: 'secondary',
    detail_url: 'https://example.test/secondary.webp',
    alt_text: 'Participando en una actividad comunitaria',
    sort_order: 0,
    is_primary: false,
  },
  {
    id: 'primary',
    detail_url: 'https://example.test/primary.webp',
    alt_text: 'Sonriendo frente a la escuela',
    sort_order: 1,
    is_primary: true,
  },
  {
    id: 'third',
    detail_url: 'https://example.test/third.webp',
    alt_text: null,
    sort_order: 2,
    is_primary: false,
  },
];

describe('StoryGallery', () => {
  it('muestra las tres fotografías y destaca primero la principal', () => {
    render(<StoryGallery images={images} beneficiaryName="Perfil de prueba" />);

    const renderedImages = screen.getAllByRole('img');
    expect(renderedImages).toHaveLength(3);
    expect(renderedImages[0]).toHaveAttribute(
      'src',
      'https://example.test/primary.webp',
    );
    expect(renderedImages[1]).toHaveAttribute(
      'src',
      'https://example.test/secondary.webp',
    );
    expect(renderedImages[2]).toHaveAccessibleName(
      'Fotografía 3 de Perfil de prueba',
    );
  });

  it('mantiene el estado digno cuando no hay fotografías disponibles', () => {
    render(<StoryGallery images={[]} beneficiaryName="Perfil de prueba" />);

    expect(screen.getByText('Historia sin fotografía')).toBeInTheDocument();
  });
});
