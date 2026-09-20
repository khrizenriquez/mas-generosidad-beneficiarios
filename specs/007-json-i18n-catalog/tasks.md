# Tasks: Catálogos JSON de idioma público

**Input**: Design documents from `/specs/007-json-i18n-catalog/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/public-localization.md` y `quickstart.md`.

**Tests**: Se agregan pruebas unitarias para los catálogos y el proveedor, y
pruebas Playwright móvil/escritorio del selector, idioma, accesibilidad y
contenido editorial literal.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establecer una fuente única de mensajes públicos y una forma de
probarla sin añadir dependencia ni cambiar el admin.

- [x] T001 [P] Crear `src/i18n/locales/es.json` y `src/i18n/locales/en.json` con el mismo árbol de claves para marca, layout, selector, portada, detalle, galería, estados, errores, a11y, etiquetas de dominio y perfiles demo ficticios.
- [x] T002 [P] Crear `src/i18n/catalog.test.js` para comprobar catálogos `es`/`en`, claves simétricas, fallback español, interpolación segura y pluralización de conteos/edad.
- [x] T003 [P] Añadir fixtures sintéticos bilingües para pruebas de interfaz en `src/i18n/testFixtures.js`, sin nombres, historias ni fotos reales.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Crear el contrato propio de idioma antes de migrar cualquier texto
de la interfaz pública.

**⚠️ CRITICAL**: Ninguna ruta pública consume textos localizados hasta completar
esta fase.

- [x] T004 Implementar búsqueda de claves, fallback español, interpolación nombrada, pluralización `Intl.PluralRules`, formato de edad y etiqueta de género en `src/i18n/catalog.js`; nunca transformar el valor editorial recibido.
- [x] T005 Crear `src/i18n/I18nProvider.jsx` y su prueba `src/i18n/I18nProvider.test.jsx` para iniciar siempre en `es`, tolerar lectura/escritura bloqueada de `localStorage`, persistir únicamente `es`/`en` tras selección explícita y actualizar `document.documentElement.lang` y el título.
- [x] T006 Crear `src/i18n/useI18n.js` para exponer `t`, pluralización, idioma actual y cambio validado; fallar claramente en desarrollo si se usa fuera del proveedor.
- [x] T007 Integrar `I18nProvider` en `src/app/AppProviders.jsx` sin cambiar Auth, TanStack Query, analítica ni rutas administrativas.
- [x] T008 Ajustar `src/utils/normalize.js` y `src/utils/normalize.test.js` para mantener búsqueda por mayúsculas, espacios y acentos sin una configuración española codificada.

**Checkpoint**: La app puede suministrar mensajes de ambos catálogos, mantiene
español como valor inicial y no cambia la base de datos ni el admin.

---

## Phase 3: User Story 1 - Elegir el idioma del catálogo (Priority: P1) 🎯 MVP

**Goal**: Una persona visitante cambia el idioma del catálogo desde el header y
continúa la navegación pública sin recarga.

**Independent Test**: Abrir portada en español, elegir English con teclado,
navegar a una historia, recargar y comprobar idioma persistido; verificar ambos
viewports en Playwright.

### Tests for User Story 1

- [x] T009 [P] [US1] Crear `src/components/layout/LanguageSelector.test.jsx` para idioma actual, teclado, cambio de idioma, foco visible y alternativa de almacenamiento bloqueado.
- [x] T010 [P] [US1] Ampliar `e2e/public-stories.spec.js` con español inicial, cambio a inglés sin recarga, persistencia, `html[lang]`, título actualizado y selector visible en móvil/escritorio.

### Implementation for User Story 1

- [x] T011 [US1] Crear `src/components/layout/LanguageSelector.jsx` con control MUI accesible, nombres completos para lectores de pantalla y presentación móvil sin overflow.
- [x] T012 [US1] Actualizar `src/components/layout/PublicLayout.jsx` y `src/components/BrandMark.jsx` para consumir mensajes del catálogo en header, selector, footer y marca, conservando URLs, logo y rutas existentes.
- [x] T013 [P] [US1] Actualizar `src/pages/HomePage.jsx` para traducir introducción, búsqueda, conteo, carga, estado vacío, recuperación y atributos accesibles mediante `useI18n`.
- [x] T014 [P] [US1] Actualizar `src/pages/NotFoundPage.jsx` para que todos sus textos públicos y navegación vengan de los catálogos.
- [x] T015 [P] [US1] Actualizar `src/components/story/StoryImagePlaceholder.jsx` y `src/components/story/StoryGallery.jsx` para localizar estados de imagen, fallback y etiquetas ARIA sin modificar `alt_text` editorial.

**Checkpoint**: El catálogo público puede cambiar entre español e inglés desde el
header, con navegación, pie, errores y estados básicos localizados.

---

## Phase 4: User Story 2 - Leer contenido editorial sin alterarlo (Priority: P1)

**Goal**: La traducción de interfaz no altera el contenido aprobado que llega de
Supabase ni sus valores de dominio.

**Independent Test**: Con un perfil sintético de servicio, capturar los campos
editoriales en ambos idiomas y probar que son idénticos mientras edad y género
usan etiquetas del catálogo.

### Tests for User Story 2

- [x] T016 [P] [US2] Ampliar `src/components/story/StoryGallery.test.jsx` con nombres y `alt_text` sintéticos que permanezcan literales tras cambiar idioma, junto con fallback localizado.
- [x] T017 [P] [US2] Crear `src/components/story/StoryCard.test.jsx` y `src/pages/StoryPage.test.jsx` para edad, género, campos editoriales literales y etiquetas traducidas.

### Implementation for User Story 2

- [x] T018 [P] [US2] Actualizar `src/components/story/StoryCard.jsx` para usar edad, etiquetas y accesibilidad localizadas, preservando `full_name`, imagen y texto alternativo del perfil como valores literales.
- [x] T019 [US2] Actualizar `src/pages/StoryPage.jsx` para localizar navegación, errores, aspiración, historia, hechos, edad y género; conservar sin transformación nombre, relato, grado, intereses y aspiración remotos.
- [x] T020 [US2] Ajustar `src/services/publicBeneficiaries.js` para producir códigos de fallo públicos estables y actualizar las vistas públicas para traducirlos con acción de recuperación, sin cambiar RPCs, datos ni políticas.

**Checkpoint**: Las dos versiones del catálogo respetan el contenido editorial
remoto y solo traducen su envoltura de interfaz.

---

## Phase 5: User Story 3 - Mantener una interfaz pública completa y accesible (Priority: P2)

**Goal**: Todo texto público controlado por la app tiene un hogar revisable en
JSON, incluyendo demo y estados poco frecuentes; el admin conserva su español.

**Independent Test**: Probar datos demo, estados de red y galería sin foto en
ambos idiomas; comprobar que `/admin/*` no muestra selector ni cambia sus
textos.

### Tests for User Story 3

- [x] T021 [P] [US3] Actualizar pruebas de `src/data/demoBeneficiaries.js` o crear `src/data/demoBeneficiaries.test.js` para verificar perfiles ficticios por idioma y ausencia de datos personales reales.
- [x] T022 [P] [US3] Extender `e2e/public-stories.spec.js` para estados demo, imagen ausente, error reintentable y ausencia de selector en `/admin/login`.

### Implementation for User Story 3

- [x] T023 [US3] Reestructurar `src/data/demoBeneficiaries.js` para obtener contenido ficticio del catálogo elegido, manteniendo códigos y recursos visuales no personales fuera de los mensajes.
- [x] T024 [US3] Revisar `src/App.jsx`, páginas y componentes públicos para migrar los textos restantes, `aria-label`, títulos y mensajes de recuperación a `src/i18n/locales/*.json`, sin mover texto administrativo a este alcance.
- [x] T025 [US3] Actualizar documentación de uso y mantenimiento de idiomas en `README.md`, incluyendo cómo añadir un catálogo, revisar claves, preservar contenido editorial y ejecutar validaciones sin secretos.

**Checkpoint**: El catálogo público no deja frases controladas por código fuera de
los JSON, mientras la administración sigue estable en español.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Revisar completitud, accesibilidad, privacidad y entrega revisable.

- [x] T026 Ejecutar `npm run verify`, `npm run test:e2e`, `npm run privacy:check` y `git diff --check`; corregir fallos sin incluir datos reales, secretos ni cambios de Supabase.
- [x] T027 Revisar en navegador local los layouts móvil y escritorio de `src/components/layout/LanguageSelector.jsx` y `src/components/layout/PublicLayout.jsx`, documentar el resultado agregado en `specs/007-json-i18n-catalog/validation.md` y comprobar contraste/foco.
- [ ] T028 Actualizar los checks de tarea, ejecutar `npm run context:sync` y `npm run context:check`, preparar commits sin `Co-authored-by`, subir `feat/i18n-json-catalog` y abrir un único PR hacia `main` sin auto-merge.

## Dependencies & Execution Order

- T001–T003 pueden comenzar inmediatamente.
- T004–T008 dependen de los catálogos y bloquean las historias públicas.
- US1 depende de T004–T008; T009–T010 se escriben antes de T011–T015.
- US2 depende de los contratos fundacionales y puede verificar componentes
  modificados en US1; T016–T017 se escriben antes de T018–T020.
- US3 depende de catálogos y puede ejecutarse después de US1; T021–T022
  preceden T023–T025.
- T026–T028 requieren las tres historias completas.

## Parallel Opportunities

- T001, T002 y T003 trabajan en archivos separados.
- Tras la fase fundacional, T013–T015 pueden avanzar en paralelo.
- T016–T018 y T017 pueden dividirse por componente sin compartir archivos.
- T021 y T022 son pruebas independientes.

## Implementation Strategy

1. Entregar primero el contrato de catálogos y proveedor sin tocar Supabase.
2. Implementar el selector y las rutas públicas principales para demostrar el
   cambio de idioma completo.
3. Fortalecer la frontera editorial con pruebas que impidan transformar datos
   remotos.
4. Migrar demo, errores y la última copia pública a JSON.
5. Verificar localmente, publicar una sola rama y abrir un único PR para la
   revisión humana de `@khrizenriquez`.
