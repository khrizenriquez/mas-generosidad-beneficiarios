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

**Decision**: Instalar Supabase CLI 2.117.0 como dependencia npm exacta con lockfile. La ampliación local aprobada reemplaza la instalación inicial mediante `supabase/setup-cli` para que el mismo ejecutable esté disponible tras `npm ci` tanto localmente como en CI.

**Rationale**: 2.117.0 es la versión estable publicada al diseñar esta feature. Fijar la CLI evita cambios silenciosos, mantiene reproducibilidad y permite actualizaciones revisadas por Dependabot.

**Alternatives considered**:

- `version: latest`: rechazado porque vuelve no determinista el contrato.
- Instalar una CLI global o con una acción separada: descartado al exigir un comando reproducible de arranque local tras `npm ci`.
- Instalar con un script remoto: rechazado por riesgo de cadena de suministro y menor trazabilidad.

## Decisión 4: dos niveles de retroalimentación

**Decision**: Renombrar el verificador actual a `db:contract` y hacer que `db:test` ejecute pgTAP real.

**Rationale**: El chequeo estático sigue siendo útil sin Docker, pero el nombre principal debe representar la prueba que realmente valida el comportamiento. CI ejecutará ambos.

**Alternatives considered**:

- Eliminar el chequeo estático: perdería una señal rápida para errores obvios.
- Hacer que `db:test` omita silenciosamente sin Docker: produciría falsos positivos.

## Decisión 5: autorización de Storage encapsulada

**Decision**: Resolver la pertenencia de una ruta a un perfil publicado mediante una función booleana `security definer` con `search_path` fijo y usarla desde las políticas de Storage.

**Rationale**: Una política de `storage.objects` ejecutada por `anon` no puede consultar directamente `beneficiary_images` sin concederle lectura a la tabla privada. La función encapsula el join, devuelve solo verdadero o falso y conserva cerradas las tablas base.

**Alternatives considered**:

- Conceder `SELECT` anónimo a `beneficiary_images`: rechazado porque expondría rutas y metadatos de borradores y archivados.
- Hacer público el bucket: rechazado porque permitiría acceso por URL sin comprobar el estado del perfil.
- Crear URLs en un servidor adicional: seguro, pero añade infraestructura innecesaria y se aleja del presupuesto $0.
