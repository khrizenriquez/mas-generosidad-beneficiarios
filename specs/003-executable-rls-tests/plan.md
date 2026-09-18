# Implementation Plan: Contrato RLS ejecutable

**Branch**: `test/executable-rls-contract` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-executable-rls-tests/spec.md`

## Summary

Sustituir la confianza en búsquedas de texto SQL por un contrato pgTAP que aplica las migraciones a una base Supabase local, simula los roles `anon` y `authenticated`, y prueba privacidad, allowlist, publicación y límite de fotografías. Una migración incremental revoca el borrado definitivo y encapsula la autorización de fotografías en una función `security definer`, evitando conceder lectura anónima a tablas privadas. GitHub Actions levantará una base desechable en cada Pull Request con Supabase CLI 2.117.0; no usará secretos ni conectará un proyecto remoto. El chequeo estático actual se conservará como `npm run db:contract` para retroalimentación rápida.

## Technical Context

**Language/Version**: SQL PostgreSQL 17 y JavaScript ESM sobre Node.js 24 LTS

**Primary Dependencies**: pgTAP incluido por Supabase local; Supabase CLI 2.117.0; `supabase/setup-cli` v3.0.0 fijado por SHA en CI

**Storage**: PostgreSQL local desechable y esquema Storage local; sin acceso a Supabase remoto

**Testing**: `supabase test db`, pgTAP, chequeo estático Node y GitHub Actions

**Target Platform**: GitHub-hosted Ubuntu runner con Docker; desarrollo local con motor compatible

**Project Type**: Aplicación web con contrato de base de datos reproducible

**Performance Goals**: Fallar antes de integrar un PR y completar el job dentro del tiempo normal gratuito de GitHub Actions

**Constraints**: $0, datos ficticios, cero secretos remotos, rollback total y una sola fuente de esquema en migraciones

**Scale/Scope**: Tres tablas de aplicación, dos RPC públicas, tres roles de acceso, tres estados de perfil y políticas del bucket privado

## Constitution Check

_GATE: Passed before research and re-checked after design._

- **I. Privacidad**: PASS. Los fixtures son sintéticos y el contrato incluye pruebas negativas de columnas, estados y acceso a tablas.
- **II. Publicación deliberada**: PASS. Se ejercita el rechazo de un perfil incompleto y la publicación explícita válida.
- **III. Seguridad por capas**: PASS. Las pruebas se ejecutan en PostgreSQL bajo los roles reales, no a través de la interfaz.
- **IV. Presupuesto cero y portabilidad**: PASS. pgTAP, Docker, Supabase CLI y GitHub Actions no agregan un servicio pagado ni formato propietario.
- **V. Calidad verificable**: PASS. `db:contract` mantiene el chequeo rápido y `db:test` ejecuta el contrato real.
- **VI. Accesibilidad y dignidad**: PASS. No hay cambio visual; los fixtures no describen personas reales.
- **VII. Revisión humana**: PASS. El cambio vive en una rama corta y se entregará mediante PR sin auto-merge ni coautoría.

## Project Structure

### Documentation (this feature)

```text
specs/003-executable-rls-tests/
├── checklists/requirements.md
├── contracts/database-security.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
.github/workflows/ci.yml
package.json
README.md
scripts/db-test.mjs
supabase/
├── config.toml
├── migrations/
│   └── 202609150001_harden_media_access.sql
└── tests/
    ├── 001_privacy_contract.sql
    ├── 002_public_privacy_behavior.sql
    └── 003_admin_authorization_behavior.sql
```

**Structure Decision**: Conservar la estructura Supabase existente. La migración incremental modifica privilegios y políticas sin reescribir la migración aplicada. Los nuevos archivos separan las pruebas de comportamiento con fixtures y roles de las aserciones estructurales actuales. Los scripts y CI solo orquestan esas pruebas; nunca duplican el esquema.

## Complexity Tracking

No hay violaciones constitucionales ni excepciones de complejidad.
