# Diseño: internacionalización propia con catálogos JSON

**Fecha:** 2026-09-20  
**Estado:** aprobado para revisión de especificación  
**Idiomas iniciales:** español (`es`) e inglés (`en`)

## Objetivo

Permitir que cada visitante del catálogo público consulte la interfaz en español
o inglés, sin introducir una dependencia de internacionalización ni modificar el
contenido editorial almacenado en Supabase. Español es el idioma inicial
determinista; el idioma elegido se conserva únicamente en el navegador.

El área administrativa seguirá exclusivamente en español durante este alcance.

## Alcance

Se internacionalizan todos los textos que el frontend controla en el catálogo
público: navegación, encabezado, pie, portada, tarjetas, detalle, galería,
mensajes de carga/error/vacío, etiquetas accesibles, formato de edad, conteos y
títulos del documento. También se localizan los datos ficticios del modo demo,
que son contenido de interfaz de prueba y no datos de Supabase.

No se cambian rutas (`/`, `/historias/:code`, `/admin`), modelo de datos, RLS,
bucket, analítica, autenticación ni el área administrativa. El selector no se
muestra en las rutas `/admin/*`.

## Decisiones

### Catálogos estáticos y módulo propio

Se crearán catálogos JSON versionados para `es` y `en`, importados por el build.
No se solicitan archivos por red y no se añade una dependencia como i18next.
Un módulo JavaScript pequeño proporciona:

- la lista permitida de idiomas y metadatos visibles;
- el idioma actual y `setLocale` mediante React Context;
- `t(clave, valores)` con interpolación segura de valores como `{count}` o
  `{age}`;
- una ruta de respaldo explícita a español cuando una clave no exista;
- pluralización con `Intl.PluralRules`, no concatenación de cadenas;
- persistencia en `localStorage` bajo una clave propia, con protección ante
  almacenamiento no disponible.

La app no detecta ni fuerza el idioma del navegador: abre en español aun cuando
el navegador esté en inglés. Solo una selección explícita de la persona cambia
el idioma; al volver a abrir el sitio se conserva esa preferencia local.

### Límites entre interfaz y contenido de beneficiarios

Nunca se traducen, transmiten ni reescriben desde el cliente los campos que
vienen de la base de datos: nombre, historia, grado, asignatura favorita,
pasatiempo, aspiración, texto alternativo editorial o fotos. Conservan el idioma
en que la ONG los editó.

Los valores de dominio se mantienen en PostgreSQL tal como están. Por ejemplo,
`Niño` y `Niña` son valores administrativos estables; una tabla de etiquetas en
cada catálogo puede presentarlos como `Boy` y `Girl` sin cambiar el dato remoto.
Las etiquetas de campo, unidades como edad y plantillas de `aria-label` sí se
traducen.

### Selector público

El encabezado público tendrá un control visible, navegable por teclado y con
nombre accesible. Mostrará el idioma actual y opciones `Español` / `English`;
en pantallas estrechas puede usar las abreviaturas `ES` / `EN`, conservando el
nombre completo para tecnologías asistivas. Cambiar idioma actualiza la interfaz
sin recarga, mantiene la ruta y no genera eventos de analítica personalizados.

El idioma se aplica también a `document.documentElement.lang` y al título de la
página. La identidad de marca “Más Generosidad” no se traduce.

### Errores, estados y datos de demostración

Los servicios y utilidades no deben producir frases españolas que lleguen a la
persona visitante. Entregarán códigos de error estables y la capa visual los
resolverá mediante los catálogos. Las validaciones y formatos ya exclusivos del
admin permanecen en español por alcance.

Los perfiles ficticios actuales se separarán del código de presentación mediante
catálogos de demo por idioma. Esto no altera los perfiles reales ni se activa
cuando hay configuración de Supabase.

## Estructura prevista

```text
src/
├── i18n/
│   ├── locales/
│   │   ├── es.json
│   │   └── en.json
│   ├── catalog.js             # carga, validación y fallback de catálogos
│   ├── I18nProvider.jsx       # idioma, persistencia y html lang
│   └── useI18n.js             # hook t(), locale y setLocale()
├── components/layout/
│   └── PublicLayout.jsx       # selector solamente en catálogo público
├── components/story/          # consume t() sin traducir los campos remotos
└── pages/                     # portada, detalle y página no encontrada
```

Las claves se organizan por superficie (`layout`, `home`, `story`, `gallery`,
`errors`, `a11y`, `demo`) en vez de por componente interno, para que cada
catálogo sea legible y las traducciones no dupliquen estructura técnica.

## Accesibilidad y calidad

- La selección se podrá abrir, recorrer y cerrar con teclado; tendrá foco
  visible y contraste WCAG AA.
- Los conteos, edades y etiquetas dinámicas usarán plantillas y pluralización
  para no producir frases gramaticalmente incorrectas.
- La búsqueda continuará ignorando acentos y mayúsculas; su normalización ya no
  codificará una configuración española innecesaria.
- La interfaz puede mostrar una traducción aun si `localStorage` está bloqueado;
  simplemente no la conservará entre sesiones.
- Catálogos con claves faltantes usarán el valor español y producirán una señal
  de desarrollo controlada, nunca un texto técnico para visitantes.

## Pruebas y aceptación

La entrega debe cubrir, como mínimo:

1. Español por defecto, aun con un navegador configurado en inglés.
2. Cambio `es` ↔ `en` sin recarga y persistencia tras remontar la app.
3. Selector presente en catálogo público y ausente en todas las rutas admin.
4. Etiquetas, errores, vacío, carga, conteos, edad, atributos ARIA y título
   actualizados al idioma elegido.
5. Campos recibidos desde Supabase conservados literalmente en ambas vistas.
6. Traducción de etiquetas de género sin modificar los valores admitidos por
   formulario o base de datos.
7. Búsqueda tolerante a acentos en ambos idiomas y catálogo demo localizado.
8. Pruebas unitarias del traductor y Playwright móvil/escritorio del selector,
   foco y navegación pública.
9. `npm run verify`, `npm run test:e2e`, `npm run privacy:check` y la revisión
   de diferencias sin datos reales antes del PR.

## Exclusiones explícitas

- Detección automática por geolocalización o encabezados del navegador.
- Traducción automática o IA para contenido de beneficiarios.
- Internacionalización del editor administrativo en esta entrega.
- Nuevas tablas, columnas, migraciones, cookies, telemetría o servicios
  externos.
