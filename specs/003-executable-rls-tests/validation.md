# Evidencia de validación local

Fecha: 2026-09-18. Rama: `fix/local-mvp`. Datos de prueba exclusivamente ficticios.

## Entorno probado

- macOS ARM64, Podman 5.5.0 con máquina activa.
- Node 24.19.0, Supabase CLI 2.117.0, PostgreSQL 17.
- Frontend construido en Node y servido por Nginx 1.30.5 dentro de Podman.
- Auth, REST, PostgreSQL y Storage locales; ninguna conexión a un proyecto cloud.
- Aplicación en `http://127.0.0.1:5173`, API en `http://127.0.0.1:54321`.

## Resultados

| Requisito                               | Evidencia                                                                                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Harness, privacidad y contexto Spec Kit | `npm run verify`: formato, lint, 15 unitarias, build, contexto, política Git, privacidad y contrato estático                                                                                               |
| Roles, RLS, columnas públicas y estados | `npm run db:test`: 51 aserciones pgTAP, tres suites, PASS sobre Podman                                                                                                                                     |
| Login y administración móvil/escritorio | `npm run test:local`: cuatro escenarios integrales, PASS; contraseñas incorrectas, registro deshabilitado, allowlist, login por teclado, creación y edición de borrador, publicación y archivado           |
| Fotografías                             | Integración local con subida real: conversión de PNG 2400×1800 a WebP de detalle 1600×1200, tres imágenes, reemplazo de principal y recuperación tras carga parcial; URLs firmadas devuelven archivos WebP |
| Privacidad pública y retiro             | Las respuestas contienen exactamente once campos aprobados y edad calculada; después de archivar, la historia desaparece y nuevas firmas son rechazadas                                                    |
| Búsqueda y fallos de red                | Búsqueda ignora mayúsculas/acentos; fallo simulado de firma muestra error y el reintento vuelve a usar Storage local real                                                                                  |
| UI pública y accesibilidad              | `npm run test:e2e`: doce escenarios demo en móvil/escritorio; estados vacíos, ausencia de foto, galería, enlaces, noindex y Axe WCAG A/AA. La integración real también pasa Axe en el detalle              |
| Importación                             | Dry-run del Word: 41 códigos únicos MG-001–MG-041, MG042 excluido, 39 fechas completas pendientes; pruebas sintéticas del parser. No se importaron datos reales al entorno de pruebas                      |
| Backup                                  | `npm run test:backup`: filas y fotos verificadas después de descifrar; contraseña errónea rechazada. Solo se elimina su archivo temporal de prueba                                                         |
| Persistencia                            | `npm run test:persistence`: detener/arrancar conserva exactamente filas y hashes de fotografías; `/admin/login` vuelve a responder 200 con `X-Robots-Tag`                                                  |

## Correcciones incluidas

- Las políticas Storage usan una función booleana con privilegios controlados; las tablas base siguen cerradas al público.
- Se revoca explícitamente DELETE sobre beneficiarios al rol autenticado.
- El formulario convierte los nulos de la base en campos vacíos y conserva cambios sin guardar al refrescar fotos.
- El login realiza una sola redirección y presenta errores de autenticación en español.
- Reemplazar la foto principal mantiene una única principal; los fallos parciales refrescan las imágenes guardadas.
- Publicar/archivar invalida las consultas correspondientes; el importador repetido conserva registros existentes.
- El encabezado administrativo se adapta al móvil y se retira el desplazamiento animado global que interfería con botones al desplazarse.

## Cierre pendiente

- Verificar los checks del PR consolidado en GitHub Actions, incluido el job Podman Linux.
- Revisión y fusión exclusivamente por el propietario. El despliegue y la validación cloud pertenecen a otro PR.

Esta evidencia cubre los escenarios enumerados; no afirma ausencia absoluta de errores ni certificación formal de accesibilidad.
