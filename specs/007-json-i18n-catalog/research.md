# Investigación: catálogos JSON de idioma público

## Decisión: catálogos JSON estáticos importados por la SPA

**Rationale**: Dos archivos pequeños incluidos en el build satisfacen el
requisito de texto centralizado, evitan fallos de red y permiten que el primer
render tenga todos sus estados disponibles. También cumplen la preferencia de
implementación propia sin añadir dependencias.

**Alternatives considered**:

- Cargar catálogos desde una URL: reduce marginalmente el bundle, pero añade
  errores de red y un estado de carga para el propio idioma.
- Adoptar una biblioteca de internacionalización: aporta un ecosistema más
  amplio, pero añade dependencia y no es necesaria para dos idiomas y un único
  catálogo público.

## Decisión: español fijo inicialmente, con preferencia local explícita

**Rationale**: El producto requiere español por defecto, aun si el navegador
está configurado en otro idioma. `localStorage` puede persistir una preferencia
por origen entre sesiones, pero puede lanzar errores si la política del usuario
lo bloquea; por ello la lectura y escritura estarán protegidas y fallarán a
español sin interrumpir el catálogo. [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

**Alternatives considered**:

- Detectar `navigator.language`: contradice el idioma inicial definido.
- Usar una cookie: introduce almacenamiento y cabeceras que no aportan valor a
  una preferencia estrictamente local.

## Decisión: pluralización nativa y plantillas con valores explícitos

**Rationale**: Los conteos y la edad no se forman mediante concatenación de
cadenas. El módulo seleccionará una variante del JSON con `Intl.PluralRules` y
reemplazará solo marcadores nombrados, de modo que español e inglés mantengan su
gramática. [MDN: Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

**Alternatives considered**:

- Condiciones `count === 1` en componentes: dispersa reglas lingüísticas y deja
  frases fuera del catálogo.
- Traducir en la base de datos: altera contenido editorial y exige un cambio de
  modelo fuera de alcance.

## Decisión: actualizar `lang` y el título en el documento

**Rationale**: El idioma declarado del documento permite que tecnologías
asistivas interpreten correctamente el texto de la interfaz. El proveedor
actualizará el atributo al cambiar la preferencia, sin modificar las rutas. [MDN:
atributo lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang)

**Alternatives considered**:

- Mantener `lang="es"` fijo: anuncia un idioma incorrecto cuando el visitante
  eligió inglés.
- Duplicar rutas con prefijo de idioma: rompe enlaces existentes y excede el
  alcance solicitado.

## Decisión: contenido de Supabase literal y etiquetas de dominio localizadas

**Rationale**: Los campos editoriales representan contenido aprobado por la ONG
e incluyen datos sensibles. Deben mostrarse exactamente como los entrega el
contrato público. Las etiquetas de la interfaz, y las representaciones de
valores controlados como género, pueden cambiar por idioma sin cambiar el valor
almacenado.

**Alternatives considered**:

- Traducir automáticamente contenido editorial: sería inexacto, no revisado y
  contrario al requisito de dignidad y privacidad.
- Añadir campos multilingües a Supabase: requiere edición adicional y una
  migración no necesaria para esta entrega.
