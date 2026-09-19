# Feature Specification: Lanzamiento cloud y analítica anónima

**Feature Branch**: `feat/cloud-launch-analytics`

**Created**: 2026-09-18

**Status**: Ready for review

**Input**: Publicar el catálogo desde la rama principal, activar analítica anónima de visitantes, cargar el documento privado y publicar temporalmente los 41 perfiles autorizados sin exponer secretos ni fechas completas.

## User Scenarios & Testing _(mandatory)_

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

Como persona administradora autorizada, quiero iniciar sesión y gestionar los perfiles publicados para sustituir progresivamente los datos temporales y archivar cualquier perfil retirado.

**Why this priority**: La ONG necesita mantener la revisión humana y el consentimiento previo a toda publicación.

**Independent Test**: Un administrador autorizado puede iniciar sesión, consultar los 41 perfiles autorizados y completar el flujo de edición; una cuenta ajena no puede entrar al área administrativa.

**Acceptance Scenarios**:

1. **Given** una cuenta incluida en la allowlist administrativa, **When** inicia sesión, **Then** puede acceder al área de administración.
2. **Given** una cuenta autenticada que no está autorizada, **When** intenta abrir el área administrativa, **Then** queda rechazada sin poder modificar contenido.
3. **Given** el documento privado y la autorización externa confirmada, **When** se prepara la demostración desde una terminal controlada, **Then** se conservan exactamente 41 perfiles publicados y ningún dato privado se imprime ni entra en Git.

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

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema MUST publicar la versión aprobada de la rama principal en el dominio de producción previsto y conservar las rutas públicas y administrativas.
- **FR-002**: El sistema MUST conservar el acceso público por enlace, la exclusión de buscadores y las cabeceras de seguridad existentes.
- **FR-003**: El sistema MUST usar únicamente analítica agregada y anónima, sin cookies de seguimiento, eventos personalizados ni perfiles persistentes de visitantes.
- **FR-004**: El sistema MUST mantener el registro público deshabilitado y permitir administración solo a cuentas autenticadas incluidas explícitamente en la allowlist.
- **FR-005**: El sistema MUST conservar exactamente 41 perfiles MG-001 a MG-041 y excluir MG-042.
- **FR-006**: Después de la confirmación externa de la ONG, el sistema MUST poder preparar una demostración temporal autorizada: publicar los 41 perfiles, asignar `2019-08-19` solo como fecha administrativa temporal y asociar la misma ilustración neutral a cada perfil mediante el bucket privado.
- **FR-007**: El sistema MUST impedir que personas visitantes accedan a fechas de nacimiento completas, notas privadas, borradores, archivados o fotografías no autorizadas.
- **FR-008**: El sistema MUST mantener secretos, contraseñas, documentos fuente, fotografías originales y datos reales fuera de Git, del navegador y de la configuración pública de despliegue.
- **FR-009**: El sistema MUST proporcionar instrucciones de recuperación y una comprobación de producción para autenticación, contenido, privacidad, analítica y errores de red.
- **FR-010**: El cambio MUST llegar mediante un único Pull Request revisable hacia `main`, sin despliegue manual que omita la revisión humana.
- **FR-011**: La interfaz pública MUST cargar Roboto desde Google Fonts con las conexiones previas necesarias y usarla de manera consistente en textos, controles, encabezados y marca tipográfica.
- **FR-012**: El footer MUST mostrar el crédito exacto `Made with ❤️ by Christofer Enríquez`, preservar sus dos enlaces seguros y organizarse en columna centrada en móvil y fila centrada desde el breakpoint pequeño.
- **FR-013**: El formulario, importador y base de datos MUST aceptar únicamente `Niño`, `Niña` o sin especificar para género; los valores históricos no permitidos se normalizan a sin especificar sin exponerse públicamente.

### Key Entities _(include if feature involves data)_

- **Perfil temporalmente publicado**: Registro autorizado identificado por código, con una ilustración neutral común y una fecha administrativa temporal que un administrador puede sustituir.
- **Cuenta administrativa**: Cuenta autenticada incluida explícitamente para gestionar perfiles; no contiene ni expone contraseñas en el producto.
- **Métrica agregada de visita**: Conteo anónimo de alcance y navegación que no identifica ni perfila a una persona.
- **Configuración de producción**: Valores públicos mínimos que permiten al catálogo comunicarse con el servicio de datos sin exponer secretos.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Una persona visitante puede abrir la portada y una historia publicada desde el enlace de producción, en móvil y escritorio, sin errores de navegación.
- **SC-002**: El 100% de los intentos anónimos verificados contra borradores, archivados, fechas completas, notas privadas y fotografías no autorizadas es rechazado o devuelve contenido vacío.
- **SC-003**: La demostración autorizada conserva exactamente 41 perfiles publicados, una imagen derivada común por perfil y no expone ninguna fecha de nacimiento completa.
- **SC-004**: El 100% de los perfiles que aparecen en búsqueda pública pertenece al estado publicado.
- **SC-005**: El responsable puede consultar métricas agregadas sin que el repositorio, la aplicación ni la base de contenido persistan correos, contraseñas, términos de búsqueda o identificadores persistentes de visitantes.
- **SC-006**: La batería de calidad, seguridad y navegación definida para el proyecto finaliza correctamente antes de abrir el Pull Request.
- **SC-007**: En móvil y escritorio, Roboto queda declarada en el documento y el footer muestra sus enlaces completos, sin overflow, con navegación por teclado.

## Assumptions

- El dominio temporal existente seguirá siendo el destino de producción hasta que la ONG aporte un subdominio propio.
- La configuración de cuentas, variables públicas y analítica se hará en las consolas de los proveedores por una persona autorizada, no dentro de Git.
- El documento fuente y la clave temporal necesaria para importarlo permanecen solo en el equipo local autorizado.
- La ONG confirmó el consentimiento externo para esta demostración temporal y sustituirá, desde administración, las fechas y la ilustración común por los datos aprobados de cada perfil.
- El lanzamiento no añade pagos, formularios de contacto, registro público, eventos de marketing ni analítica identificable.
