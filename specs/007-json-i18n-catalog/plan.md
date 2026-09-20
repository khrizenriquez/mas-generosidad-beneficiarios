# Implementation Plan: Catálogos JSON de idioma público

**Branch**: `feat/i18n-json-catalog` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-json-i18n-catalog/spec.md`

## Summary

Incorporar una capa propia de internacionalización para el catálogo público: dos
catálogos JSON estáticos (`es` y `en`), un proveedor React mínimo y un selector
de idioma en el encabezado público. La selección empieza en español, se conserva
solo en `localStorage` cuando sea posible y actualiza el atributo `lang` y el
título del documento. El contenido editorial procedente de Supabase conserva
exactamente sus valores; solo sus etiquetas de presentación se traducen.

El cambio no añade dependencias, servicios, tablas, migraciones, cookies ni
eventos analíticos. Las rutas administrativas y su interfaz siguen en español y
no reciben el selector.

## Technical Context

**Language/Version**: JavaScript ESM con React 19.3 sobre Node.js 24 LTS.

**Primary Dependencies**: React Context, React Router 7, Material UI Community,
TanStack Query 5, Vitest, Testing Library y Playwright ya existentes. No se
añade una biblioteca de i18n.

**Storage**: `localStorage` de navegador para una única preferencia `es` o `en`;
Supabase PostgreSQL y Storage permanecen sin cambios. La preferencia no contiene
identificadores, contenido editorial ni datos de visitantes.

**Testing**: Vitest + Testing Library para catálogos, interpolación,
pluralización, fallback, persistencia y componentes públicos; Playwright móvil y
escritorio para selector, navegación, contenido remoto inalterado y exclusión
del admin.

**Target Platform**: Navegadores móviles y de escritorio modernos; SPA Vite
estática en Vercel Hobby y ejecución local por Vite/Podman.

**Project Type**: Aplicación web de una sola página con catálogo público y editor
administrativo.

**Performance Goals**: El cambio de idioma actualiza la vista sin recarga ni
petición de red adicional. Ambos catálogos permanecen pequeños y disponibles en
el build inicial para no bloquear textos, estados ni accesibilidad.

**Constraints**: $0, JavaScript sin TypeScript, sin dependencia i18n, sin
detectar idioma de navegador, español inicial fijo, selector solo público,
contenido de BD literal, compatibilidad WCAG AA y ninguna exposición adicional
de datos reales.

**Scale/Scope**: Dos catálogos, tres rutas públicas y sus componentes de apoyo;
un proveedor global que no cambia el área administrativa.

## Constitution Check

| Principio                            | Evaluación                                                                                           | Resultado |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------- |
| Privacidad antes que conveniencia    | No se transportan datos editoriales a catálogos ni se registra una preferencia fuera del navegador.  | PASS      |
| Publicación deliberada               | El selector no modifica perfiles, estados ni flujos de publicación.                                  | PASS      |
| Seguridad por capas                  | No cambia RLS, Auth, RPCs, bucket ni URLs firmadas.                                                  | PASS      |
| Presupuesto cero y portabilidad      | Solo usa APIs estándar del navegador y JSON del repositorio; no añade un servicio ni dependencia.    | PASS      |
| Calidad verificable                  | Incluye pruebas unitarias, e2e móvil/escritorio y los comandos del harness existentes.               | PASS      |
| Accesibilidad y dignidad             | El selector es operable por teclado; se preserva literalmente el contenido aprobado de cada persona. | PASS      |
| Integración mediante revisión humana | Se desarrolla en una rama corta y se entregará como un PR a `main`, sin auto-merge.                  | PASS      |

**Revisión posterior al diseño**: PASS. No hay excepciones constitucionales ni
complejidad adicional que justificar.

## Project Structure

### Documentation (this feature)

```text
specs/007-json-i18n-catalog/
├── checklists/
│   └── requirements.md
├── contracts/
│   └── public-localization.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── AppProviders.jsx              # monta I18nProvider junto a providers existentes
├── components/
│   ├── BrandMark.jsx                  # recibe nombre de marca desde catálogo
│   ├── layout/
│   │   └── PublicLayout.jsx            # selector, header y footer públicos
│   └── story/                          # tarjetas, galería y estados localizados
├── data/
│   └── demoBeneficiaries.js            # consume contenido demo por catálogo
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   └── es.json
│   ├── catalog.js                      # catálogos, claves, fallback e interpolación
│   ├── I18nProvider.jsx                # estado, preferencia segura y html lang
│   └── useI18n.js                      # contrato para componentes públicos
├── pages/
│   ├── HomePage.jsx
│   ├── NotFoundPage.jsx
│   └── StoryPage.jsx
├── services/
│   └── publicBeneficiaries.js          # códigos de fallo, no frases visibles
└── utils/
    └── normalize.js                    # búsqueda sin idioma codificado

e2e/
└── public-stories.spec.js              # catálogo bilingüe móvil y escritorio
```

**Structure Decision**: Se añade un módulo `src/i18n/` aislado. Ningún servicio
de Supabase, componente administrativo ni formulario necesita conocer el idioma
elegido. Los componentes públicos consumen el hook y los catálogos; los valores
editoriales se interpolan como datos sin ser transformados.

## Complexity Tracking

No hay violaciones constitucionales que requieran justificación.
