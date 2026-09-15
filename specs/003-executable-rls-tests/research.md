# Research: Contrato RLS ejecutable

## Decisión 1: pgTAP sobre PostgreSQL real

**Decision**: Ejecutar `supabase test db` después de `supabase db start` y probar políticas usando roles y claims locales.

**Rationale**: La documentación oficial de Supabase recomienda pgTAP para estructura, RLS, funciones e integridad. Ejercer consultas reales detecta políticas permisivas aunque el texto SQL todavía contenga los nombres esperados.

**Alternatives considered**:

- Mantener solo expresiones regulares: rápido, pero no demuestra el comportamiento de RLS.
- Pruebas únicamente con Supabase JS: útiles para flujos de aplicación, pero requieren levantar más servicios y son menos aislables que una transacción pgTAP.
- Conectar CI al proyecto gratuito: rechazado porque introduciría secretos, estado compartido y riesgo sobre datos reales.

## Decisión 2: base local mínima y desechable

**Decision**: Usar `supabase db start`, aplicar migraciones desde cero y ejecutar cada archivo de pruebas dentro de `begin`/`rollback`.

**Rationale**: La feature solo necesita PostgreSQL, roles, Auth y objetos de Storage creados por la imagen local. Evitar la pila completa reduce tiempo y recursos; rollback impide persistencia de fixtures.

**Alternatives considered**:

- `supabase start` completo: válido, pero inicia servicios que estas pruebas no consumen.
- PostgreSQL genérico: no reproduce de forma confiable los roles, esquemas y extensiones de Supabase.

## Decisión 3: CLI estable y acción fijada

**Decision**: Instalar Supabase CLI 2.117.0 mediante `supabase/setup-cli` v3.0.0 fijado al SHA `46f7f98c7f948ad727d22c1e67fab04c223a0520`.

**Rationale**: 2.117.0 es la versión estable publicada al diseñar esta feature. Fijar versión de CLI y commit de la acción evita cambios silenciosos, mantiene reproducibilidad y permite actualizaciones revisadas por Dependabot.

**Alternatives considered**:

- `version: latest`: rechazado porque vuelve no determinista el contrato.
- Añadir la CLI como dependencia npm del frontend: funciona, pero aumenta la instalación de todos los jobs aunque solo el job de base la necesita.
- Instalar con un script remoto: rechazado por riesgo de cadena de suministro y menor trazabilidad.

## Decisión 4: dos niveles de retroalimentación

**Decision**: Renombrar el verificador actual a `db:contract` y hacer que `db:test` ejecute pgTAP real.

**Rationale**: El chequeo estático sigue siendo útil sin Docker, pero el nombre principal debe representar la prueba que realmente valida el comportamiento. CI ejecutará ambos.

**Alternatives considered**:

- Eliminar el chequeo estático: perdería una señal rápida para errores obvios.
- Hacer que `db:test` omita silenciosamente sin Docker: produciría falsos positivos.
