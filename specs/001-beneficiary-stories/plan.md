# Plan técnico

## Contexto

React 19 SPA en JavaScript, Vite 8 y MUI Community. Vercel sirve el bundle estático. Supabase aporta Auth, PostgreSQL y Storage privado; el navegador accede con la anon key y RLS es la frontera de seguridad.

## Arquitectura

- `src/pages` separa rutas públicas y administrativas; las rutas administrativas se cargan de forma diferida.
- TanStack Query controla estado remoto y reintentos; React Hook Form + Zod validan edición.
- Las RPC `get_public_beneficiaries` y `get_public_beneficiary` son la única proyección anónima de perfiles.
- Los administradores trabajan sobre tablas con RLS y una allowlist explícita en `admin_users`.
- Storage conserva dos WebP por fotografía y entrega URLs firmadas de una hora.
- El importador lee el DOCX ignorado, normaliza etiquetas y hace upsert directo sin archivos intermedios.
- El backup comprime, cifra con AES-256-GCM y escribe únicamente en `backups/`, ignorado.

## Modelo de datos

- `beneficiaries`: identidad opaca UUID, código único, datos privados/públicos, estado y auditoría.
- `beneficiary_images`: rutas privada/detalle, orden, principal y FK indexada.
- `admin_users`: allowlist vinculada a `auth.users`.

## Riesgos y mitigaciones

- Pausa del nivel gratuito: procedimiento de reactivación y backup manual documentados.
- Filtración de fecha: RPC con columnas explícitas, privilegios revocados y prueba contractual.
- Exceso de fotos: UI, `sort_order` y trigger en base.
- Contexto contradictorio entre agentes: archivo canónico, sincronizador y chequeo CI.
- Copilot no multi-install-safe declarado: integración por skill aislada, revisión de archivos y chequeo de solapamiento.
