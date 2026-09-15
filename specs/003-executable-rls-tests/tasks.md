# Tasks: Contrato RLS ejecutable

**Input**: Design documents from `/specs/003-executable-rls-tests/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/database-security.md`, `quickstart.md`

**Tests**: Esta feature existe para reemplazar evidencia indirecta por pruebas pgTAP ejecutables. Los fixtures deben ser ficticios y cada suite debe hacer rollback.

## Phase 1: Setup

**Purpose**: Separar claramente el chequeo estático rápido del contrato de base real.

- [x] T001 Configurar `db:contract` para `scripts/db-test.mjs`, `db:test` para `supabase test db` e incluir el chequeo rápido en `npm run verify` dentro de `package.json`.

---

## Phase 2: User Story 1 - Probar la frontera de privacidad (Priority: P1) 🎯 MVP

**Goal**: Demostrar bajo el rol anónimo que las tablas y fotografías privadas permanecen cerradas y que la RPC expone únicamente perfiles publicados con columnas explícitas.

**Independent Test**: Aplicar la migración a una base nueva y ejecutar solo las suites `001_privacy_contract.sql` y `002_public_privacy_behavior.sql`; todos los casos deben pasar y la transacción debe revertirse.

### Tests for User Story 1

- [x] T002 [US1] Fortalecer las aserciones estructurales de privilegios, RLS y firma pública exacta en `supabase/tests/001_privacy_contract.sql`.
- [x] T003 [US1] Crear fixtures transaccionales y pruebas de comportamiento anónimo para estados de perfil, RPC, mutaciones y políticas de Storage en `supabase/tests/002_public_privacy_behavior.sql`.

**Checkpoint**: El contrato anónimo falla si una tabla, campo privado, estado no publicado o fotografía privada se vuelve accesible.

---

## Phase 3: User Story 2 - Probar autorización y reglas editoriales (Priority: P1)

**Goal**: Demostrar que la allowlist distingue usuarios autenticados, que los administradores pueden editar sin borrar y que PostgreSQL aplica publicación y límite de fotografías.

**Independent Test**: Ejecutar `003_admin_authorization_behavior.sql` en una base migrada; los casos de usuario no autorizado, administrador, publicación incompleta y cuarta fotografía deben producir los resultados previstos.

### Tests for User Story 2

- [x] T004 [US2] Crear fixtures de Auth y pruebas de allowlist, publicación y máximo de imágenes en `supabase/tests/003_admin_authorization_behavior.sql`; revocar borrado y encapsular la autorización de Storage en `supabase/migrations/202609150001_harden_media_access.sql`.

**Checkpoint**: El contrato administrativo diferencia ambos usuarios y prueba todas las reglas editoriales sin datos persistentes.

---

## Phase 4: User Story 3 - Obtener evidencia en cada cambio (Priority: P2)

**Goal**: Ejecutar el contrato real en cada PR con una base local desechable, CLI fijada y cero secretos externos.

**Independent Test**: El workflow instala la CLI prevista, ejecuta las migraciones desde cero y termina los archivos pgTAP en verde dentro del check `verify`.

### Implementation for User Story 3

- [x] T005 [US3] Fijar `supabase/setup-cli` v3.0.0 por SHA, instalar CLI 2.117.0, iniciar la base local y ejecutar `npm run db:test` en `.github/workflows/ci.yml`.

**Checkpoint**: GitHub Actions produce evidencia real de migraciones y RLS sin variables de Supabase remoto.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentar el flujo y cerrar la verificación del harness.

- [x] T006 Documentar `db:contract`, requisitos de Docker, ciclo local y comportamiento de CI en `README.md` y `specs/003-executable-rls-tests/quickstart.md`.
- [ ] T007 Ejecutar formato, lint, unitarias, build, contexto, privacidad y chequeo estático con `npm run verify`; validar pgTAP mediante GitHub Actions y registrar todas las tareas como completadas en `specs/003-executable-rls-tests/tasks.md`.

---

## Dependencies & Execution Order

- **Phase 1** no tiene dependencias.
- **User Story 1** depende de T001 para establecer los comandos del contrato.
- **User Story 2** depende de T001 y puede implementarse independientemente de User Story 1 porque usa su propio archivo transaccional.
- **User Story 3** depende de T001 y de las suites de User Stories 1 y 2.
- **Polish** depende de las tres historias.

## Parallel Opportunities

- T002 y T004 afectan archivos distintos y pueden revisarse en paralelo después de T001.
- T003 y T004 usan fixtures independientes y transacciones separadas.
- La documentación de T006 puede avanzar mientras se valida CI, sin cambiar el contrato.

## Implementation Strategy

1. Separar los dos niveles de prueba sin romper `npm run verify`.
2. Implementar primero la frontera anónima P1 y validarla de forma aislada.
3. Añadir la autorización administrativa P1 con fixtures independientes.
4. Integrar la base local en CI y usar ese mismo resultado para validar todos los archivos.
5. Documentar los comandos exactos y dejar el PR listo para revisión humana.
