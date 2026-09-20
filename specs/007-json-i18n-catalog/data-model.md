# Modelo de datos: catálogos JSON de idioma público

Esta funcionalidad no cambia el esquema ni agrega almacenamiento remoto. Sus
entidades existen únicamente dentro del bundle o el navegador.

## Catálogo de idioma

| Campo           | Regla                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------- |
| `locale`        | Solo `es` o `en`; identifica el catálogo y el idioma del documento.                           |
| `messages`      | Árbol de claves estables para cada texto público controlado por la interfaz.                  |
| `brand.name`    | “Más Generosidad” en ambos catálogos; no se traduce por ser identidad.                        |
| `domain.gender` | Etiquetas por idioma para los valores remotos `Niño` y `Niña`; no modifica el valor original. |
| `demoProfiles`  | Contenido ficticio, sin datos personales, usado solo cuando el entorno demo esté habilitado.  |

Las claves deben estar presentes en ambos catálogos. Si un valor falta en el
idioma seleccionado, el lector usa el catálogo español para esa misma clave.

## Preferencia de idioma

| Campo         | Regla                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- |
| valor         | Solo `es` o `en`; cualquier otro valor equivale a `es`.                                   |
| ubicación     | Almacenamiento local por origen, no una tabla, cookie o llamada de red.                   |
| ciclo de vida | Nace por una selección explícita; se intenta leer al iniciar y escribir al cambiar.       |
| fallo         | Si no se puede leer o escribir, el catálogo permanece funcional y usa español al iniciar. |

## Contenido editorial remoto

`full_name`, `public_story`, `school_grade`, `favorite_subject`, `hobby`,
`future_goal`, imágenes y `alt_text` continúan perteneciendo a los contratos
públicos existentes. El catálogo los recibe solo como valores de presentación:
no los persiste, traduce, modifica ni copia a JSON.
