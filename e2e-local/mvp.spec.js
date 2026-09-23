import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { requireLoopback } from '../scripts/lib/local-supabase.mjs';

const credentials = JSON.parse(
  await readFile('private-import/local-environment.json', 'utf8'),
);
requireLoopback(credentials.url);
const anonymous = () =>
  createClient(credentials.url, credentials.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

async function login(page, email, password) {
  await page.goto('/admin/login');
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel(/^Contraseña/).fill(password);
  await page.getByLabel(/^Contraseña/).press('Enter');
}

test('rechaza cuentas válidas fuera de la allowlist y protege rutas', async ({
  page,
}) => {
  await page.goto('/admin/beneficiarios');
  await expect(page).toHaveURL(/\/admin\/login/);
  const signup = await anonymous().auth.signUp({
    email: 'registro-prohibido@example.test',
    password: randomBytes(24).toString('base64url'),
  });
  expect(signup.error).not.toBeNull();
  expect(signup.data.user).toBeNull();
  await login(page, credentials.email, 'contraseña-ficticia-incorrecta');
  await expect(page.getByRole('alert')).toContainText(
    'Correo o contraseña incorrectos',
  );
  await login(
    page,
    credentials.unauthorizedEmail,
    credentials.unauthorizedPassword,
  );
  await expect(page.getByRole('alert')).toContainText('no está autorizada');
  await expect(page).toHaveURL(/\/admin\/login/);
});

test('ciclo completo con Auth, PostgreSQL y Storage reales', async ({
  page,
  browser,
}, info) => {
  const name = `Perfil ficticio Ámbar ${info.project.name} ${Date.now()}`;
  await login(page, credentials.email, credentials.password);
  await expect(page).toHaveURL(/\/admin\/beneficiarios$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('link', { name: 'Nuevo perfil', exact: true }).click();
  await expect(page.getByLabel('Código MG')).toHaveValue(/^MG-\d{3}$/);
  const fixtureClient = anonymous();
  const fixtureLogin = await fixtureClient.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  expect(fixtureLogin.error).toBeNull();
  const reserved = await fixtureClient
    .from('beneficiaries')
    .select('code')
    .gte('code', 'MG-800')
    .lte('code', 'MG-899');
  expect(reserved.error).toBeNull();
  const used = new Set(reserved.data.map((row) => row.code));
  const code = Array.from(
    { length: 100 },
    (_, index) => `MG-${800 + index}`,
  ).find((candidate) => !used.has(candidate));
  expect(
    code,
    'Debe quedar un código de prueba disponible en MG-800–MG-899',
  ).toBeTruthy();
  await fixtureClient.auth.signOut();
  await page.getByLabel('Código MG').fill(code);

  await page.getByRole('button', { name: 'Guardar borrador' }).click();
  await expect(page).toHaveURL(/\/editar$/);
  await page.reload();
  await page.getByLabel('Nombre completo').fill(name);
  await page.getByRole('button', { name: 'Guardar borrador' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'borrador quedó guardado',
  );
  await page.reload();
  await expect(page.getByLabel('Nombre completo')).toHaveValue(name);

  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await expect(
    page.getByText('Este campo es obligatorio para publicar.'),
  ).toBeVisible();
  const publicClient = anonymous();
  let result = await publicClient.rpc('get_public_beneficiary', {
    p_code: code,
  });
  expect(result.error).toBeNull();
  expect(result.data).toEqual([]);

  await page.getByLabel('Fecha de nacimiento').fill('2015-01-01');
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page.getByLabel('Grado escolar').first().fill('Grado ficticio');
  await page.getByLabel('Asignatura favorita').first().fill('Materia ficticia');
  await page.getByLabel('Pasatiempo').first().fill('Actividad ficticia');
  await page
    .getByLabel('Qué quiere ser o lograr')
    .first()
    .fill('Meta ficticia');
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await page
    .getByLabel('Relato público revisado')
    .fill(
      'Historia ficticia para validar el entorno local sin datos personales.',
    );
  await page
    .getByLabel('Notas privadas de importación')
    .fill('Nota privada ficticia de integración.');
  await page.getByRole('button', { name: 'Guardar borrador' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'borrador quedó guardado',
  );
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click();

  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#427662';
    ctx.fillRect(0, 0, 2400, 1800);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const photo = {
    name: 'ficticia.png',
    mimeType: 'image/png',
    buffer: Buffer.from(png, 'base64'),
  };
  await page.locator('input[type=file]').setInputFiles([
    photo,
    {
      name: 'tipo-no-admitido.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('ficticio'),
    },
  ]);
  await expect(page.getByText('Usa una imagen JPG, PNG o WebP.')).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Eliminar fotografía/ }),
  ).toHaveCount(1);
  await page.locator('input[type=file]').setInputFiles([photo, photo]);
  await expect(
    page.getByRole('button', { name: 'Límite de 3 alcanzado' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: /Eliminar fotografía/ }),
  ).toHaveCount(3);

  // Reemplazar la principal no debe producir dos fotografías principales.
  page.once('dialog', (dialog) => dialog.accept());
  await page
    .getByRole('button', { name: 'Eliminar fotografía 1', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /Eliminar fotografía/ }),
  ).toHaveCount(2);
  await page.locator('input[type=file]').setInputFiles(photo);
  await expect(
    page.getByRole('button', { name: 'Límite de 3 alcanzado' }),
  ).toBeDisabled();

  await page.getByRole('button', { name: 'Publicar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'historia quedó publicada',
  );
  result = await publicClient.rpc('get_public_beneficiary', { p_code: code });
  expect(result.error).toBeNull();
  const [publicRow] = result.data;
  expect(publicRow.age).toBe(new Date().getUTCFullYear() - 2015);
  expect(Object.keys(publicRow).sort()).toEqual(
    [
      'id',
      'code',
      'full_name',
      'age',
      'gender',
      'localizations',
      'images',
    ].sort(),
  );
  expect(publicRow.localizations.es.public_story).toContain(
    'Historia ficticia para validar',
  );
  expect(publicRow.images).toHaveLength(3);
  expect(publicRow.images.filter((image) => image.is_primary)).toHaveLength(1);
  for (const image of publicRow.images) {
    for (const path of [image.thumbnail_path, image.detail_path]) {
      expect(path).toMatch(/\.webp$/);
      const signed = await publicClient.storage
        .from('beneficiary-media')
        .createSignedUrl(path, 60);
      expect(signed.error).toBeNull();
      const response = await fetch(signed.data.signedUrl);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/webp');
    }
  }

  const visitorContext = await browser.newContext({
    viewport: page.viewportSize(),
  });
  const visitor = await visitorContext.newPage();
  await visitor.route('**/storage/v1/object/sign/**', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Fallo temporal ficticio' }),
    }),
  );
  await visitor.goto('http://127.0.0.1:5173/');
  await expect(visitor.getByRole('alert')).toContainText(
    'No fue posible cargar las fotografías',
  );
  await visitor.unroute('**/storage/v1/object/sign/**');
  await visitor.getByRole('button', { name: 'Reintentar' }).click();
  await visitor
    .getByLabel('Buscar por nombre')
    .fill(name.replace('Á', 'a').toUpperCase());
  await expect(visitor.getByText('1 historia encontrada')).toBeVisible();
  await visitor.getByRole('link', { name: 'Leer su historia' }).click();
  await expect(
    visitor.getByRole('heading', { name, exact: true }),
  ).toBeVisible();
  const gallery = visitor.getByRole('region', {
    name: `Galería de fotografías de ${name}`,
  });
  await expect(gallery.getByRole('img')).toHaveCount(3);
  for (const img of await gallery.getByRole('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (el) =>
            el.complete &&
            el.naturalWidth === 1600 &&
            el.naturalHeight === 1200,
        ),
      )
      .toBe(true);
  }
  const accessibility = await new AxeBuilder({ page: visitor })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);

  await page.getByRole('link', { name: 'Volver al listado' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page
    .getByRole('button', { name: `Archivar ${name}`, exact: true })
    .click();
  await expect(page.getByRole('row').filter({ hasText: name })).toContainText(
    'Archivado',
  );
  await visitor.reload();
  await expect(
    visitor.getByText('Esta historia no está disponible.'),
  ).toBeVisible();
  const denied = await publicClient.storage
    .from('beneficiary-media')
    .createSignedUrl(publicRow.images[0].detail_path, 60);
  expect(denied.error).not.toBeNull();
  await visitorContext.close();
  await page.getByRole('button', { name: 'Salir', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});
