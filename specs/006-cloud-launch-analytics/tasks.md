# Tasks: Lanzamiento cloud y analítica anónima

**Input**: Diseño de `specs/006-cloud-launch-analytics/`, `docs/superpowers/specs/2026-09-18-cloud-launch-analytics-design.md`, `docs/superpowers/specs/2026-09-19-roboto-footer-mobile-design.md` y `docs/superpowers/specs/2026-09-19-temporary-public-profiles-design.md`.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/production-launch.md` y `quickstart.md`.

**Tests**: Se añaden pruebas unitarias para el montaje único de analítica y Playwright para preservar navegación/privacidad pública. Se ejecutan además los harnesses de Podman y el humo de producción tras la configuración externa.

## Phase 1: Setup

**Purpose**: Asegurar que el diseño aprobado, la dependencia fijada y el contexto de agentes son la fuente de verdad.

- [x] T001 Verificar `specs/006-cloud-launch-analytics/spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/production-launch.md` y `quickstart.md` contra `docs/superpowers/specs/2026-09-18-cloud-launch-analytics-design.md`.
- [x] T002 Añadir `@vercel/analytics` 2.0.1 como dependencia exacta y actualizar `package-lock.json` mediante npm con Node 24 en `package.json` y `package-lock.json`.
- [x] T003 Ejecutar `npm run context:sync` y `npm run context:check` para sincronizar `AGENTS.md`, `CLAUDE.md` y `.github/copilot-instructions.md` con `specs/006-cloud-launch-analytics/plan.md`.

---

## Phase 2: Foundational

**Purpose**: Crear una integración de observabilidad aislada que no pueda recibir ni enviar campos de contenido, Auth o búsqueda.

**⚠️ CRITICAL**: No se integra analítica en rutas hasta que exista un componente único y probado.

- [x] T004 Crear `src/app/AnonymousAnalytics.test.jsx` que simule el paquete oficial y pruebe un único montaje, ausencia de props y ausencia de llamadas de eventos personalizados.
- [x] T005 Crear `src/app/AnonymousAnalytics.jsx` con un único montaje del componente oficial, sin props, eventos personalizados, identificadores ni acceso a estado de rutas, formularios o Auth.
- [x] T006 Integrar `src/app/AnonymousAnalytics.jsx` una sola vez en `src/main.jsx`, fuera de `AppProviders` y sin afectar rutas, render de datos ni manejo de errores de la SPA.
- [x] T007 Actualizar `README.md` y `.env.example` para declarar la analítica agregada, las tres únicas variables públicas de Vercel y la prohibición de datos de visitantes, secretos y `SUPABASE_SERVICE_ROLE_KEY` en build remoto.

**Checkpoint**: La aplicación compila y la analítica se puede habilitar sin que los servicios de perfiles reciban telemetría.

---

## Phase 3: User Story 1 - Consultar historias publicadas de forma segura (Priority: P1) 🎯 MVP

**Goal**: Mantener la navegación pública y las fronteras de privacidad al desplegar la SPA desde `main`.

**Independent Test**: En entorno local y después en producción, una sesión anónima abre rutas directas públicas, no recibe datos administrativos y el build no usa fixtures de demostración cuando recibe configuración real.

- [x] T008 [P] [US1] Ampliar `e2e/public-stories.spec.js` con comprobaciones de recarga en `/`, `/historias/DEMO-001` y `/admin/login`, y confirmar que no aparecen fecha de nacimiento, notas privadas ni registro público.
- [x] T009 [US1] Revisar y, si es necesario, ajustar `vercel.json` y `src/config/env.js` para que rutas SPA, `noindex`, cabeceras existentes y configuración pública incompleta se comporten según `contracts/production-launch.md`, sin añadir secretos ni una ruta de servidor.
- [x] T010 [US1] Documentar el checklist de despliegue Git-to-Vercel, variables de Production/Preview y humo de ruta profunda en `README.md` y `specs/006-cloud-launch-analytics/quickstart.md` sin valores reales.

**Checkpoint**: El build estático y el contrato público son verificables independientemente de la importación privada.

---

## Phase 4: User Story 2 - Administrar contenido autorizado (Priority: P1)

**Goal**: Preparar una carga privada, idempotente y revisable de los 41 perfiles sin publicación automática.

**Independent Test**: Con un archivo de prueba ficticio, el importador sigue validando 41 códigos y deja todos los perfiles en borrador; en la operación remota se registran solo conteos, sin datos personales.

- [x] T011 [P] [US2] Añadir pruebas de parser e idempotencia sin datos reales en `scripts/import-beneficiaries.test.mjs` para MG-001–MG-041, exclusión MG-042, borrador obligatorio, fecha incompleta pendiente y ausencia de fotos.
- [x] T012 [US2] Actualizar `scripts/import-beneficiaries.mjs` y `README.md` para que la carga remota exija explícitamente una variable de servidor local, informe únicamente conteos y rechace usar modo demo o una variable `VITE_*` como credencial.
- [x] T013 [US2] Ejecutar la carga real una única vez desde un archivo local ignorado después de recibir una clave de servidor transitoria; verificar con una consulta de solo conteos 41 borradores, 0 publicaciones y 0 fotos, y registrar solo el resultado agregado en `specs/006-cloud-launch-analytics/validation.md`.
- [ ] T014 [US2] Crear un respaldo manual cifrado después de la carga mediante `scripts/backup.mjs` y documentar en `specs/006-cloud-launch-analytics/validation.md` únicamente su existencia local, sin ruta, nombre, clave ni contenido.

**Checkpoint**: La ONG puede iniciar la revisión editorial desde `/admin` sin que el catálogo público exponga los borradores.

---

## Phase 5: User Story 3 - Conocer el alcance sin rastrear personas (Priority: P2)

**Goal**: Entregar métrica agregada a la ONG con una integración mínima y comprobable.

**Independent Test**: La prueba unitaria demuestra un único componente sin eventos propios; el panel externo muestra datos agregados después de una visita de producción y la app continúa si el script no carga.

- [x] T015 [US3] Probar en `src/app/AnonymousAnalytics.test.jsx` que la integración no recibe props de navegación, búsqueda, login ni campos de analítica personalizados.
- [x] T016 [US3] Añadir al runbook en `README.md` y `specs/006-cloud-launch-analytics/quickstart.md` la activación en panel Vercel, la consulta de métricas agregadas y el límite explícito de no crear eventos, cookies ni identificadores persistentes.
- [ ] T017 [US3] Tras el primer despliegue de `main`, confirmar en el panel Vercel que Web Analytics está habilitado y que una visita de prueba genera métrica agregada; registrar en `specs/006-cloud-launch-analytics/validation.md` solo éxito/fallo y fecha, sin datos de visitante.

**Checkpoint**: La ONG obtiene alcance agregado sin ampliar el modelo de datos ni la exposición de personas visitantes.

---

## Phase 6: Polish & cross-cutting verification

- [x] T022 Añadir en `e2e/public-stories.spec.js` la expectativa de Roboto, el crédito final y la disposición del footer en los proyectos móvil y escritorio.
- [x] T023 Cargar Roboto con `preconnect` en `index.html`, aplicar la familia en `src/theme/theme.js` y ajustar en `src/components/BrandMark.jsx` y `src/components/layout/PublicLayout.jsx` el crédito y breakpoints móviles aprobados.
- [x] T024 Ejecutar `npm run verify` y `npm run test:e2e`, revisar `git diff --check` y actualizar el resultado agregado en `specs/006-cloud-launch-analytics/validation.md`.
- [x] T018 Ejecutar `npm run verify`, `npm run db:test`, `npm run test:local`, `npm run test:e2e`, `npm run test:backup` y `npm run test:persistence`; registrar resultados agregados en `specs/006-cloud-launch-analytics/validation.md`.
- [x] T019 Ejecutar `npm run privacy:check`, `git diff --check`, auditoría de dependencias y revisión de `package-lock.json`; comprobar que no se añadieron datos reales, servicio privilegiado, secretos ni valores de proveedores.
- [ ] T020 Ejecutar el humo remoto descrito en `specs/006-cloud-launch-analytics/quickstart.md` después de que `main` se despliegue y actualizar `validation.md` con resultados agregados de rutas, RLS, Auth, imágenes y noindex.
- [ ] T021 Marcar tareas completadas, actualizar `specs/006-cloud-launch-analytics/validation.md`, preparar commits sin `Co-authored-by`, subir `feat/cloud-launch-analytics` y abrir el único Pull Request hacia `main` sin auto-merge.

---

## Phase 7: Demostración pública temporal autorizada

**Goal**: Publicar de forma reversible los 41 perfiles autorizados con una
ilustración neutral común, sin exponer la fecha completa ni almacenar originales.

**Independent Test**: Una consulta de solo conteos confirma 41 perfiles
publicados y una imagen principal por perfil; la API pública expone edad, no
fecha de nacimiento, y no permite descargar los objetos sin URLs firmadas.

- [x] T025 [P] Añadir pruebas en `src/forms/beneficiarySchema.test.js` y `scripts/import-beneficiaries.test.mjs` para aceptar solo `Niño`, `Niña` o sin especificar, y normalizar datos de origen no permitidos a `null`.
- [x] T026 Añadir una migración nueva en `supabase/migrations/` y una prueba pgTAP que normalicen género histórico no permitido y rechacen persistir valores fuera de `Niño`, `Niña` o `NULL`.
- [x] T027 Actualizar `src/forms/beneficiarySchema.js`, `src/pages/admin/BeneficiaryFormPage.jsx`, `src/services/adminBeneficiaries.js` y `scripts/import-beneficiaries.mjs` para que `Otro` no aparezca ni pueda persistirse.
- [x] T028 [P] Crear y probar `scripts/publish-temporary-demo.mjs`: exigir confirmación explícita de entorno, recibir solo variantes WebP locales no rastreadas, cargarlas al bucket privado, crear una imagen principal por perfil y publicar el lote de forma idempotente con compensación de errores.
- [ ] T029 Generar, inspeccionar y guardar transitoriamente una ilustración neutral sin personas, nombres ni texto; convertirla a dos derivados WebP y eliminar el original local después de completar la carga.
- [ ] T030 Ejecutar T028 contra Supabase desde secretos locales ignorados, establecer la fecha administrativa temporal `2019-08-19`, completar solo campos obligatorios vacíos con el texto autorizado, verificar solo conteos de 41 publicaciones/41 imágenes y comprobar el contrato público sin fechas completas.
- [ ] T031 Crear un respaldo manual cifrado posterior a T030 y documentar en `validation.md` únicamente existencia y resultado agregado, sin rutas, claves ni contenido.
- [ ] T032 Ejecutar `npm run verify`, `npm run db:test`, `npm run test:local`, `npm run test:e2e`, `npm run privacy:check` y la comprobación de humo remoto; actualizar `validation.md` y marcar las tareas concluidas.

## Dependencies & Execution Order

- T001–T003 preparan documentación, dependencia y contexto.
- T004–T007 son fundacionales y bloquean el trabajo visible de las historias.
- T008–T010 preservan el contrato público y son el MVP técnico de lanzamiento.
- T011 puede comenzar con T008; T012 depende de T011; T013–T014 requieren la configuración de Supabase y una clave local transitoria, por lo que son operaciones posteriores y no se simulan con datos reales en CI.
- T025 y T026 preparan el contrato de género y bloquean T027. T028 depende de las pruebas y de la decisión de media; T029 prepara las variantes privadas; T030 depende de T026–T029 y de la confirmación externa de consentimiento; T031 depende de T030; T032 cierra la fase.
- T015–T016 dependen de T004–T007; T017 requiere el despliegue resultante de fusionar el único PR.
- T018–T021 cierran la entrega; T020 y T021 necesitan que la revisión humana haya permitido desplegar `main`.

## Parallel Opportunities

- T002 y T003 pueden realizarse en paralelo después de T001.
- T008 y T011 trabajan en archivos distintos y pueden comenzar después de la fase fundacional.
- T010 y T016 son actualizaciones documentales independientes.
- Las pruebas locales de T018 se pueden iniciar cuando concluyan las modificaciones de código, antes de las operaciones remotas T013, T017 y T020.

## Implementation Strategy

1. Fijar la dependencia y encapsular la analítica en un componente sin entradas de usuario.
2. Probar que la SPA, la privacidad y rutas profundas no cambian.
3. Reforzar importador y runbook sin introducir información real al repositorio.
4. Ejecutar el harness local completo y entregar el único PR.
5. Tras su merge, configurar Vercel y Auth, importar los borradores con credenciales exclusivamente locales y realizar humo remoto/analítica.
6. Tras la confirmación de consentimiento, aplicar el contrato de género y ejecutar la demostración temporal reversible desde una terminal local controlada.
