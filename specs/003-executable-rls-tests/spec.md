# Feature Specification: Contrato RLS ejecutable

**Feature Branch**: `fix/local-mvp`

**Created**: 2026-09-15

**Status**: Approved

**Input**: El plan aprobado exige comprobar las políticas SQL/RLS, el contrato público y los límites de publicación con herramientas gratuitas y datos ficticios.

**Entrega consolidada (2026-09-17)**: El usuario solicita completar todos los requisitos locales en una sola rama de fix y un único PR. El entorno local usa Podman y datos ficticios para validación funcional. La preparación y despliegue cloud quedan para otro PR, después de validar esta entrega local.

## User Scenarios & Testing

### User Story 1 - Probar la frontera de privacidad (Priority: P1)

Como responsable técnico de la ONG, quiero evidencia automatizada de que una persona visitante no puede leer ni modificar información privada, para publicar historias sin depender de que la interfaz sea el único control de seguridad.

**Why this priority**: La fecha de nacimiento, las notas privadas, los borradores y los perfiles archivados son datos sensibles; una regresión en esta frontera bloquearía el lanzamiento.

**Independent Test**: En una base nueva con datos exclusivamente ficticios, ejecutar el contrato debe demostrar que el acceso anónimo queda limitado a la proyección pública de perfiles publicados.

**Acceptance Scenarios**:

1. **Given** perfiles ficticios publicados, borradores y archivados, **When** se consulta como visitante, **Then** solo aparecen los publicados y nunca se exponen fecha de nacimiento, notas privadas, autor ni estado administrativo.
2. **Given** una sesión anónima, **When** intenta leer tablas base o crear, modificar o eliminar registros, **Then** la base rechaza la operación.
3. **Given** la ruta de una fotografía asociada a un borrador o perfil archivado, **When** un visitante intenta leerla, **Then** la política de almacenamiento no concede acceso.

---

### User Story 2 - Probar autorización y reglas editoriales (Priority: P1)

Como administradora de la ONG, quiero que las reglas de autorización y publicación se prueben automáticamente, para saber que solo la lista autorizada administra perfiles y que no se publican historias incompletas.

**Why this priority**: La autenticación por sí sola no concede permisos administrativos y la publicación deliberada es una regla no negociable del producto.

**Independent Test**: Con dos cuentas ficticias, una autorizada y otra no autorizada, el contrato debe probar permisos, validación de publicación y límites de fotografías dentro de una transacción reversible.

**Acceptance Scenarios**:

1. **Given** una cuenta autenticada fuera de la lista administrativa, **When** intenta leer o cambiar perfiles, **Then** no obtiene filas ni puede crear o modificar datos.
2. **Given** una cuenta incluida en la lista administrativa, **When** crea o edita un borrador, **Then** la operación está permitida, pero no puede borrar definitivamente un beneficiario.
3. **Given** un perfil incompleto, **When** se intenta publicar, **Then** la base rechaza el cambio.
4. **Given** un perfil con tres fotografías, **When** se intenta añadir una cuarta, **Then** la base rechaza la operación.

---

### User Story 3 - Obtener evidencia en cada cambio (Priority: P2)

Como mantenedor, quiero que el contrato se ejecute automáticamente en cada Pull Request con un entorno desechable, para detectar regresiones antes de que lleguen a `main` sin usar servicios de pago ni credenciales de producción.

**Why this priority**: Una prueba que solo se ejecuta manualmente pierde valor como barrera de seguridad.

**Independent Test**: Un Pull Request puede levantar una base limpia, aplicar todas las migraciones, ejecutar el contrato y destruir el entorno sin secretos externos.

**Acceptance Scenarios**:

1. **Given** un Pull Request, **When** se ejecuta CI, **Then** las migraciones y el contrato real de base forman parte de un check obligatorio y reproducible.
2. **Given** un fallo de migración o de política, **When** se ejecuta CI, **Then** el check falla con el caso contractual afectado.
3. **Given** un equipo con el entorno local requerido, **When** ejecuta el comando documentado, **Then** obtiene el mismo contrato que CI.

### Edge Cases

- Una política existe por nombre pero concede permisos indebidos: las pruebas deben ejercer el rol, no limitarse a buscar texto SQL.
- Una función pública añade accidentalmente una columna privada: el contrato debe validar el conjunto exacto de columnas.
- Una URL o política de fotografía permanece disponible para un perfil no publicado: el contrato debe probar borrador y archivado.
- El entorno local no dispone del motor de contenedores: la documentación debe diferenciar claramente el chequeo estático del contrato ejecutable.
- Los datos de prueba quedan después de una ejecución: todas las pruebas deben revertirse al finalizar.

## Requirements

### User Story 4 - Trabajar localmente con Podman (Priority: P1)

Por solicitud explícita del usuario, el MVP completo debe poder desarrollarse y verificarse con Podman: PostgreSQL, autenticación, Storage y frontend conectado, sin depender de un proyecto remoto.

**Acceptance Scenarios**:

1. Con Podman instalado y su máquina activa, los comandos documentados arrancan los servicios locales y conectan React a ellos.
2. Una cuenta administrativa exclusivamente local puede crear, editar, publicar y archivar perfiles ficticios; el visitante consulta las mismas RPC y fotografías firmadas que se usarán en la nube.
3. El contrato SQL se ejecuta contra PostgreSQL en Podman y los flujos administrativos y públicos se prueban contra Auth y Storage locales reales.
4. Detener el entorno conserva sus datos; ningún comando local afecta proyectos remotos ni otros contenedores.
5. La misma aplicación y migraciones se mantienen desplegables en Vercel y Supabase; las credenciales locales y las de nube no se mezclan.

### Functional Requirements

- **FR-001**: El sistema MUST ejecutar todas las migraciones desde cero antes de evaluar el contrato de seguridad.
- **FR-002**: El contrato MUST probar acceso anónimo, acceso autenticado no autorizado y acceso administrativo autorizado usando identidades ficticias.
- **FR-003**: El contrato MUST demostrar que las tablas base no son legibles ni modificables por visitantes.
- **FR-004**: El contrato MUST demostrar que la proyección pública solo contiene perfiles publicados y excluye todos los campos privados y administrativos.
- **FR-005**: El contrato MUST verificar el rechazo de publicaciones incompletas, el máximo de tres fotografías y la ausencia de borrado definitivo de beneficiarios.
- **FR-006**: El contrato MUST verificar que las fotografías de borradores y perfiles archivados no son legibles por visitantes.
- **FR-007**: Las pruebas MUST usar únicamente datos ficticios y revertirlos al finalizar.
- **FR-008**: Cada Pull Request MUST ejecutar el contrato sin secretos ni conexiones a entornos remotos.
- **FR-009**: El repositorio MUST conservar un chequeo estático rápido independiente para equipos que todavía no tengan disponible el entorno ejecutable.
- **FR-010**: La documentación MUST explicar requisitos, comandos y resultados esperados tanto localmente como en CI.
- **FR-011**: El harness MUST soportar Podman local con CLI fijada, configuración de conexión, cuenta ficticia de prueba y arranque/parada reproducibles.
- **FR-012**: Las pruebas de integración MUST validar login, edición, publicación, hasta tres fotos WebP, acceso público firmado y archivado contra servicios locales reales.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El 100% de los Pull Requests ejecuta las pruebas reales de privacidad y autorización antes de integrarse.
- **SC-002**: El contrato cubre los tres roles de acceso, los tres estados de perfil y el límite de tres fotografías con datos ficticios.
- **SC-003**: Cualquier exposición de una columna privada, borrador, perfil archivado o fotografía no publicada provoca un resultado fallido identificable.
- **SC-004**: La ejecución no requiere credenciales de producción, proyecto remoto ni gasto adicional.
- **SC-005**: Una ejecución exitosa no deja registros, usuarios ni archivos de prueba persistentes.

## Assumptions

- Los ejecutores locales del contrato completo disponen de un motor de contenedores compatible.
- GitHub Actions ofrece el motor de contenedores requerido en sus runners hospedados.
- La migración existente sigue siendo la fuente única del esquema; las pruebas no recrean objetos de producción.
- Los datos ficticios se crean dentro de cada archivo de prueba y nunca incluyen información del Word privado.
- La aplicación continúa usando Supabase Free; esta feature no conecta CI con el proyecto remoto.
