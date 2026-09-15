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
