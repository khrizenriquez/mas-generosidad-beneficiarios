# Validation: Manual local y guía privada de nube

**Fecha**: 2026-09-18
**Runtime validado**: Node.js 24.19.0, npm 10.5.1 y Podman 5.5.0 con `podman-machine-default` activa.

## Resultado

| Comando                    | Resultado | Evidencia                                                                                                           |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                   | PASS      | 343 paquetes instalados; 0 vulnerabilidades reportadas.                                                             |
| `npm run local:start`      | PASS      | PostgreSQL, Auth, REST, Storage y frontend de Podman disponibles en `http://127.0.0.1:5173`.                        |
| `npm run verify`           | PASS      | Formato, ESLint, 17 pruebas unitarias, build Vite, contexto, contribución, privacidad y contrato SQL estático.      |
| `npm run db:test`          | PASS      | 3 archivos y 51 pruebas ejecutables de migraciones, RLS, proyección pública, autorización y Storage.                |
| `npm run test:local`       | PASS      | 4 flujos Playwright móvil/escritorio contra Auth, PostgreSQL y Storage locales reales.                              |
| `npm run test:e2e`         | PASS      | 12 escenarios móvil/escritorio, incluida búsqueda, galería, noindex, ausencia de registro público y WCAG A/AA.      |
| `npm run test:backup`      | PASS      | Backup cifrado, descifrado y fotografía WebP ficticia; el archivo temporal se retiró.                               |
| `npm run test:persistence` | PASS      | Tras detener y arrancar el proyecto, datos y fotografías permanecieron idénticos y las rutas siguieron disponibles. |

## Nota de entorno

La shell predeterminada resolvía inicialmente Node 22.0.0 por NVM, aunque el proyecto exige Node 24. La causa se confirmó con `command -v node`; no se cambió el proyecto. Toda la ejecución final usó el runtime Node 24.19.0 antepuesto en `PATH`, que satisfizo `engines` y terminó sin advertencias de incompatibilidad.

## Revisión de alcance y privacidad

- El cambio no modifica `supabase/migrations/`, políticas RLS, `vercel.json`, contenedores ni proveedores remotos.
- La guía de nube existe en `../GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md`, fuera del directorio Git, y no se agrega al PR.
- La guía enumera únicamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables de Vercel; prohíbe la clave de servicio en Vite/Vercel.
- La comprobación de privacidad del repositorio pasa y no se usaron datos del Word, imágenes reales, secretos o IDs remotos.
