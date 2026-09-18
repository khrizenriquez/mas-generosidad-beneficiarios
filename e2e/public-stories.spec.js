import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('busca por nombre y abre una historia', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Cada historia merece ser escuchada.' }),
  ).toBeVisible();
  await expect(page.getByText('3 historias encontradas')).toBeVisible();

  await page.getByLabel('Buscar por nombre').fill('MUESTRA DOS');
  await expect(page.getByText('1 historia encontrada')).toBeVisible();
  await page.getByRole('link', { name: 'Leer su historia' }).click();

  await expect(
    page.getByRole('heading', { name: 'Perfil de muestra Dos' }),
  ).toBeVisible();
  await expect(page.getByText('Su historia')).toBeVisible();
  await expect(page.getByText(/fecha de nacimiento/i)).toHaveCount(0);
});

test('muestra las tres fotografías autorizadas en el detalle', async ({
  page,
}) => {
  await page.goto('/historias/DEMO-001');

  const gallery = page.getByRole('region', {
    name: 'Galería de fotografías de Perfil de muestra Uno',
  });
  await expect(gallery).toBeVisible();
  await expect(gallery.getByRole('img')).toHaveCount(3);
  await expect(
    gallery.getByRole('img', {
      name: 'Ilustración ficticia de una actividad creativa',
    }),
  ).toBeVisible();
});

test('muestra un estado vacío y permite limpiar la búsqueda', async ({
  page,
}) => {
  await page.goto('/');
  const search = page.getByLabel('Buscar por nombre');
  await search.fill('No existe');
  await expect(
    page.getByText('Aún no hay una historia con ese nombre.'),
  ).toBeVisible();
  await search.fill('');
  await expect(page.getByText('3 historias encontradas')).toBeVisible();
});

test('el acceso administrativo no ofrece registro público', async ({
  page,
}) => {
  await page.goto('/admin/login');
  await expect(
    page.getByRole('heading', { name: 'Área administrativa' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
  await expect(page.getByText(/registr/i)).toHaveCount(0);
});

test('la página declara noindex y el enlace externo es seguro', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow, noarchive',
  );
  const link = page.getByRole('link', { name: 'Conoce la ONG' });
  if (await link.isVisible()) {
    await expect(link).toHaveAttribute('rel', /noreferrer/);
    await expect(link).toHaveAttribute('href', 'https://masgenerosidad.org/');
  }
});

test('usa la identidad azul y cian en la portada', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(246, 248, 255)',
  );
  await expect(page.locator('article').first()).toHaveCSS(
    'border-top-color',
    'rgb(203, 213, 245)',
  );
});

test('el footer muestra los enlaces limpios aprobados', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('footer');
  const authorLink = footer.getByRole('link', {
    name: 'Made with love by Christofer Enríquez',
  });

  await expect(authorLink).toHaveAttribute(
    'href',
    'https://khrizenriquez.github.io/khrizenriquez/',
  );
  await expect(authorLink).toHaveAttribute('rel', /noreferrer/);
  await expect(
    footer.getByRole('link', { name: 'masgenerosidad.org' }),
  ).toHaveAttribute('href', 'https://masgenerosidad.org/');
  await expect(
    footer.getByText(
      'Este espacio comparte historias autorizadas por la ONG y protege los datos privados de cada beneficiario.',
    ),
  ).toHaveCount(0);
  await expect(
    footer.getByText('Más Generosidad', { exact: true }),
  ).toHaveCount(0);
});

test('las tarjetas se revelan al entrar y la fotografía amplía 20%', async ({
  page,
}) => {
  await page.goto('/');

  const card = page.locator('article').first();
  const image = card.locator('.story-card__image');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-revealed', 'true');

  await card.hover();
  await expect(image).toHaveCSS('transform', 'matrix(1.2, 0, 0, 1.2, 0, 0)');

  await card.getByRole('link', { name: 'Leer su historia' }).focus();
  await expect(image).toHaveCSS('transform', 'matrix(1.2, 0, 0, 1.2, 0, 0)');
});

test('las tarjetas sin fotografía conservan el placeholder de marca', async ({
  page,
}) => {
  await page.goto('/');

  const card = page
    .locator('article')
    .filter({ hasText: 'Perfil de muestra Dos' });
  await card.scrollIntoViewIfNeeded();

  await expect(card.getByText('Historia sin fotografía')).toBeVisible();
  await expect(card.locator('.story-card__image')).toHaveCount(0);
});

test('las tarjetas respetan la preferencia de movimiento reducido', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const card = page.locator('article').first();
  const image = card.locator('.story-card__image');

  await expect(card).toHaveAttribute('data-reduced-motion', 'true');
  await expect(card).toHaveCSS('transform', 'none');
  await card.hover();
  await expect(image).toHaveCSS('transform', 'none');
});

test('portada y detalle no tienen violaciones WCAG A/AA detectables', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('heading', { name: 'Cada historia merece ser escuchada.' })
    .waitFor();
  const homeResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(homeResults.violations).toEqual([]);

  await page.getByRole('link', { name: 'Leer su historia' }).first().click();
  await page.getByRole('heading', { name: 'Perfil de muestra Uno' }).waitFor();
  const detailResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(detailResults.violations).toEqual([]);
});
