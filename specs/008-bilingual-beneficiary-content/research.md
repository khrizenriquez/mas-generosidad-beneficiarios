# Research: Contenido bilingüe de beneficiarios

## Decision 1: tabla normalizada por localización

**Decision**: Usar `beneficiary_localizations` y
`beneficiary_image_localizations` en vez de columnas por idioma o JSONB.

**Rationale**: Cada fila tiene una clave única `(beneficiary_id, locale)`,
checks de idioma y límites de texto equivalentes a los existentes. Las reglas
de RLS son claras y un idioma futuro no exigiría cambiar el perfil base.

**Alternatives considered**:

- Columnas `school_grade_en`, etc.: rápidas para dos idiomas, pero multiplican
  validadores, consultas y migraciones.
- `jsonb translations`: flexible, pero permite campos faltantes o con formas
  distintas sin que PostgreSQL los pueda proteger de forma sencilla.

## Decision 2: español completo; inglés opcional pero atómico

**Decision**: Publicar desde borrador requiere una localización española
completa. La inglesa puede no existir; si tiene cualquier campo principal, los
cinco deben existir al publicar. Un perfil ya publicado puede recibir una fila
inglesa parcial mientras se completa, pero el catálogo no la expone.

**Rationale**: Protege los perfiles existentes, permite una traducción gradual
y evita que visitantes lean una mezcla de campos traducidos y vacíos.

## Decision 3: RPC devuelve las localizaciones disponibles en una carga

**Decision**: `get_public_beneficiaries` y `get_public_beneficiary` devuelven
un objeto `localizations` con las versiones `es` y `en` que estén completas.

**Rationale**: Mantiene la única frontera pública existente, reduce cambios de
idioma a selección en memoria y evita consultas por perfil/idioma.

**Alternative rejected**: Una RPC por idioma reduce bytes iniciales, pero cada
alternancia produce una solicitud y no cumple la carga anticipada solicitada.

## Decision 4: nombre e imágenes son compartidos; texto alternativo sí se localiza

**Decision**: `full_name`, edad, género y archivos de foto permanecen en
`beneficiaries`/`beneficiary_images`; solo `alt_text` tiene localizaciones.

**Rationale**: El nombre es identidad y no una traducción. Los mismos bytes de
imagen no deben duplicarse. El texto alternativo es contenido presentado y se
debe adaptar al idioma sin filtrar la otra versión.

## Decision 5: disponibilidad separada de fallback

**Decision**: `selectLocalization(profile, locale)` devuelve una localización
completa o `null`. Las pantallas usan `null` para una tarjeta o detalle de
estado localizado.

**Rationale**: Evita por diseño usar el contenido español en inglés (o
viceversa) y facilita pruebas negativas de ausencia de fallback.

## Decision 6: invalidez y caché

**Decision**: Las claves de consultas públicas no incluyen `locale`; después
de guardar se invalidan una vez.

**Rationale**: TanStack Query ya almacena el objeto recibido. Evitar que el
idioma sea parte de la clave demuestra que la alternancia no produce una nueva
consulta. Se mantienen los límites de vida actuales de la caché.
