# Tasks: Identidad visual y parallax público

**Input**: Diseño de `specs/005-visual-brand-parallax/` y `docs/superpowers/specs/2026-09-18-visual-brand-parallax-design.md`.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/public-motion.md` y `quickstart.md`.

**Tests**: Se actualizan pruebas Playwright de la portada porque la feature altera interacciones visibles, accesibilidad y enlaces externos.

## Phase 1: Setup

**Purpose**: Asegurar que el diseño aprobado y el contexto de agentes son la fuente de verdad.

- [x] T001 Verificar `specs/005-visual-brand-parallax/spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/public-motion.md` y `quickstart.md` contra el diseño aprobado en `docs/superpowers/specs/2026-09-18-visual-brand-parallax-design.md`.
- [x] T002 Ejecutar `npm run context:sync` y `npm run context:check` para sincronizar los punteros de `AGENTS.md`, `CLAUDE.md` y `.github/copilot-instructions.md`.

---

## Phase 2: Foundational

**Purpose**: Establecer tokens visuales y una interfaz de reveal reutilizable antes de modificar la portada.

- [x] T003 Reemplazar la paleta heredada por tokens cian, azul, tinta y superficies claras de alto contraste en `src/theme/theme.js`.
- [x] T004 [P] Actualizar colores globales y reducción de movimiento en `src/styles/global.css` sin dejar hexadecimales verdes, beige, maíz o arcilla.
- [x] T005 Crear el hook `src/hooks/useRevealOnViewport.js` con `IntersectionObserver`, desobservación después de revelar y retorno estático con `prefers-reduced-motion: reduce`.
- [x] T006 [P] Actualizar `src/components/BrandMark.jsx`, `src/components/story/StoryImagePlaceholder.jsx` y los fondos/bordes heredados de layouts administrativos para consumir tokens del tema.

**Checkpoint**: El sistema de color y reveal puede usarse sin cambiar servicios, datos o rutas.

---

## Phase 3: User Story 1 - Reconocer la identidad de Más Generosidad (Priority: P1) 🎯 MVP

**Goal**: Convertir toda la aplicación a la paleta base del logo sin disminuir contraste.

**Independent Test**: Portada, tarjetas, placeholders y administración usan azul/cian/superficies claras; Axe no detecta regresiones WCAG A/AA.

- [x] T007 [US1] Sustituir los fondos, acentos y bordes hardcodeados de `src/pages/HomePage.jsx`, `src/pages/admin/BeneficiaryFormPage.jsx`, `src/pages/admin/BeneficiaryListPage.jsx`, `src/pages/admin/LoginPage.jsx` y `src/components/admin/PhotoManager.jsx` por tokens de tema.
- [x] T008 [US1] Ampliar `e2e/public-stories.spec.js` con una comprobación de paleta y contraste accesible de la portada en móvil y escritorio.

**Checkpoint**: El tema de marca es coherente y accesible de forma independiente.

---

## Phase 4: User Story 2 - Entender un footer directo (Priority: P1)

**Goal**: Reducir el footer a enlaces útiles y eliminar el contenido indicado por el usuario.

**Independent Test**: El footer contiene solo enlace seguro a ONG y enlace seguro a Christofer; no contiene la marca compacta ni el texto retirado.

- [x] T009 [US2] Simplificar `src/components/layout/PublicLayout.jsx` con enlace a la ONG y “Made with love by Christofer Enríquez” hacia `https://khrizenriquez.github.io/khrizenriquez/`, conservando adaptación móvil y `rel="noreferrer"`.
- [x] T010 [US2] Añadir a `e2e/public-stories.spec.js` pruebas de ambos enlaces del footer y ausencia de la marca/texto retirados.

**Checkpoint**: Footer verificable y adaptable sin contenido redundante.

---

## Phase 5: User Story 3 - Recorrer historias con movimiento accesible (Priority: P1)

**Goal**: Revelar tarjetas en scroll y ampliar imágenes 20% sin alterar layout.

**Independent Test**: Con fixtures, las tarjetas se revelan una vez, las imágenes escalan a `matrix(1.2, ...)` o equivalente en hover/foco y reducir movimiento mantiene las tarjetas estáticas.

- [x] T011 [US3] Integrar `useRevealOnViewport` y atributos verificables en `src/components/story/StoryCard.jsx`; aplicar reveal por tarjeta y zoom `scale(1.2)` solamente al `CardMedia` existente, con `overflow: hidden` y soporte `focus-within`.
- [x] T012 [US3] Actualizar `e2e/public-stories.spec.js` con pruebas de reveal, hover/foco de imagen, placeholder y `prefers-reduced-motion: reduce` en viewport móvil y escritorio.

**Checkpoint**: La portada ofrece profundidad visual sin listener global, sin salto de layout y con alternativa estática accesible.

---

## Phase 6: Polish & verification

- [x] T013 Ejecutar `npm run verify`, `npm run test:e2e`, `npm run local:start` y `npm run test:local`; registrar únicamente resultados agregados, sin capturas, nombres ni rutas de datos locales en `specs/005-visual-brand-parallax/validation.md`.
- [x] T014 Ejecutar `npm run privacy:check`, `git diff --check` y revisar que no hay cambios en `supabase/`, datos, fotos, secretos o configuración cloud.
- [x] T015 Actualizar checkboxes y `specs/005-visual-brand-parallax/validation.md`, preparar commits sin `Co-authored-by`, subir `feat/visual-brand-parallax` y abrir un Pull Request hacia `main` sin auto-merge.

## Dependencies & Execution Order

- T001–T006 preparan el tema y reveal antes de cambiar componentes visibles.
- T007–T008 forman el MVP de identidad visual.
- T009–T010 dependen de T003–T004, pero son independientes de la animación.
- T011 depende de T005 y T012 depende de T011.
- T013–T015 se ejecutan cuando todas las historias estén completas.

## Parallel Opportunities

- T004 y T006 pueden ocurrir en paralelo tras T003 porque trabajan en archivos diferentes.
- Tras T003–T006, T007–T008 y T009–T010 son independientes de T011–T012.

## Implementation Strategy

1. Centralizar colores y accesibilidad de movimiento.
2. Actualizar la identidad completa y validar contraste.
3. Simplificar el footer.
4. Añadir reveal/zoom sin dependencia nueva y probar interacción móvil/escritorio.
5. Ejecutar el harness completo, revisión de privacidad y entregar un PR para revisión humana.
