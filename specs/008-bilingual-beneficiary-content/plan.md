# Implementation Plan: Contenido bilingüe de beneficiarios

**Branch**: `feat/bilingual-beneficiary-content` | **Date**: 2026-09-22 | **Spec**: [spec.md](spec.md)

## Summary

Crear localizaciones normalizadas para el contenido editorial de perfiles e
imágenes, migrar el español existente de forma incremental y hacer que las RPC
públicas devuelvan las versiones autorizadas `es` y `en` en una sola respuesta.
El formulario administrativo seguirá en español y editará ambos idiomas. El
catálogo seleccionará de TanStack Query la versión ya cargada; una versión
ausente tendrá su propio estado localizado, sin _fallback_ editorial.

## Technical Context

**Language/Version**: JavaScript ESM, SQL PostgreSQL 17 y Node.js 24 LTS

**Primary Dependencies**: React 19, MUI Community, React Hook Form 7, Zod 4,
TanStack Query 5, Supabase JS 2, pgTAP y Playwright

**Storage**: PostgreSQL y bucket privado de Supabase; WebP existente sin
cambios de archivo

**Testing**: Vitest/Testing Library, pgTAP en Supabase local, Playwright móvil
y escritorio, `npm run verify`

**Target Platform**: Podman local y Vercel/Supabase ya configurados

**Performance Goals**: Una solicitud de listado o detalle entrega ambas
localizaciones autorizadas; alternar idioma no genera una solicitud adicional
durante la vida de esa caché de TanStack Query.

**Constraints**: $0, JavaScript sin TypeScript, datos reales fuera de Git,
fecha de nacimiento privada, no cambiar datos remotos durante pruebas.

**Scale/Scope**: Dos idiomas iniciales, hasta 41 perfiles actuales y tres
fotos por perfil; sin traducción automática ni nuevos idiomas en UI.

## Constitution Check

_Gate: Passed before research and re-checked after design._

- **I. Privacidad**: PASS. La tabla y sus privilegios son privados; las RPC
  públicas devuelven solo localizaciones de perfiles `published`. Se incluyen
  pruebas negativas de datos privados y acceso directo.
- **II. Publicación deliberada**: PASS. Español completo sigue siendo mínimo
  indispensable; inglés parcial se rechaza y su ausencia es explícita.
- **III. Seguridad por capas**: PASS. RLS/privilegios se extienden a las dos
  tablas nuevas y no se agrega una política pública a tablas base.
- **IV. Presupuesto cero y portabilidad**: PASS. Solo SQL, React y
  dependencias existentes.
- **V. Calidad verificable**: PASS. Incluye pgTAP, pruebas unitarias, E2E y
  Podman. El cambio de datos ejecutará `npm run db:test`.
- **VI. Accesibilidad y dignidad**: PASS. Estado explícito, localizado y
  respetuoso sin reutilizar un relato en el idioma erróneo.
- **VII. Revisión humana**: PASS. Rama corta, PR único hacia `main`, sin
  auto-merge ni coautoría.

## Project Structure

### Documentation

```text
specs/008-bilingual-beneficiary-content/
├── checklists/requirements.md
├── contracts/public-localizations.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

### Source Code

```text
supabase/
├── migrations/
│   └── 202609220001_bilingual_beneficiary_content.sql
└── tests/
    ├── 001_privacy_contract.sql
    ├── 002_public_privacy_behavior.sql
    └── 005_bilingual_localizations_contract.sql
src/
├── components/admin/PhotoManager.jsx
├── components/story/
│   ├── StoryAvailabilityNotice.jsx
│   ├── StoryCard.jsx
│   └── StoryGallery.jsx
├── forms/beneficiarySchema.js
├── pages/admin/BeneficiaryFormPage.jsx
├── pages/HomePage.jsx
├── pages/StoryPage.jsx
└── services/
    ├── adminBeneficiaries.js
    └── publicBeneficiaries.js
```

## Implementation Phases

1. **Contrato y migración (0.5–1 día).** Crear las tablas de localización,
   migrar los campos españoles existentes de forma idempotente, extender la
   validación de publicación, RLS y RPCs. Añadir pgTAP.
2. **Administración (0.5 día).** Actualizar schema, servicio y formulario para
   editar los dos grupos editoriales y textos alternativos por idioma.
3. **Catálogo y caché (0.5 día).** Adaptar adaptadores públicos y componentes
   para seleccionar localizaciones desde un único resultado en memoria y
   renderizar la indisponibilidad.
4. **Verificación y entrega (0.5–1 día).** Pruebas unitarias, E2E, contrato
   SQL, Podman, documentación y PR.

## Complexity Tracking

No hay excepciones constitucionales. Dos tablas nuevas evitan un objeto JSON
sin validación y no cambian el modelo de fotos ni de acceso público.
