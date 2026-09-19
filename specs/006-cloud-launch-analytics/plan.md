# Implementation Plan: Lanzamiento cloud y analítica anónima

**Branch**: `feat/cloud-launch-analytics` | **Date**: 2026-09-18 | **Spec**: [spec.md](spec.md)

**Input**: Publicar la SPA desde `main`, habilitar únicamente analítica anónima y cargar el Word privado como 41 borradores revisables.

## Summary

Añadir el cliente oficial de analítica de Vercel a la SPA React sin eventos personalizados; conservar el despliegue estático, las reescrituras SPA y las cabeceras de privacidad existentes. Cargar Roboto desde Google Fonts para la interfaz pública y reforzar el footer móvil con el crédito aprobado. Documentar y comprobar el lanzamiento Git-to-Vercel, la configuración pública mínima, Auth sin registro público, la importación local idempotente de 41 borradores y la validación remota. No se modifica el esquema de Supabase, no se crea telemetría propia y no se versiona ni se carga un secreto a Vercel.

## Technical Context

**Language/Version**: JavaScript ESM, Node 24 LTS; React 19.3 y Vite 8.3.

**Primary Dependencies**: Material UI Community, React Router 7, TanStack Query 5, React Hook Form 7, Zod 4, Supabase JS 2 y `@vercel/analytics` 2.0.1 fijado en el lockfile; Roboto se carga desde el CSS oficial de Google Fonts sin una dependencia npm adicional.

**Storage**: Supabase PostgreSQL y bucket privado ya migrados; no hay tabla, cookie ni almacén adicional para analítica.

**Testing**: Vitest + Testing Library, Playwright móvil/escritorio y Podman/Supabase local para políticas; pruebas manuales de humo contra producción tras configuración externa.

**Target Platform**: Navegadores móviles y de escritorio; SPA estática Vite servida por Vercel Hobby; Supabase Free.

**Project Type**: Aplicación web de una sola página con servicio de datos y autenticación gestionados.

**Performance Goals**: La integración de analítica no bloquea el primer contenido ni la navegación; las conexiones previas de Roboto se declaran en el documento y la portada, footer y rutas profundas cargan sin error en móvil y escritorio.

**Constraints**: Solo niveles gratuitos; JavaScript sin TypeScript; dos valores públicos de Supabase en Vercel; sin service role, contraseña, ID remoto, Word, fotos originales ni datos reales en Git, logs o bundle; sin eventos personalizados ni perfiles de visitantes.

**Scale/Scope**: Un catálogo en español, 41 borradores iniciales, dos administradores ya autorizados, una URL de producción temporal y una única entrega vía Pull Request.

## Constitution Check

| Principio                         | Evaluación                                                                                                      | Resultado |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------- |
| Privacidad antes que conveniencia | No se añade analítica propia, no se exportan datos reales y la prueba remota comprueba fronteras públicas.      | PASS      |
| Publicación deliberada            | La importación crea 41 borradores y no publica ningún perfil.                                                   | PASS      |
| Seguridad por capas               | RLS, bucket privado, URLs firmadas, Auth y allowlist se preservan; registro público se desactiva en la consola. | PASS      |
| Presupuesto cero y portabilidad   | Vercel Hobby, Supabase Free y dependencia oficial sin servicios adicionales ni bloqueo de datos.                | PASS      |
| Calidad verificable               | Se amplían pruebas unitarias/E2E y se ejecutan harness local, contrato DB y humo de producción.                 | PASS      |
| Accesibilidad y dignidad          | Analítica no altera el flujo ni envía búsquedas, credenciales o contenido sensible.                             | PASS      |
| Integración con revisión humana   | Solo una rama y un PR hacia `main`; no hay push directo ni auto-merge.                                          | PASS      |

**Revisión posterior al diseño**: PASS. No se requieren excepciones ni seguimiento de complejidad.

## Project Structure

### Documentation (this feature)

```text
specs/006-cloud-launch-analytics/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/
│   └── production-launch.md
├── quickstart.md
├── tasks.md
└── validation.md
```

### Source Code (repository root)

```text
src/
├── main.jsx                         # punto de montaje y analítica anónima
├── App.jsx                          # rutas públicas y administrativas
├── config/env.js                    # contrato de variables públicas
├── auth/                            # sesión y guardia de allowlist
├── components/                      # UI pública y administrativa
├── pages/                           # portada, historias y administración
└── services/                        # lecturas públicas y operaciones admin

e2e/
├── public-stories.spec.js            # navegación y privacidad pública
└── admin-*.spec.js                   # flujos administrativos visibles

scripts/
├── import-beneficiaries.mjs          # carga local idempotente del Word
├── check-no-private-data.mjs         # auditoría de privacidad
└── check-env.mjs                     # validación de entorno

supabase/migrations/                 # esquema y RLS ya aplicados
vercel.json                          # reescrituras SPA y cabeceras
README.md                            # runbook local y límites de nube
```

**Structure Decision**: Se conserva la SPA existente. La analítica se monta una sola vez junto a la raíz React para no contaminar rutas, formularios o servicios con telemetría.

## Complexity Tracking

No hay violaciones a la constitución que requieran justificación.
