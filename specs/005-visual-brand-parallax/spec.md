# Feature Specification: Identidad visual y parallax público

**Feature Branch**: `feat/visual-brand-parallax`

**Created**: 2026-09-18

**Status**: Approved

**Input**: Usar la paleta base del logo de Más Generosidad en toda la interfaz, limpiar el footer y crear una portada pública visual con parallax al recorrer las historias y zoom de 20% en las imágenes de las tarjetas.

## User Scenarios & Testing

### User Story 1 - Reconocer la identidad de Más Generosidad (Priority: P1)

Como visitante, quiero que la página use de forma consistente los azules y cianes del logo, para reconocer la identidad de la ONG desde el primer vistazo.

**Why this priority**: La identidad visual es el objetivo principal del cambio y debe llegar a toda la aplicación sin deteriorar contraste ni legibilidad.

**Independent Test**: Abrir la portada y el área administrativa permite comprobar que los colores semánticos, fondos, controles y enlaces provienen de los tokens de la nueva paleta.

**Acceptance Scenarios**:

1. **Given** una persona visita la portada, **When** observa navegación, hero, tarjetas, botones y footer, **Then** reconoce una paleta coherente basada en el cian y azul del logo.
2. **Given** texto sobre colores de marca, **When** se renderiza en móvil o escritorio, **Then** conserva contraste WCAG AA.

---

### User Story 2 - Entender un footer directo (Priority: P1)

Como visitante, quiero un footer breve con los enlaces relevantes, para cerrar la experiencia sin repetir la marca ni contenido que no aplica.

**Why this priority**: El footer actual contiene una declaración que el usuario pidió retirar y una marca lateral redundante.

**Independent Test**: En la portada, comprobar que no aparece la marca compacta ni el texto de privacidad anterior, y que los dos enlaces funcionan de forma segura.

**Acceptance Scenarios**:

1. **Given** una persona llega al footer, **When** lo consulta, **Then** encuentra el enlace a Más Generosidad y “Made with love by Christofer Enríquez ❤️” enlazado a su sitio.
2. **Given** un viewport móvil, **When** el contenido no cabe en una fila, **Then** los enlaces se acomodan centrados sin solaparse.

---

### User Story 3 - Recorrer historias con movimiento accesible (Priority: P1)

Como visitante, quiero que las tarjetas revelen profundidad mientras avanzo por la portada y que sus imágenes respondan al hover, para explorar las historias de una manera visual y clara.

**Why this priority**: El movimiento hace visible la galería de historias sin alterar sus datos ni su navegación.

**Independent Test**: Con historias de prueba, al desplazar la página las tarjetas se revelan gradualmente; al pasar el puntero o enfocar una tarjeta, su imagen escala hasta 20% dentro del marco, sin desbordarse.

**Acceptance Scenarios**:

1. **Given** una persona desplaza la portada, **When** las tarjetas entran al viewport, **Then** aparecen con un desplazamiento vertical y opacidad suaves, una sola vez por tarjeta.
2. **Given** una persona usa mouse o teclado, **When** interactúa con una tarjeta, **Then** su imagen hace zoom de 20% dentro del contenedor y la tarjeta sigue siendo navegable.
3. **Given** el sistema prefiere reducir movimiento, **When** la portada se renderiza, **Then** no hay parallax, transformaciones ni animaciones no esenciales.

### Edge Cases

- Una historia sin foto conserva su placeholder y no intenta aplicar zoom a una imagen inexistente.
- El parallax no produce saltos de layout, listeners globales duplicados ni trabajo continuo para tarjetas fuera del viewport.
- El hover no es la única vía: teclado recibe el mismo tratamiento visual de foco.
- Los enlaces externos conservan apertura segura con `rel="noreferrer"`.
- La experiencia móvil no depende de hover y no corta tarjetas, textos ni imágenes.

## Requirements

### Functional Requirements

- **FR-001**: La interfaz MUST centralizar una paleta derivada del logo con tokens semánticos para cian, azul, fondos, tinta, estados y contraste.
- **FR-002**: La interfaz MUST sustituir los colores heredados fuera de la paleta por tokens del tema, incluidos fondo global, hero, tarjeta, placeholder, administración y footer.
- **FR-003**: El footer MUST eliminar la marca compacta y el texto “Este espacio comparte historias autorizadas por la ONG y protege los datos privados de cada beneficiario.”
- **FR-004**: El footer MUST mostrar “Made with love by Christofer Enríquez ❤️” enlazado a `https://khrizenriquez.github.io/khrizenriquez/` y conservar un enlace seguro a la ONG.
- **FR-005**: Las tarjetas públicas MUST revelarse con parallax ligero basado en su entrada al viewport, sin librerías de animación nuevas.
- **FR-006**: Las imágenes de tarjetas MUST escalar exactamente 20% en hover y foco visible, dentro de un contenedor recortado y sin cambiar el layout.
- **FR-007**: La animación MUST respetar `prefers-reduced-motion: reduce` y desactivarse en ese caso.
- **FR-008**: El cambio MUST preservar rutas, búsqueda, tarjetas sin foto, URLs firmadas, límites de imágenes, RLS y datos existentes.
- **FR-009**: El cambio MUST incluir pruebas para el footer y las interacciones visuales relevantes, y ejecutar las pruebas visibles móvil y escritorio.
- **FR-010**: El cambio MUST no añadir dependencias ni servicios de pago, datos reales, imágenes originales, secretos o cambios de nube.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Las pruebas de accesibilidad no detectan violaciones WCAG A/AA nuevas en la portada ni el footer, en móvil y escritorio.
- **SC-002**: Las pruebas verifican los dos enlaces del footer, la ausencia del texto retirado y el comportamiento de zoom al hover/foco.
- **SC-003**: Una tarjeta visible aplica escala `1.2` a su imagen en interacción sin cambiar sus dimensiones de layout.
- **SC-004**: Con `prefers-reduced-motion: reduce`, las tarjetas no tienen animaciones ni transformaciones de parallax activas.
- **SC-005**: `npm run verify` y `npm run test:e2e` completan correctamente sin dependencias nuevas.

## Assumptions

- La paleta base se toma del logo proporcionado: cian, azul y neutrales de alto contraste; el blanco se usa sobre azul y el azul oscuro sobre superficies claras.
- El parallax se limita a la portada pública; `/admin` permanece funcional y sin movimiento decorativo.
- El enlace de la ONG existente se conserva en el footer.
- Los datos e imágenes reales existentes solo sirven para demostración local y no forman parte de esta rama ni de sus pruebas.
