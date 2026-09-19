# Feature Specification: Lanzamiento cloud y analítica anónima

**Feature Branch**: `feat/cloud-launch-analytics`

**Created**: 2026-09-18

**Status**: Draft

**Input**: Publicar el catálogo desde la rama principal, activar analítica anónima de visitantes y cargar el documento privado como 41 borradores sin exponer secretos, fotografías de demostración ni fechas ficticias.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar historias publicadas de forma segura (Priority: P1)

Como futuro donante, quiero abrir el catálogo público y navegar las historias autorizadas para conocer a la organización sin recibir información privada de beneficiarios.

**Why this priority**: La publicación segura es el propósito principal del lanzamiento.

**Independent Test**: Una persona no autenticada abre el enlace público, navega las historias publicadas y confirma que no puede acceder a borradores, archivados, fechas completas de nacimiento ni fotografías privadas.

**Acceptance Scenarios**:

1. **Given** que existe un despliegue de producción, **When** un visitante abre una ruta pública o una historia publicada, **Then** recibe la experiencia prevista en español y puede volver a la portada.
2. **Given** que existen borradores o perfiles archivados, **When** un visitante intenta accederlos directamente, **Then** no recibe sus datos ni sus fotografías.
3. **Given** que una historia publicada incluye una fecha de nacimiento administrativa, **When** un visitante la consulta, **Then** solo ve la edad calculada.

---

### User Story 2 - Administrar contenido autorizado (Priority: P1)

Como persona administradora autorizada, quiero iniciar sesión y gestionar borradores para revisar los perfiles antes de publicarlos.

**Why this priority**: La ONG necesita mantener la revisión humana y el consentimiento previo a toda publicación.

**Independent Test**: Un administrador autorizado puede iniciar sesión, consultar los 41 borradores importados y completar el flujo de edición; una cuenta ajena no puede entrar al área administrativa.

**Acceptance Scenarios**:

1. **Given** una cuenta incluida en la allowlist administrativa, **When** inicia sesión, **Then** puede acceder al área de administración.
2. **Given** una cuenta autenticada que no está autorizada, **When** intenta abrir el área administrativa, **Then** queda rechazada sin poder modificar contenido.
3. **Given** el documento privado disponible únicamente en una terminal controlada, **When** se importa una vez, **Then** se crean exactamente 41 borradores y ninguno se publica automáticamente.

---

### User Story 3 - Conocer el alcance del sitio sin rastrear personas (Priority: P2)

Como responsable de la ONG, quiero consultar métricas agregadas de visitas para conocer el alcance del catálogo sin crear perfiles de visitantes ni almacenar sus datos en el producto.

**Why this priority**: Aporta visibilidad operativa sin comprometer la privacidad de quienes visitan una plataforma con historias sensibles.

**Independent Test**: El responsable observa métricas de visitas y páginas consultadas, mientras el repositorio, la base de datos de la aplicación y el navegador no registran datos identificables ni eventos personalizados.

**Acceptance Scenarios**:

1. **Given** una visita al sitio de producción, **When** el responsable consulta el panel de analítica, **Then** ve métricas agregadas de navegación.
2. **Given** una búsqueda, login o navegación de una persona visitante, **When** se registra la analítica, **Then** no se guarda el término buscado, un correo, una contraseña, una fecha de nacimiento ni un identificador persistente en el producto.

### Edge Cases

- Si el despliegue no recibe la configuración pública necesaria, el sitio muestra una recuperación clara y no utiliza datos de demostración en producción.
- Si el proveedor de base de datos está pausado o no responde, las páginas muestran un error recuperable sin revelar datos administrativos.
- Si una importación se ejecuta otra vez, no duplica los 41 perfiles ni cambia su estado de borrador.
- Si la analítica no está disponible, el catálogo y la administración siguen funcionando.
- Si una rama de vista previa se publica, no sustituye la producción ni requiere secretos adicionales.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST publicar la versión aprobada de la rama principal en el dominio de producción previsto y conservar las rutas públicas y administrativas.
- **FR-002**: El sistema MUST conservar el acceso público por enlace, la exclusión de buscadores y las cabeceras de seguridad existentes.
- **FR-003**: El sistema MUST usar únicamente analítica agregada y anónima, sin cookies de seguimiento, eventos personalizados ni perfiles persistentes de visitantes.
- **FR-004**: El sistema MUST mantener el registro público deshabilitado y permitir administración solo a cuentas autenticadas incluidas explícitamente en la allowlist.
- **FR-005**: El sistema MUST cargar exactamente 41 perfiles MG-001 a MG-041 como borradores privados y excluir MG-042.
- **FR-006**: El sistema MUST omitir fotografías de demostración y fechas ficticias durante la carga inicial de producción.
- **FR-007**: El sistema MUST impedir que personas visitantes accedan a fechas de nacimiento completas, notas privadas, borradores, archivados o fotografías no autorizadas.
- **FR-008**: El sistema MUST mantener secretos, contraseñas, documentos fuente, fotografías originales y datos reales fuera de Git, del navegador y de la configuración pública de despliegue.
- **FR-009**: El sistema MUST proporcionar instrucciones de recuperación y una comprobación de producción para autenticación, contenido, privacidad, analítica y errores de red.
- **FR-010**: El cambio MUST llegar mediante un único Pull Request revisable hacia `main`, sin despliegue manual que omita la revisión humana.

### Key Entities *(include if feature involves data)*

- **Perfil importado**: Registro privado inicial proveniente del documento autorizado, identificado por código y pendiente de revisión antes de cualquier publicación.
- **Cuenta administrativa**: Cuenta autenticada incluida explícitamente para gestionar perfiles; no contiene ni expone contraseñas en el producto.
- **Métrica agregada de visita**: Conteo anónimo de alcance y navegación que no identifica ni perfila a una persona.
- **Configuración de producción**: Valores públicos mínimos que permiten al catálogo comunicarse con el servicio de datos sin exponer secretos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona visitante puede abrir la portada y una historia publicada desde el enlace de producción, en móvil y escritorio, sin errores de navegación.
- **SC-002**: El 100% de los intentos anónimos verificados contra borradores, archivados, fechas completas, notas privadas y fotografías no autorizadas es rechazado o devuelve contenido vacío.
- **SC-003**: La carga inicial crea exactamente 41 borradores, 0 publicaciones automáticas y 0 fotografías de demostración.
- **SC-004**: El 100% de los perfiles que aparecen en búsqueda pública pertenece al estado publicado.
- **SC-005**: El responsable puede consultar métricas agregadas sin que el repositorio, la aplicación ni la base de contenido persistan correos, contraseñas, términos de búsqueda o identificadores persistentes de visitantes.
- **SC-006**: La batería de calidad, seguridad y navegación definida para el proyecto finaliza correctamente antes de abrir el Pull Request.

## Assumptions

- El dominio temporal existente seguirá siendo el destino de producción hasta que la ONG aporte un subdominio propio.
- La configuración de cuentas, variables públicas y analítica se hará en las consolas de los proveedores por una persona autorizada, no dentro de Git.
- El documento fuente y la clave temporal necesaria para importarlo permanecen solo en el equipo local autorizado.
- La ONG revisará cada borrador, dispondrá del consentimiento externo necesario y añadirá fotografías y fechas correctas antes de publicar.
- El lanzamiento no añade pagos, formularios de contacto, registro público, eventos de marketing ni analítica identificable.
