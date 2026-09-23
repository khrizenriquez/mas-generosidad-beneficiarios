# Feature Specification: Contenido bilingüe de beneficiarios

**Feature Branch**: `feat/bilingual-beneficiary-content`

**Created**: 2026-09-22

**Status**: Ready for planning

**Input**: Guardar contenido editorial de cada beneficiario en español e
inglés desde el formulario administrativo. Al cambiar el selector público,
mostrar la versión correspondiente ya cargada en memoria; si la versión no
existe, no usar el otro idioma y presentar un mensaje localizado de contenido
no disponible.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Gestionar las dos versiones de una historia (Priority: P1)

Como administrador autorizado, quiero ingresar y modificar el contenido
editorial en español e inglés para que la ONG controle cada versión publicada.

**Why this priority**: Sin una fuente editorial administrable para ambos
idiomas, el catálogo no puede ofrecer historias realmente bilingües.

**Independent Test**: Un administrador crea un borrador con ambas versiones,
lo edita, lo publica y vuelve a abrirlo para verificar que cada campo quedó en
el grupo de idioma correcto.

**Acceptance Scenarios**:

1. **Given** un administrador abre un perfil nuevo o existente, **When**
   ingresa datos editoriales para español e inglés, **Then** cada versión se
   guarda por separado sin modificar identidad, fotos ni datos privados.
2. **Given** un administrador guarda un borrador, **When** deja incompleto
   uno o ambos idiomas, **Then** el sistema conserva el borrador y permite
   continuar después.
3. **Given** un perfil con español completo e inglés ausente, **When** el
   administrador lo publica, **Then** la publicación es válida.
4. **Given** un perfil con una versión de inglés iniciada, **When** intenta
   publicarlo con campos ingleses principales incompletos, **Then** recibe un
   error claro y el perfil no queda publicado con una versión parcial.

---

### User Story 2 - Leer la versión elegida sin espera adicional (Priority: P1)

Como visitante, quiero alternar entre español e inglés y leer la historia que
la ONG preparó para ese idioma sin una recarga ni una espera adicional.

**Why this priority**: El selector solo tiene valor si cambia el contenido
editorial real de manera inmediata y fiel.

**Independent Test**: Con un perfil sintético que contiene ambas versiones, un
visitante abre una historia, cambia de idioma y verifica que cada dato
editorial cambia sin realizar otra consulta de catálogo o detalle.

**Acceptance Scenarios**:

1. **Given** una persona abre el catálogo o un detalle, **When** termina la
   carga inicial, **Then** las versiones española e inglesa disponibles para
   esa respuesta quedan listas para el selector durante la sesión.
2. **Given** una historia tiene ambas versiones completas, **When** la persona
   elige el otro idioma, **Then** se muestran los datos de ese idioma sin
   recargar la ruta ni reutilizar contenido del idioma anterior.
3. **Given** una historia solo tiene una versión disponible, **When** la
   persona selecciona el idioma ausente, **Then** ve un estado localizado que
   explica que esa historia aún no está disponible en el idioma elegido.
4. **Given** una historia tiene fotografías, **When** cambia el idioma,
   **Then** el texto alternativo corresponde al idioma disponible o usa un
   fallback de interfaz no editorial si el texto alternativo está ausente.

---

### User Story 3 - Preservar privacidad y catálogo completo (Priority: P2)

Como responsable de la ONG, quiero que el contenido bilingüe mantenga las
mismas protecciones actuales y que un idioma incompleto no haga desaparecer a
la persona del catálogo.

**Why this priority**: La traducción no debe reducir controles de privacidad ni
ocultar personas solo por estar pendiente una versión editorial.

**Independent Test**: Una prueba anónima solo recibe perfiles publicados,
ninguna fecha de nacimiento o dato privado, y ve una tarjeta marcada como no
disponible cuando el idioma seleccionado no existe.

**Acceptance Scenarios**:

1. **Given** una solicitud pública, **When** pide perfiles, **Then** recibe
   solo los campos públicos de perfiles publicados y sus versiones
   editoriales disponibles.
2. **Given** un perfil borrador o archivado, **When** una persona visitante
   intenta consultar sus datos o localizaciones, **Then** no recibe ninguna
   versión ni fotografía.
3. **Given** una persona selecciona inglés y una tarjeta solo tiene español,
   **When** ve el listado, **Then** la tarjeta conserva nombre y fotografía
   comunes e indica que la historia no está disponible en inglés.

### Edge Cases

- Si una localización no existe, se muestra un estado localizado; no se usa el
  contenido editorial de otro idioma como fallback.
- Si una localización existe pero está incompleta, se trata como no disponible
  en el catálogo público y la publicación la rechaza hasta completarla.
- Si falla la carga inicial, se conserva el estado de error y reintento ya
  localizado; no se intenta una consulta adicional al cambiar selector.
- Si el navegador no permite almacenamiento local, la selección funciona en la
  sesión actual y se reinicia en español en una visita nueva.
- Las tarjetas siguen buscando por nombre común, ignorando acentos,
  mayúsculas y espacios exteriores en ambos idiomas.
- Si un texto alternativo de imagen no existe para el idioma elegido, el
  navegador recibe una etiqueta de interfaz localizada, no el texto
  alternativo del otro idioma.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema MUST guardar por perfil una versión editorial en
  español y, opcionalmente, una versión editorial en inglés, sin duplicar
  fecha de nacimiento, género, código, estado, fotos ni auditoría.
- **FR-002**: Cada versión editorial MUST contener grado escolar, asignatura
  favorita, pasatiempo, aspiración y relato público; el nombre completo se
  mantiene como identidad común y no se traduce.
- **FR-003**: El formulario administrativo MUST permitir editar ambas
  versiones de contenido con grupos claramente identificados en español.
- **FR-004**: Los borradores MAY tener campos y versiones incompletas.
- **FR-005**: Publicar desde borrador MUST exigir fecha de nacimiento, nombre
  y una versión española completa. Una versión inglesa ausente es válida; una
  versión inglesa iniciada pero incompleta MUST impedir esa publicación. Un
  perfil ya publicado MAY recibir una traducción inglesa incompleta, que no se
  mostrará públicamente hasta completarse.
- **FR-006**: El catálogo público MUST obtener todas las versiones disponibles
  autorizadas en su carga inicial de listado o detalle y conservarlas en
  memoria durante la sesión.
- **FR-007**: Al cambiar de idioma, el catálogo MUST seleccionar la versión ya
  cargada sin hacer otra solicitud de datos, recargar la ruta ni alterar datos
  compartidos.
- **FR-008**: Si falta la versión elegida, el catálogo MUST mostrar un estado
  de no disponibilidad definido en los JSON de interfaz para ese idioma y MUST
  NOT presentar el contenido editorial de la otra versión.
- **FR-009**: Las tarjetas MUST permanecer visibles cuando falte la versión
  elegida y MUST comunicar su disponibilidad localizada; nombre, edad, género
  y fotos comunes pueden seguir mostrándose.
- **FR-010**: Los textos alternativos de fotografías MUST poder existir por
  idioma. Si el idioma elegido no tiene texto alternativo, el sitio MUST usar
  una descripción genérica proveniente del JSON de interfaz, no el texto del
  otro idioma.
- **FR-011**: La lectura pública MUST continuar pasando por contratos públicos
  limitados y MUST NOT exponer fecha de nacimiento, notas de importación,
  estados no públicos, auditoría, borradores ni archivados.
- **FR-012**: Visitantes MUST NOT tener privilegios directos sobre las tablas
  de localización; administradores autenticados y autorizados MUST poder
  gestionarlas conforme a la allowlist actual.
- **FR-013**: La migración MUST preservar el contenido editorial español que
  ya existe, sin incluir contenido real en el repositorio, fixtures, logs o
  documentación.
- **FR-014**: Los catálogos JSON MUST incluir los mensajes y etiquetas de
  disponibilidad de versión para español e inglés.
- **FR-015**: La administración permanece en español y no muestra el selector
  público; la funcionalidad no añade idiomas, cuentas, analítica ni
  traducción automática.

### Key Entities

- **Perfil de beneficiario**: Identidad, edad derivada, género, fotografías,
  ciclo de publicación y auditoría que se comparten entre idiomas.
- **Localización de beneficiario**: Versión editorial de un perfil para un
  idioma permitido, con sus campos públicos principales y su disponibilidad.
- **Localización de imagen**: Texto alternativo de una fotografía en un idioma
  permitido, ligado a una fotografía existente del perfil.
- **Disponibilidad editorial**: Resultado de validar que una versión existe y
  contiene todos los campos públicos requeridos para presentarla.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de los campos editoriales públicos de un perfil con dos
  versiones cambia al idioma elegido sin recarga, y no hay solicitudes de
  catálogo o detalle adicionales al alternar durante la sesión.
- **SC-002**: El 100% de los perfiles publicados con español completo y sin
  inglés siguen siendo publicables y muestran el estado localizado al elegir
  inglés.
- **SC-003**: El 100% de los intentos de publicar una versión inglesa parcial
  son rechazados por la validación de interfaz y de base de datos.
- **SC-004**: Las pruebas de contrato demuestran que una solicitud anónima no
  puede leer tablas de localización directamente ni recibir fecha de
  nacimiento, notas, borradores o archivados.
- **SC-005**: Las pruebas de móvil y escritorio demuestran selector, estado de
  disponibilidad, navegación por teclado y contraste WCAG AA en español e
  inglés.
- **SC-006**: La migración de prueba conserva el 100% del contenido español
  preexistente sin introducir datos reales en Git, fixtures ni salidas de
  pruebas.

## Assumptions

- Español es la única versión obligatoria al publicar durante esta entrega;
  inglés se completará paulatinamente por la ONG.
- El nombre legal o editorial de una persona es identidad compartida, no una
  traducción; la búsqueda pública continúa haciéndose por ese nombre.
- Los dos idiomas permitidos son `es` y `en`; añadir otro idioma queda fuera
  del alcance, aunque el modelo no lo impide en una entrega futura.
- Las fotos se mantienen comunes para evitar duplicar archivos; solo el texto
  alternativo se localiza.
- La selección de idioma existente ya persiste en el navegador y seguirá
  siendo la fuente de preferencia de interfaz.
- Una traducción inglesa puede completarse progresivamente después de publicar
  la versión española; mientras esté parcial no cuenta como disponible.
