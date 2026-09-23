# Tasks: Contenido bilingüe de beneficiarios

**Input**: Diseño en `/specs/008-bilingual-beneficiary-content/`.

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/public-localizations.md` y `quickstart.md`.

**Tests**: La especificación exige pruebas pgTAP, unitarias, de servicios y
Playwright. Se escriben antes de sus cambios funcionales.

## Phase 1: Setup

**Purpose**: Asegurar que contratos y catálogo de idioma expresan la nueva
disponibilidad antes de modificar la base de datos.

- [ ] T001 [P] Añadir mensajes JSON de disponibilidad de historia, tarjeta y texto alternativo genérico en `src/i18n/locales/es.json` y `src/i18n/locales/en.json`.
- [ ] T002 [P] Añadir pruebas de mensajes simétricos y selección de localización en `src/i18n/catalog.test.js` y crear `src/i18n/localization.js` para una localización completa o `null`.
- [ ] T003 Actualizar los fixtures ficticios bilingües en `src/i18n/testFixtures.js` y `src/data/demoBeneficiaries.js`, sin datos personales, para representar español disponible e inglés ausente.

---

## Phase 2: Foundational — contrato, migración y seguridad

**Purpose**: Crear la fuente de verdad bilingüe, conservar el español actual y
protegerla antes de que cualquier superficie la consuma.

**⚠️ CRITICAL**: Ninguna historia usa localizaciones hasta que la migración,
sus pruebas y el contrato público estén listos.

- [ ] T004 [P] Crear pruebas pgTAP de tabla, RLS, privilegios, migración española, publicación con inglés ausente, rechazo de inglés parcial y contrato público en `supabase/tests/005_bilingual_localizations_contract.sql`.
- [ ] T005 [P] Actualizar expectativas del contrato de columnas de RPC en `supabase/tests/001_privacy_contract.sql` para incluir `localizations` sin datos privados.
- [ ] T006 Crear `supabase/migrations/202609220001_bilingual_beneficiary_content.sql` con `beneficiary_localizations` y `beneficiary_image_localizations`: `locale` limitado a `es`/`en`; `school_grade`/`favorite_subject` máximo 180; `hobby`/`future_goal` máximo 500; `public_story` máximo 5000; `alt_text` máximo 300; claves únicas compuestas y auditoría.
- [ ] T007 Extender la migración en `supabase/migrations/202609220001_bilingual_beneficiary_content.sql` para copiar idempotentemente los cinco campos editoriales existentes a `es`, convertir el texto alternativo histórico en `es`, y no sobrescribir localizaciones ya existentes.
- [ ] T008 Extender la validación de estado en `supabase/migrations/202609220001_bilingual_beneficiary_content.sql`: publicar desde borrador requiere nombre, fecha y `es` completo; una fila `en` con cualquier campo requiere sus cinco campos completos en esa transición; borradores y traducción inglesa progresiva de un perfil ya publicado permiten incompletitud sin exponerla.
- [ ] T009 Extender RLS, privilegios y políticas de `supabase/migrations/202609220001_bilingual_beneficiary_content.sql` para que `anon` no pueda leer localizaciones directamente y la allowlist admin pueda leer, insertar, actualizar y borrar solo las localizaciones.
- [ ] T010 Reemplazar las RPC de la migración por contratos que devuelvan `localizations` e `alt_texts` únicamente de perfiles publicados y versiones completas en `supabase/migrations/202609220001_bilingual_beneficiary_content.sql`.
- [ ] T011 Actualizar el chequeo estático de seguridad para verificar localizaciones y contrato bilingüe en `scripts/db-test.mjs`.

**Checkpoint**: pgTAP demuestra que español existente se preserva, el contenido
inglés parcial no se publica y anon no recibe tablas ni datos privados.

---

## Phase 3: User Story 1 — Gestionar las dos versiones de una historia (Priority: P1) 🎯 MVP

**Goal**: El administrador gestiona español e inglés desde el mismo perfil sin
duplicar identidad, datos privados ni archivos de foto.

**Independent Test**: Crear/editar un perfil sintético, guardar ambas
localizaciones, publicar solo español y comprobar que una versión inglesa
parcial se rechaza en cliente y base de datos.

### Tests for User Story 1

- [ ] T012 [P] [US1] Extender `src/forms/beneficiarySchema.test.js` con localizaciones `es`/`en`, español obligatorio para publicar e inglés opcional pero atómico.
- [ ] T013 [P] [US1] Crear `src/services/adminBeneficiaries.test.js` para payloads que normalizan localizaciones y no escriben los campos editoriales históricos.
- [ ] T014 [P] [US1] Crear `src/pages/admin/BeneficiaryFormPage.test.jsx` para grupos Español/English, errores por campo y guardado de borrador.

### Implementation for User Story 1

- [ ] T015 [US1] Actualizar `src/forms/beneficiarySchema.js` con `localizations.es` y `localizations.en`, aplicando exactamente las restricciones del modelo y validación de publicación.
- [ ] T016 [US1] Actualizar `src/services/adminBeneficiaries.js` para cargar anidaciones de localización, persistir localizaciones antes de solicitar publicación inicial, y gestionar `alt_texts` por idioma sin escribir columnas históricas.
- [ ] T017 [US1] Actualizar `src/pages/admin/BeneficiaryFormPage.jsx` con grupos de campos editorial Español/English, errores dirigidos al idioma y texto de revisión que explique inglés opcional.
- [ ] T018 [US1] Actualizar `src/components/admin/PhotoManager.jsx` para editar texto alternativo en español e inglés y usar solo una etiqueta genérica de UI cuando falte.

**Checkpoint**: El área administrativa en español puede guardar ambos idiomas,
sin exigir inglés vacío y sin permitir inglés editorial parcial publicado.

---

## Phase 4: User Story 2 — Leer la versión elegida sin espera adicional (Priority: P1)

**Goal**: El catálogo selecciona el contenido editorial pre-cargado para el
idioma elegido y comunica la ausencia sin fallback.

**Independent Test**: Una historia ficticia bilingüe alterna todo su contenido
sin otro fetch; una historia solo española conserva tarjeta y abre estado en
inglés.

### Tests for User Story 2

- [ ] T019 [P] [US2] Crear `src/i18n/localization.test.js` para versión completa, versión ausente y prohibición de fallback editorial.
- [ ] T020 [P] [US2] Actualizar `src/services/publicBeneficiaries.test.js` para confirmar una carga que contiene ambas localizaciones y que la clave no depende de `locale`.
- [ ] T021 [P] [US2] Extender `src/components/story/StoryCard.test.jsx`, `StoryGallery.test.jsx` y `src/pages/StoryPage.test.jsx` con contenido bilingüe, texto alternativo localizado y estado de ausencia.
- [ ] T022 [P] [US2] Extender `e2e/public-stories.spec.js` con cambio de idioma sin nueva solicitud, tarjeta visible sin inglés y detalle localizado no disponible en móvil y escritorio.

### Implementation for User Story 2

- [ ] T023 [US2] Actualizar `src/services/publicBeneficiaries.js` para conservar ambas localizaciones y textos alternativos firmados de una respuesta RPC, sin aceptar `locale` como parámetro de consulta.
- [ ] T024 [US2] Crear `src/components/story/StoryAvailabilityNotice.jsx` y actualizar `src/components/story/StoryCard.jsx` para mostrar disponibilidad localizada, conservar datos compartidos y no mezclar campos editoriales.
- [ ] T025 [US2] Actualizar `src/components/story/StoryGallery.jsx` para elegir `alt_texts[locale]` o la etiqueta genérica del catálogo, sin tomar el texto alternativo del otro idioma.
- [ ] T026 [US2] Actualizar `src/pages/HomePage.jsx` y `src/pages/StoryPage.jsx` para usar `selectLocalization`, conservar claves TanStack Query independientes del idioma, y renderizar el estado de versión ausente.

**Checkpoint**: Alternar selector muestra contenido editorial del idioma elegido
desde memoria y la ausencia no genera fetch ni fallback.

---

## Phase 5: User Story 3 — Preservar privacidad y catálogo completo (Priority: P2)

**Goal**: La extensión bilingüe conserva fronteras de datos y muestra perfiles
visibles aunque haya una versión pendiente.

**Independent Test**: Ejecutar contrato SQL como anon, navegar catálogo en
ambos idiomas y comprobar datos privados ausentes, tarjetas visibles y a11y.

### Tests for User Story 3

- [ ] T027 [P] [US3] Extender `supabase/tests/002_public_privacy_behavior.sql` para comprobar perfiles bilingües publicados, versiones ausentes y exclusión de borradores/archivados.
- [ ] T028 [P] [US3] Actualizar pruebas de buscador en `src/pages/HomePage.test.jsx` para tarjetas bilingües y disponibilidad sin alterar búsqueda por nombre.

### Implementation for User Story 3

- [ ] T029 [US3] Ajustar consultas y representaciones administrativas en `src/services/adminBeneficiaries.js` y `src/pages/admin/BeneficiaryListPage.jsx` para conservar nombre/estado comunes sin contenido localizado duplicado.
- [ ] T030 [US3] Actualizar `README.md` con el flujo de traducciones, reglas de publicación, mantenimiento de idiomas y ejecución local sin secretos.

**Checkpoint**: Los contratos públicos siguen limitados, las personas no se
ocultan por una versión pendiente y la documentación refleja el flujo seguro.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T031 Ejecutar `npm run db:test`, `npm run verify`, `npm run test:e2e`, `npm run privacy:check` y `git diff --check`; corregir cualquier fallo sin datos reales en `specs/008-bilingual-beneficiary-content/validation.md`.
- [ ] T032 Validar con Podman en móvil y escritorio formulario bilingüe, estado de versión ausente, foco y contraste; documentar la evidencia en `specs/008-bilingual-beneficiary-content/validation.md`.
- [ ] T033 Actualizar checks de esta lista, ejecutar `npm run context:sync` y `npm run context:check`, crear commits sin `Co-authored-by`, subir `feat/bilingual-beneficiary-content` y abrir un único PR hacia `main` sin fusionarlo.

## Dependencies & Execution Order

- T001–T003 preparan mensajes, lógica y fixtures.
- T004–T011 bloquean el resto; las pruebas de contrato preceden a la migración.
- US1 depende de la migración y habilita el ingreso administrativo.
- US2 depende del nuevo contrato público y puede usar fixtures mientras US1 se
  termina, pero se verifica después de T015–T018.
- US3 confirma la integración segura de ambas historias.
- T031–T033 requieren toda la funcionalidad.

## Parallel Opportunities

- T001 y T002 trabajan en catálogos/lógica independientes; T004 y T005 son
  contratos diferentes.
- T012–T014 son pruebas separadas de US1.
- T019–T022 se pueden dividir por servicio, componente y E2E.
- T027 y T028 prueban base e interfaz de US3 en archivos distintos.

## Implementation Strategy

1. Asegurar primero el contrato de datos, migración y RLS con pgTAP.
2. Hacer administrable el contenido bilingüe; ese es el MVP de entrada.
3. Consumir el contrato común en el catálogo, sin que el selector provoque
   consultas adicionales.
4. Validar privacidad, accesibilidad, Podman y calidad antes del PR.
