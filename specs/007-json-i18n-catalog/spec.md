# Feature Specification: Catálogos JSON de idioma público

**Feature Branch**: `feat/i18n-json-catalog`

**Created**: 2026-09-20

**Status**: Ready for planning

**Input**: Agregar al catálogo público español e inglés con español como idioma
predeterminado, archivos JSON como origen de cada texto controlado por la
interfaz y un selector de idioma arriba a la derecha. La traducción se resuelve
en JavaScript propio; el contenido de Supabase no se modifica ni se traduce. El
área administrativa permanece en español.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Elegir el idioma del catálogo (Priority: P1)

Como visitante, quiero alternar el catálogo público entre español e inglés para
entender su navegación y las etiquetas de cada historia en mi idioma preferido.

**Why this priority**: El selector visible y la traducción de la experiencia
pública son el valor directo solicitado para futuros donantes y visitantes.

**Independent Test**: Una persona abre la portada, cambia de idioma desde el
encabezado, navega a una historia y verifica que la interfaz se actualiza sin
recargar ni alterar el contenido editorial de esa historia.

**Acceptance Scenarios**:

1. **Given** que una persona visita el catálogo por primera vez, **When** abre
   la portada, **Then** ve español como idioma inicial y un selector accesible
   en la parte superior derecha.
2. **Given** que una persona elige inglés, **When** continúa navegando entre la
   portada y una historia, **Then** los textos controlados por el sitio aparecen
   en inglés sin cambiar la ruta ni recargar la página.
3. **Given** que una persona seleccionó un idioma, **When** vuelve a abrir el
   catálogo en el mismo navegador, **Then** se conserva su selección si el
   navegador permite guardar preferencias locales.

---

### User Story 2 - Leer contenido editorial sin alterarlo (Priority: P1)

Como visitante, quiero que al cambiar el idioma se conserven fielmente los
nombres, relatos y demás datos autorizados por la ONG, para no recibir una
traducción automática o una versión modificada de una historia.

**Why this priority**: Los perfiles representan a personas y el idioma de
interfaz no puede modificar ni reinterpretar contenido editorial aprobado.

**Independent Test**: Con un perfil obtenido del servicio de datos, una persona
consulta ambas versiones de interfaz y comprueba que los campos editoriales
recibidos son idénticos, mientras que sus etiquetas y unidades sí cambian.

**Acceptance Scenarios**:

1. **Given** que una historia contiene contenido obtenido del servicio de
   datos, **When** la persona elige inglés, **Then** el nombre, relato, grado,
   intereses, aspiración, fotografías y texto alternativo editorial se muestran
   exactamente como fueron recibidos.
2. **Given** que un perfil contiene una edad y un valor de género permitido,
   **When** cambia el idioma, **Then** cambian la unidad de edad y la etiqueta
   presentada, sin cambiar ni guardar el dato original.

---

### User Story 3 - Mantener una interfaz pública completa y accesible (Priority: P2)

Como persona responsable del sitio, quiero que cada texto público controlado por
la interfaz viva en catálogos revisables, para añadir idiomas o corregir copias
sin dejar frases mezcladas ni afectar el editor administrativo.

**Why this priority**: Una fuente única de textos reduce regresiones y permite
mantener ambas versiones de manera segura.

**Independent Test**: Una revisión automatizada y manual comprueba los estados
de carga, error y vacío, conteos, etiquetas accesibles, tarjetas, galería,
footer, páginas no encontradas y modo demo en los dos idiomas, así como la
ausencia del selector en administración.

**Acceptance Scenarios**:

1. **Given** que el catálogo muestra carga, error, vacío o resultados, **When**
   cambia el idioma, **Then** cada mensaje visible y etiqueta accesible se
   actualiza de forma coherente.
2. **Given** que una persona navega con teclado o lector de pantalla, **When**
   usa el selector, **Then** identifica el idioma actual, puede elegir el otro
   idioma y conserva foco y contraste adecuados.
3. **Given** que una persona abre una ruta administrativa, **When** accede a su
   encabezado, **Then** no se muestra el selector y los textos administrativos
   continúan en español.

### Edge Cases

- Si el navegador no permite guardar preferencias locales, el catálogo sigue
  cambiando durante la sesión y abre de nuevo en español.
- Si un catálogo no contiene una clave, la interfaz usa el valor equivalente en
  español en vez de mostrar una clave técnica o una pantalla vacía.
- Si una traducción es más larga que el texto español, el selector y las
  tarjetas siguen siendo utilizables en una pantalla móvil estrecha.
- Si una historia no tiene fotografía, edad o género, el estado respetuoso y
  sus etiquetas se muestran en el idioma seleccionado sin inventar datos.
- Si el catálogo usa datos demo, los datos ficticios se presentan con la
  versión de idioma elegida y no sustituyen datos reales conectados.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El catálogo público MUST ofrecer español e inglés; español MUST
  ser el idioma inicial para toda primera visita, independientemente del idioma
  del navegador.
- **FR-002**: El catálogo público MUST mostrar un selector de idioma accesible
  en su encabezado superior derecho, con el idioma actual identificable y las
  dos opciones disponibles seleccionables por teclado.
- **FR-003**: Al elegir idioma, el sistema MUST actualizar los textos públicos
  controlados por la interfaz sin recargar, cambiar ruta ni registrar un evento
  personalizado de analítica.
- **FR-004**: El sistema MUST recordar exclusivamente en el navegador la última
  elección explícita de idioma cuando el almacenamiento local esté disponible.
- **FR-005**: Todo texto visible, etiqueta accesible, título, estado de carga,
  error, vacío, conteo y mensaje de recuperación controlado por el catálogo
  público MUST provenir de un catálogo de idioma revisable.
- **FR-006**: Las frases con cantidad, edad u otros valores dinámicos MUST usar
  una formulación gramaticalmente correcta para el idioma seleccionado.
- **FR-007**: El sistema MUST conservar literalmente los campos editoriales
  recibidos del servicio de datos, incluidos nombre, relato, educación,
  intereses, aspiración, fotos y texto alternativo; no los traduce, reescribe ni
  vuelve a guardar al alternar idioma.
- **FR-008**: Las etiquetas de presentación de valores controlados, como edad y
  género, MAY cambiar por idioma, pero los valores de datos y las reglas de
  validación existentes MUST permanecer sin modificación.
- **FR-009**: El selector y los textos de esta funcionalidad MUST estar ausentes
  del área administrativa, que permanece en español.
- **FR-010**: El catálogo público MUST reflejar el idioma elegido en el idioma
  declarado del documento y en su título para tecnologías asistivas y pestañas
  del navegador.
- **FR-011**: La búsqueda pública MUST conservar su comportamiento actual de
  ignorar mayúsculas, espacios exteriores y acentos con ambos idiomas.
- **FR-012**: Esta funcionalidad MUST no añadir datos de visitantes, cookies,
  tablas, campos, migraciones, telemetría identificable ni cambios a las
  fronteras de privacidad existentes.

### Key Entities _(include if feature involves data)_

- **Catálogo de idioma**: Conjunto revisable de textos controlados por el sitio
  para un idioma admitido, con una clave estable por concepto visible.
- **Preferencia de idioma**: Elección explícita, limitada al navegador de una
  persona visitante y sin contenido identificable.
- **Contenido editorial**: Datos autorizados de un perfil recibidos del servicio
  de datos; no forma parte de los catálogos ni se transforma al elegir idioma.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: El 100% de las rutas públicas previstas (portada, detalle y no
  encontrada) muestra español inicialmente y puede alternar entre español e
  inglés sin recarga.
- **SC-002**: En pruebas de navegación móvil y escritorio, el 100% de los
  textos y atributos accesibles de las superficies públicas revisadas cambia al
  idioma elegido, sin claves técnicas visibles.
- **SC-003**: El 100% de los campos editoriales verificados desde el servicio
  de datos conserva exactamente el mismo contenido antes y después de cambiar
  idioma.
- **SC-004**: Una persona puede realizar el cambio de idioma mediante teclado y
  regresar al catálogo con foco visible y contraste suficiente en móvil y
  escritorio.
- **SC-005**: El área administrativa no muestra selector y conserva sus textos
  actuales en español en el 100% de las rutas administrativas revisadas.
- **SC-006**: La entrega completa las verificaciones de calidad, privacidad y
  navegación del proyecto sin datos reales, secretos o cambios remotos.

## Assumptions

- El catálogo público actual es la única superficie que requiere inglés en esta
  entrega; administración y edición permanecen en español.
- La organización revisará las traducciones de interfaz antes de publicar el
  cambio, pero el contenido editorial seguirá en el idioma ingresado por ella.
- La marca “Más Generosidad” se conserva igual en ambos idiomas.
- Las rutas existentes permanecen estables para no romper enlaces compartidos.
- Los dos idiomas iniciales bastan para esta entrega; un idioma adicional se
  incorporará en una funcionalidad posterior mediante un catálogo revisado.
