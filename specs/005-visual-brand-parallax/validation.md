# Validación: identidad visual y parallax público

Fecha: 2026-09-18

## Resultado

- `npm run verify` pasó con Node 24.19.0: 17 pruebas unitarias, lint, build, contrato de base de datos, contexto de agentes, política de contribución y revisión de privacidad.
- `npm run test:e2e` pasó: 22 pruebas en Chromium móvil y escritorio, incluyendo zoom de imagen al 120%, foco de teclado, movimiento reducido, placeholder, footer y Axe WCAG A/AA.
- `npm run local:start` y `npm run test:local` pasaron en Podman: 4 flujos de autenticación, PostgreSQL y Storage local en móvil y escritorio.

## Privacidad

No se almacenan capturas, nombres, fotografías, rutas de importación ni otros datos locales en este documento ni en Git. La verificación visual local se realizó únicamente sobre la instancia del usuario.
