# Diseño: contenido bilingüe de beneficiarios

**Fecha:** 2026-09-22  
**Estado:** Aprobado por la solicitud de implementación

## Objetivo

Permitir que la ONG redacte contenido editorial de cada perfil en español e
inglés. El catálogo público debe cambiar instantáneamente entre las versiones
que ya recibió, sin traducir, reescribir ni hacer *fallback* del contenido.

## Decisión

Se usará una tabla normalizada de localizaciones por perfil, en vez de añadir
columnas `*_en` o almacenar un JSON no validado en `beneficiaries`.

| Alternativa | Ventaja | Desventaja | Decisión |
| --- | --- | --- | --- |
| Columnas `*_en` | Menos archivos al inicio | Duplica reglas y no escala a un tercer idioma | No usar |
| JSONB en el perfil | Menos tablas | Valida peor, complica contratos SQL y consultas | No usar |
| Filas por idioma | Reglas, RLS y RPC explícitas; extensible | Requiere migración y formulario por idioma | Usar |

## Modelo de datos

`beneficiaries` conserva los datos comunes: identidad, fecha de nacimiento,
género, estado, fotos y auditoría. Se añade `beneficiary_localizations` con
una fila por combinación única de perfil e idioma (`es` o `en`).

Una localización contiene `school_grade`, `favorite_subject`, `hobby`,
`future_goal` y `public_story`. El nombre no se localiza porque es identidad,
no contenido traducible. Las fotos son comunes; su texto alternativo se
localiza mediante `beneficiary_image_localizations`.

La migración copia los campos editoriales existentes a la fila española de
cada perfil. No elimina ni expone los datos de origen hasta que el código deja
de leerlos; la nueva tabla se vuelve la única fuente para el catálogo y el
formulario. Las columnas históricas se conservan durante esta entrega para no
arriesgar una pérdida irreversible y no se vuelven a escribir.

## Publicación y disponibilidad

Un perfil puede estar publicado con español completo. Inglés es opcional. Si
existe una localización de inglés, sus cinco campos principales deben estar
completos; una versión parcial no cuenta como disponible. Los borradores
pueden ser incompletos en ambos idiomas.

Las tarjetas siguen visibles en ambos idiomas porque el nombre, la edad, el
género y las fotos son comunes. Cuando falta la localización seleccionada, la
tarjeta comunica su indisponibilidad y el detalle muestra una pantalla de
estado localizada. Nunca se muestra el contenido del otro idioma como
sustituto.

## Contrato público y caché

Las RPC públicas continúan siendo la única frontera anónima. Cada respuesta
incluye únicamente perfiles publicados y un objeto de localizaciones para
`es` y `en`; no incluye fecha de nacimiento, notas, estados internos ni datos
administrativos. El cliente selecciona la localización ya recibida según el
selector.

TanStack Query usa una clave independiente del idioma. La primera carga de
lista o detalle conserva ambas localizaciones en memoria durante la sesión, de
modo que alternar idioma no solicita datos de nuevo. Una invalidación después
de guardar conserva la coherencia.

## Administración

El área administrativa sigue en español. El formulario muestra grupos
claramente rotulados para contenido en español e inglés, sin exigir inglés
para publicar. La gestión de fotografías permite editar el texto alternativo
en ambos idiomas. Los errores de publicación apuntan al grupo de idioma y
campo correspondiente.

## Seguridad, pruebas y exclusiones

RLS permite a la allowlist administrativa gestionar las tablas de
localización. `anon` no tiene privilegios directos. Las RPC aplican el estado
`published` antes de reunir localizaciones. Se prueban la migración española,
la prohibición de exponer datos privados, publicación con solo español,
rechazo de inglés parcial, el estado de idioma ausente, la caché sin nueva
solicitud, accesibilidad y el formulario móvil.

No se añaden traducción automática, nuevos idiomas, analítica de idioma,
registro público, ni datos reales al repositorio.

## Estimación

Dos a tres días de trabajo: aproximadamente un día para la base de datos y
contratos, uno para formulario y catálogo, y medio a un día para pruebas,
Podman y revisión visual.
