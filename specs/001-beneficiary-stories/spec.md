# Especificación: Historias de Más Generosidad

**Rama sugerida**: `001-beneficiary-stories`
**Estado**: Aprobada
**Fecha**: 2026-09-14

## Historias de usuario

### P1 · Conocer historias publicadas

Como visitante, puedo ver perfiles publicados, buscar únicamente por nombre y abrir el detalle para conocer edad, educación, intereses, aspiración, relato y fotografías autorizadas.

**Aceptación**

1. La búsqueda ignora mayúsculas y acentos.
2. Ninguna respuesta pública incluye fecha de nacimiento, notas privadas, autor o estados administrativos.
3. Borradores y archivados no aparecen ni generan nuevas URLs firmadas.
4. La ausencia de foto tiene un estado visual digno y accesible.

### P1 · Administrar perfiles

Como administradora autorizada, ingreso con email y contraseña para crear, editar, publicar y archivar perfiles desde un teléfono o escritorio.

**Aceptación**

1. No existe registro público y una cuenta autenticada fuera de `admin_users` es rechazada.
2. Un borrador requiere solo un código válido; publicar exige todos los campos públicos principales y fecha completa.
3. No existe borrado definitivo en la interfaz.
4. Cada perfil admite hasta tres imágenes; se guardan únicamente miniatura y detalle WebP.

### P1 · Importar el documento privado

Como responsable técnico, puedo validar e importar los 41 registros útiles del Word como borradores sin guardar datos intermedios en el repositorio.

**Aceptación**

1. Los códigos quedan `MG-001`–`MG-041`; MG042 vacío se excluye.
2. Las fechas incompletas quedan nulas y se anotan privadamente; no se infiere año.
3. Las fotos del ZIP no se asocian ni importan.
4. El importador no imprime nombres o relatos.

## Requisitos funcionales

- FR-001: SPA pública en español con header y footer enlazados a masgenerosidad.org.
- FR-002: listado, búsqueda por nombre y detalle de historias publicadas.
- FR-003: edad calculada en PostgreSQL a partir de una fecha privada.
- FR-004: administración autenticada con formulario seccionado y estados `draft`, `published`, `archived`.
- FR-005: hasta tres fotos, conversión WebP en navegador y almacenamiento privado.
- FR-006: importación idempotente por código y backup manual cifrado.
- FR-007: todas las rutas enviarán `noindex, nofollow, noarchive`.

## Fuera de alcance

Pagos, donaciones dentro del producto, contacto por perfil, analítica, registro público, IA en producción, consentimiento digital y borrado definitivo.

## Métricas de éxito

- 41 borradores validados por importador y 0 datos personales rastreados por Git.
- Contrato público sin fecha de nacimiento y RLS sin lectura anónima directa a tablas.
- Flujos públicos pasan Playwright en móvil y escritorio.
- Build, formato, lint, unidades, privacidad y contexto pasan con un solo comando.
