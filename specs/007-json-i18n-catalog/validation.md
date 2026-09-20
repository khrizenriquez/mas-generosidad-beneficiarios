# Validación: catálogos JSON de idioma público

**Fecha:** 2026-09-20

## Resultado agregado

- `npm run verify`: correcto. Incluye formato, ESLint, 38 pruebas unitarias,
  build, auditoría de privacidad y contrato SQL estático.
- `npm run test:e2e`: correcto en Chromium móvil y escritorio (26 pruebas),
  incluido cambio a inglés, persistencia, accesibilidad y ausencia del selector
  en administración.
- Inspección local: correcta en `http://127.0.0.1:5173` después de reconstruir
  exclusivamente el contenedor frontend de Podman. El selector aparece en el
  encabezado público sin tocar la base de datos, Auth ni Storage.

No se usaron secretos, archivos privados ni datos de perfiles en esta
validación. Los contenidos que aparecen localmente provienen del entorno que ya
existía antes de este cambio y no se registran en este documento.
