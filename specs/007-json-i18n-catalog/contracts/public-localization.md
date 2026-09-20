# Contrato de interfaz: localización pública

## Idiomas admitidos

| Identificador | Nombre visible | Idioma del documento | Estado inicial |
| ------------- | -------------- | -------------------- | -------------- |
| `es`          | Español        | `es`                 | Predeterminado |
| `en`          | English        | `en`                 | Alternativo    |

El selector acepta únicamente estos identificadores. Una preferencia ausente o
inválida resuelve a `es`.

## Catálogos

Cada catálogo JSON contiene el mismo conjunto de claves para la superficie
pública. Las claves se agrupan por intención, no por una línea de un componente:

```text
brand.*
layout.*
language.*
home.*
story.*
gallery.*
empty.*
errors.*
a11y.*
domain.gender.*
demoProfiles.*
```

Los mensajes variables usan marcadores nombrados como `{count}`, `{age}`, `{name}`
o `{position}`. Los mensajes plurales contienen una variante para cada categoría
que el catálogo necesite; el lector elige la categoría con el idioma actual.

El nombre de marca pertenece a `brand.name` en ambos JSON para que incluso el
texto invariable tenga una sola fuente. URLs, códigos de ruta y valores de base
de datos no son textos localizables.

## Comportamiento del traductor

La interfaz pública recibe una función de traducción y el idioma actual.

1. Busca la clave en el catálogo del idioma seleccionado.
2. Si no existe, busca la misma clave en español.
3. Interpola únicamente los valores entregados por el componente.
4. Si la clave no existe en español, devuelve una alternativa segura de
   desarrollo; nunca expone un mensaje técnico al visitante.

Los errores de servicios públicos se propagan como códigos estables. La UI los
convierte a un mensaje del catálogo y conserva una acción de reintento cuando
corresponda.

## Frontera editorial

La traducción solo controla textos propios de interfaz. Un campo procedente de
Supabase se inserta literalmente, incluidos nombres, relatos y textos
alternativos de fotos. Para género, el valor `Niño` o `Niña` solo se utiliza
como clave de etiqueta; el valor no se transforma ni guarda.

## Selector y accesibilidad

El selector solo está en `PublicLayout`. Debe comunicar el idioma actual,
permitir seleccionar el otro idioma por teclado, conservar un foco visible y no
producir un evento analítico personalizado. Al cambiar, actualiza el idioma
declarado y el título de la página, mantiene la ruta actual y no consulta la
red.
