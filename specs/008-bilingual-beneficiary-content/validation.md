# Validación: Contenido bilingüe de beneficiarios

Fecha: 2026-09-22

## Base de datos y privacidad

- La migración incremental se aplicó al stack local de Supabase sin reiniciar ni
  sustituir la base existente.
- `npm run db:test` pasó: 5 archivos pgTAP y 75 aserciones. Cubre RLS,
  privilegios, migración idempotente del español, publicación con inglés
  ausente, rechazo de una traducción inglesa parcial y el contrato RPC.
- Las RPC públicas devuelven solo perfiles publicados, localizaciones completas
  y textos alternativos por idioma. Las tablas de localización siguen sin
  acceso directo para `anon`.

## Interfaz y accesibilidad

- `npm test` pasó: 20 archivos y 48 pruebas unitarias/de componentes.
- `npm run test:e2e` pasó: 28 escenarios en Chromium móvil y escritorio. Incluye
  selector sin consulta adicional, estado de idioma no disponible, búsqueda,
  detalle, teclado, contraste WCAG A/AA y movimiento reducido.
- El catálogo se inspeccionó en el stack local de Podman: el encabezado, el
  selector de idioma, la búsqueda, las tarjetas responsivas y el footer se
  renderizan correctamente.
- `npm run test:local` pasó en móvil y escritorio, incluidos login
  administrativo, creación, fotografías, publicación y archivado con datos
  sintéticos.

## Calidad

- `npm run verify`, `npm run privacy:check` y `git diff --check` pasan antes
  del PR.
- Esta evidencia omite nombres, relatos, fechas, imágenes y credenciales reales.
