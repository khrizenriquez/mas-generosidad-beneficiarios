# Feature Specification: Manual local y guía privada de nube

**Feature Branch**: `docs/local-runbook-and-cloud-guide`

**Created**: 2026-09-18

**Status**: Ready for review

**Input**: Validar el MVP ya integrado en `main`, documentar con precisión las tecnologías y la ejecución local, y preparar fuera del repositorio una guía para un posterior despliegue de Supabase Free y Vercel Hobby.

## User Scenarios & Testing

### User Story 1 - Levantar y validar el MVP local (Priority: P1)

Como mantenedor técnico de la ONG, quiero un README claro y actualizado para instalar, arrancar, probar y detener el MVP local, para poder comprobarlo antes de considerar un despliegue público.

**Why this priority**: El entorno local reproducible es la prueba de que el producto integrado funciona y es la base segura para cualquier entrega posterior.

**Independent Test**: Desde un clon limpio, una persona con Node 24, npm y Podman puede seguir el README, abrir el MVP local y ejecutar los comandos de verificación sin usar una cuenta ni una clave de nube.

**Acceptance Scenarios**:

1. **Given** un equipo con los prerrequisitos, **When** ejecuta los comandos de inicio local documentados, **Then** el frontend, Auth, PostgreSQL y Storage quedan disponibles con la URL y el comportamiento indicados.
2. **Given** el entorno local iniciado, **When** ejecuta la batería de validación documentada, **Then** comprende qué comprueba cada comando y qué resultado exitoso debe esperar.
3. **Given** una persona que inspecciona el README, **When** necesita saber qué software mantiene el MVP, **Then** encuentra las tecnologías y versiones relevantes, incluyendo las herramientas de pruebas y contenedores.

---

### User Story 2 - Preparar un despliegue sin exponer secretos (Priority: P1)

Como responsable de despliegue de la ONG, quiero una guía privada y accionable para preparar Supabase y Vercel cuando se autorice el despliegue, para poder hacerlo con el nivel gratuito sin añadir credenciales ni datos personales al repositorio.

**Why this priority**: El producto trata información de beneficiarios; separar el runbook operativo de Git evita convertir secretos, referencias de proyectos o decisiones de cuenta en historial público o compartido.

**Independent Test**: La guía externa enumera los prerrequisitos, las variables permitidas, la secuencia de migraciones, las comprobaciones de seguridad y el rollback, sin incluir ningún valor secreto ni pedir un cambio de nube en esta entrega.

**Acceptance Scenarios**:

1. **Given** que el repositorio no contiene configuración productiva, **When** el responsable recibe la guía privada, **Then** puede crear los proyectos gratuitos, conectar las migraciones y configurar Vercel sin usar la clave de servicio en el navegador.
2. **Given** un proyecto Supabase nuevo, **When** se sigue la guía, **Then** el registro público queda deshabilitado, la primera persona administradora se añade explícitamente y las migraciones se revisan antes de aplicarse.
3. **Given** que termina un despliegue, **When** se realiza la lista de humo, **Then** se verifica que no se exponen fechas de nacimiento, borradores, archivados ni fotos privadas y que el sitio conserva `noindex`.

---

### User Story 3 - Mantener límites de alcance claros (Priority: P2)

Como revisor del Pull Request, quiero que el cambio documental no despliegue ni modifique servicios externos, para revisar de forma aislada las instrucciones antes de abrir un PR específico de nube.

**Why this priority**: Mantiene `main` estable y conserva la revisión humana exigida por la constitución.

**Independent Test**: El diff solo contiene documentación, artefactos de Spec Kit y referencias a comandos; no contiene credenciales, cambios de migración, configuración de producción ni llamadas que alteren Supabase o Vercel.

**Acceptance Scenarios**:

1. **Given** esta rama documental, **When** se revisa el historial y el diff, **Then** no existe un despliegue ni una modificación de configuración remota.
2. **Given** el README versionado, **When** se busca una guía de despliegue detallada, **Then** se indica claramente que se conserva fuera del repositorio.

### Edge Cases

- Podman puede tener una máquina detenida o usar un nombre distinto; el README debe explicar la comprobación y la variable admitida sin suponer Docker Desktop.
- Una persona puede ejecutar el chequeo estático en un equipo sin Podman; el README debe distinguirlo de las pruebas integradas reales.
- Una clave `VITE_*` queda incorporada al bundle de Vite; la guía debe prohibir de forma expresa la clave de servicio y cualquier dato privado como variable pública.
- Los niveles gratuitos, cuotas y pantallas de proveedores cambian; la guía debe remitir a documentación oficial y pedir confirmación antes del lanzamiento.
- Si Supabase está pausado o una migración no está sincronizada, la guía debe ofrecer un camino seguro de diagnóstico que no borre producción.

## Requirements

### Functional Requirements

- **FR-001**: El README MUST describir el propósito actual del producto y las tecnologías principales con las versiones fijadas en el proyecto.
- **FR-002**: El README MUST documentar los prerrequisitos locales, inicio, acceso, desarrollo con recarga, detención, importación privada, respaldo y límites de persistencia de datos.
- **FR-003**: El README MUST separar los comandos de verificación estática de las pruebas que requieren Podman y explicar el resultado esperado de cada grupo.
- **FR-004**: El README MUST mantener las reglas de privacidad: datos reales, Word, fotos, secretos y respaldos no se versionan ni se imprimen en registros.
- **FR-005**: El README MUST indicar que las instrucciones detalladas de nube viven fuera del repositorio y que esta entrega no realiza el despliegue.
- **FR-006**: La guía privada MUST vivir fuera del árbol Git y describir un despliegue futuro en Supabase Free y Vercel Hobby usando únicamente los dos valores públicos requeridos por el cliente: URL de Supabase y clave anónima.
- **FR-007**: La guía privada MUST incluir migraciones revisables, desactivación de registro público, allowlist administrativa, bucket privado, configuración de Auth, configuración de Vercel, comprobaciones de humo, backup y rollback no destructivo.
- **FR-008**: La guía privada MUST prohibir explícitamente la `SUPABASE_SERVICE_ROLE_KEY` en Vercel o en variables prefijadas `VITE_` y no debe contener valores de secretos, IDs de proyecto reales ni información personal.
- **FR-009**: El cambio MUST ejecutar `npm run verify` y la batería local completa contra Podman antes de abrir el Pull Request.
- **FR-010**: El cambio MUST conservar el flujo de una rama corta y Pull Request hacia `main`, sin merge, aprobación automática ni trailer `Co-authored-by`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El README contiene un camino local de inicio y otro de validación que se puede ejecutar con los comandos documentados, sin configuración remota.
- **SC-002**: La ejecución de `npm run verify`, `npm run db:test`, `npm run test:local`, `npm run test:e2e`, `npm run test:backup` y `npm run test:persistence` finaliza correctamente en la rama.
- **SC-003**: La guía privada está fuera del repositorio y el chequeo de privacidad confirma que ningún secreto ni dato personal fue incorporado al cambio versionado.
- **SC-004**: El diff no modifica migraciones, políticas RLS, configuración de producción ni servicios remotos.
- **SC-005**: Una persona revisora puede identificar en menos de cinco minutos las tecnologías, los prerrequisitos y el comando correcto para iniciar el MVP local desde el README.

## Assumptions

- El entorno de referencia usa macOS o Linux con Node 24, npm y Podman; los requisitos de Windows no forman parte de este MVP.
- La guía privada será entregada como Markdown junto al directorio de trabajo, fuera del repositorio y fuera de Git.
- La ONG creará y administrará sus propias cuentas de Supabase y Vercel cuando apruebe un PR posterior de nube.
- Las instrucciones de proveedores se contrastan con sus documentos oficiales en el momento de preparar la guía; sus cuotas y UI pueden cambiar.
- No se crea ni se publica ningún proyecto de nube durante esta feature.
