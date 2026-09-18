# Tasks: Manual local y guía privada de nube

**Input**: Diseño de `specs/004-local-runbook-cloud-guide/`.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/runbook-contract.md` y `quickstart.md`.

**Tests**: No se añaden pruebas de producto. La feature exige ejecutar el harness local existente completo y comprobar la documentación con sus comandos reales.

## Phase 1: Setup

**Purpose**: Preparar los artefactos de planificación y el contexto de agentes para este cambio documental.

- [x] T001 Verificar que `specs/004-local-runbook-cloud-guide/spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/runbook-contract.md` y `quickstart.md` reflejan el alcance sin despliegue remoto.
- [x] T002 Ejecutar `npm run context:sync` y `npm run context:check` para apuntar `AGENTS.md`, `CLAUDE.md` y `.github/copilot-instructions.md` al plan activo.

---

## Phase 2: Foundational

**Purpose**: Confirmar las fuentes reales que el README documentará, sin cambiar código ni proveedores.

- [x] T003 Inspeccionar `package.json`, `.env.example`, `scripts/`, `containers/`, `supabase/config.toml` y `vercel.json` para validar versiones, comandos, URLs y límites de seguridad documentados.
- [x] T004 Consultar documentación oficial de Supabase y Vercel para confirmar el flujo futuro de migraciones, Auth, Vite y variables de entorno; registrar las decisiones en `specs/004-local-runbook-cloud-guide/research.md`.

**Checkpoint**: Las fuentes versionadas y las instrucciones externas están verificadas; pueden producirse las dos piezas documentales.

---

## Phase 3: User Story 1 - Levantar y validar el MVP local (Priority: P1) 🎯 MVP

**Goal**: Ofrecer un README completo para desarrollar y comprobar el MVP local sin depender de nube.

**Independent Test**: Ejecutar los comandos del README sobre el stack Podman y confirmar la URL local y los resultados de verificación.

- [x] T005 [US1] Reescribir `README.md` como runbook local en español con propósito, tecnologías y versiones, prerrequisitos, inicio, acceso, recarga, detención, importación, backup, privacidad y matriz de validación.
- [x] T006 [US1] Ejecutar `npm run local:start`, `npm run verify`, `npm run db:test`, `npm run test:local`, `npm run test:e2e`, `npm run test:backup` y `npm run test:persistence` contra el MVP local y registrar resultados en `specs/004-local-runbook-cloud-guide/validation.md`.

**Checkpoint**: El README permite levantar y validar el MVP con datos ficticios y sin configuración remota.

---

## Phase 4: User Story 2 - Preparar un despliegue sin exponer secretos (Priority: P1)

**Goal**: Entregar una guía privada, accionable y segura para un posterior PR de nube.

**Independent Test**: Inspeccionar que el documento está fuera de Git, no tiene valores privados y cubre el checklist de Supabase/Vercel sin ejecutar ninguna operación remota.

- [x] T007 [US2] Crear `../GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md` fuera del repositorio con prerrequisitos, Supabase Free, Auth, migraciones revisables, allowlist, variables permitidas, Vercel Hobby, pruebas de humo, backup y rollback no destructivo.
- [x] T008 [US2] Revisar la guía externa contra `specs/004-local-runbook-cloud-guide/contracts/runbook-contract.md`, confirmar que no queda bajo `git ls-files` y que prohíbe la clave de servicio en navegador o Vercel.

**Checkpoint**: El despliegue futuro está documentado sin secretos ni cambio remoto, y la guía no se incluye en el repositorio.

---

## Phase 5: User Story 3 - Mantener límites de alcance claros (Priority: P2)

**Goal**: Dejar evidencia de que el cambio es documental, privado en lo operativo y listo para revisión humana.

**Independent Test**: Inspeccionar el diff y confirmar que no se alteran migraciones, configuración remota ni artefactos privados.

- [x] T009 [US3] Actualizar `specs/004-local-runbook-cloud-guide/spec.md` a estado Ready for review y completar `validation.md` con la comprobación de alcance y privacidad.
- [x] T010 [US3] Ejecutar `npm run privacy:check`, revisar `git diff --check` y `git diff --name-only` para comprobar que no existen datos privados ni cambios fuera del alcance.

**Checkpoint**: El cambio está listo para una rama corta y Pull Request hacia `main`, sin despliegue ni merge.

---

## Phase 6: Polish & cross-cutting verification

- [x] T011 Ejecutar `npm run context:check` y actualizar todos los checkboxes de `specs/004-local-runbook-cloud-guide/tasks.md` tras terminar las tareas.
- [ ] T012 Preparar el commit sin trailer `Co-authored-by`, subir `docs/local-runbook-and-cloud-guide` y abrir un Pull Request sin auto-merge hacia `main`.

## Dependencies & Execution Order

- T001–T004 preparan y verifican las fuentes de las dos historias principales.
- T005 debe completarse antes de T006, porque la batería valida el runbook publicado.
- T007 debe completarse antes de T008, porque la guía externa se inspecciona después de crearla.
- T006 y T008 deben terminar antes de T009–T010.
- T011–T012 se realizan al final, después de todas las validaciones.

## Parallel Opportunities

- T003 y T004 pueden investigarse en paralelo, pues solo leen fuentes distintas.
- Tras la base, T005–T006 y T007–T008 son flujos independientes, aunque se ejecutarán secuencialmente en esta rama para mantener una revisión simple.

## Implementation Strategy

1. Confirmar artefactos, fuentes y contexto.
2. Actualizar el README y demostrar el MVP local.
3. Crear e inspeccionar la guía privada externa sin tocar proveedores.
4. Ejecutar controles de privacidad, documentar resultados y abrir un único PR para revisión humana.
