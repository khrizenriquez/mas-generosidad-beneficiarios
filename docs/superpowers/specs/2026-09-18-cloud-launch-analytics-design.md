# Lanzamiento cloud y analítica anónima

## Decisión aprobada

El MVP se publicará desde `main` mediante el proyecto ya creado en Vercel. Vercel será el único proveedor de analítica: medirá tráfico agregado y anónimo sin crear perfiles de visitantes, cookies de seguimiento ni tablas de telemetría en Supabase.

La información de los beneficiarios permanece en Supabase. La importación del documento privado cargará exactamente 41 perfiles como borradores; no transportará fotografías de demostración ni fechas ficticias. La ONG revisará datos, consentimiento, fotos y fechas reales antes de cualquier publicación individual.

## Flujo de publicación

1. Un Pull Request entrega el cambio de analítica, documentación y validaciones a `main`.
2. Vercel construye y publica la SPA desde `main`; las ramas solo producen vistas previas.
3. Vercel recibe solo la URL pública y clave publicable de Supabase, además de la desactivación explícita de datos demo. Ningún secreto del servidor, contraseña o dato personal se configura allí.
4. En Supabase se mantiene deshabilitado el registro público y se conserva la allowlist explícita de administradores.
5. Desde una terminal local controlada, se importa el documento privado usando un secreto de servidor transitorio que nunca se versiona ni se entrega al navegador.
6. Se ejecutan pruebas locales, de autorización y de navegador; finalmente se comprueba el sitio publicado sin exponer nacimientos, borradores, archivados ni fotografías privadas.

## Límites

- No hay eventos personalizados, identificadores persistentes, cookies, analítica de búsqueda ni datos personales de visitantes.
- No se publican automáticamente los perfiles importados.
- Las fotografías reales se suben después desde el área administrativa; los originales no se almacenan.
- El despliegue no modifica `main` directamente, no crea auto-merge y no incluye secretos en Git.

## Operación posterior

La ONG consulta métricas agregadas en Vercel y administra los perfiles en `/admin`. El respaldo manual cifrado y la reactivación de Supabase siguen el runbook privado ya existente.
